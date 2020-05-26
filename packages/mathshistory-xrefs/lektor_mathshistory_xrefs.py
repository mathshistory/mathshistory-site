# -*- coding: utf-8 -*-
from lektor.pluginsystem import Plugin
from lektor.reporter import NullReporter
from lektor.builder import PathCache
from lektor.db import Page
from lektor.environment import PRIMARY_ALT
from lektor.utils import cleanup_path

import os
import re
import sqlite3
import traceback

def db_connect(meta_path):
    path = os.path.join(meta_path, 'xrefs')
    con = sqlite3.connect(path)
    return con

def purge(w):
    rawch = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n']
    for i in range(0, len(rawch)):
        w = w.replace(rawch[i], transch[i])
    return w

class MathshistoryXrefsPlugin(Plugin):
    name = 'mathshistory-xrefs'
    description = u'Automatically generates the cross-references for biographies.'

    def __init__(self, env, id):
        Plugin.__init__(self, env, id)
        self.need_rebuild = {}
        self.reporter = NullReporter(env)

    def create_tables(self, con):
        can_disable_rowid = ('3', '8') <= tuple(sqlite3.sqlite_version.split('.'))
        if can_disable_rowid:
            without_rowid = 'without rowid'
        else:
            without_rowid = ''
        con.execute('''
            create table if not exists xrefs (
                path text,
                mathematician text,
                primary key (path, mathematician)
            ) %s;
        ''' % without_rowid)

    def on_before_build_all(self, builder, **extra):
        con = db_connect(builder.meta_path)
        self.create_tables(con)

        self.need_rebuild = {}

        path_cache = PathCache(self.env)
        with self.reporter.build('build', self):
            to_build = builder.get_initial_build_queue()
            while to_build:
                source = to_build.popleft()
                with builder.new_build_state(path_cache=path_cache) as build_state:
                    prog = builder.get_build_program(source, build_state)
                    prog.produce_artifacts()
                    artifact = prog.primary_artifact
                    prog.artifacts = []

                    # go through all the deleted pages
                    self.process_deleted(build_state, con)

                    # now go through all the modified pages
                    if not artifact: continue
                    current = artifact.is_current
                    if not current:
                        self.process_source(source, con)
                builder.extend_build_queue(to_build, prog)


    def process_deleted(self, build_state, con):
        # (we do this by going through all pages, and seeing if they still exist)
        cur = con.cursor()
        cur.execute('''
            select distinct path from xrefs
        ''', [])
        paths = [v[0] for v in cur.fetchall()]
        for path in paths:
            record = pad_get(build_state.pad, path)
            if record != None:
                continue
            print('deltected deletion: %s' % path)
            # the record has been deleted!
            # get all mathematicians who reference it
            cur.execute('''
                select distinct mathematician from xrefs where path = ?
            ''', [path])
            names = [v[0] for v in cur.fetchall()]
            # and mark them all as dirty
            for name in names:
                if name not in self.need_rebuild:
                    self.need_rebuild[name] = { 'added':[], 'removed':[] }
                self.need_rebuild[name]['removed'].append(path)

    def process_source(self, source, con):
        # for now, make it only history topics
        allowed_types = ['historytopic', 'curve', 'projectpage', 'society', 'page']
        if type(source) != Page or source['_model'] not in allowed_types:
            return

        # get the content
        content = source['content'].source

        # it has been modified! see if there are new references to mathematicians
        pattern = re.compile(r'<m(?:\s+(?P<name>.+?))?>(?P<text>.*?)\<\/m\>', re.MULTILINE | re.DOTALL)
        names = []
        for match in re.findall(pattern, content):
            name = match[0]
            text = match[1]
            if not name:
                last_word = text.split(' ')[-1]
                name = purge(last_word)
            names.append(name)

        # get the list of names we know about already
        cur = con.cursor()
        cur.execute('''
            select distinct mathematician from xrefs where path = ?
        ''', [source.path])
        previous_names = [v[0] for v in cur.fetchall()]

        # are there any new entries?
        new_names = set(names) - set(previous_names)

        # if so, add them to the need_rebuild object, and add them to the db
        for name in new_names:
            if name not in self.need_rebuild:
                self.need_rebuild[name] = { 'added':[], 'removed':[] }
            self.need_rebuild[name]['added'].append(source.path)

        # are there any removed entries?
        removed_names = set(previous_names) - set(names)

        # if so, remove them from the db
        for name in removed_names:
            if name not in self.need_rebuild:
                self.need_rebuild[name] = { 'added':[], 'removed':[] }
            self.need_rebuild[name]['removed'].append(source.path)


    def on_before_build(self, builder, build_state, source, prog, **extra):
        # restrict xrefs to biographies for the moment
        if type(source) != Page or source['_model'] != 'biography':
            return

        # get the artifact from the source
        prog.produce_artifacts()
        artifact = prog.primary_artifact
        prog.artifacts = []
        if not artifact: return

        # should we rebuild this?
        name = source['_slug']
        if name in self.need_rebuild:
            # mark it as dirty, so it gets built
            artifact.set_dirty_flag()

        # is it current? dont bother injecting current ones, as they won't get built
        current = artifact.is_current
        if current:
            return

        # get the xrefs to inject
        con = db_connect(builder.meta_path)
        cur = con.cursor()
        cur.execute('''
            select distinct path from xrefs where mathematician = ?
        ''', [name])

        current_paths = [v[0] for v in cur.fetchall()]
        if name in self.need_rebuild:
            current_paths = set(current_paths) - set(self.need_rebuild[name]['removed'])
            current_paths = set(current_paths).union(set(self.need_rebuild[name]['added']))

        # inject the xrefs data into it
        xrefs = []
        res = None
        for path in current_paths:
            record = pad_get(build_state.pad, path)
            model = record['_model']
            title = ''
            sort = 0
            if model == 'historytopic':
                title = 'History Topics: %s' % record['fullname']
                sort = 1
            elif model == 'curve':
                title = 'Famous Curves: %s' % record['name']
                sort = 2
            elif model == 'projectpage':
                title = 'Student Projects: %s: Chapter %s' % record.parent['title'] % record['chapter']
                sort = 5
            elif model == 'society':
                title = 'Societies: %s' % record['name']
                sort = 4
            elif model == 'page':
                title = 'Other: %s' % record['title']
                sort = 6
            else:
                continue
            xrefs.append({
                'title': title,
                'record': record,
                'sort': sort
            })
            # get the next db result
            res = cur.fetchone()
        source.xrefs = sorted(xrefs, key=lambda x: (x['sort'], x['title']))

    def on_after_build(self, builder, build_state, source, prog, **extra):
        # restrict xrefs to biographies for the moment
        if type(source) != Page or source['_model'] != 'biography':
            return

        # should we rebuild this?
        name = source['_slug']
        if name not in self.need_rebuild:
            return

        # is it still dirty?
        lektor_con = build_state.connect_to_database()
        lektor_cur = lektor_con.cursor()
        dirty = build_state._any_sources_are_dirty(lektor_cur, [source.source_filename])

        # if still dirty, build failed, so don't update the db
        if dirty:
            return

        # it's not dirty, the build succeeded. update the database
        con = db_connect(builder.meta_path)
        cur = con.cursor()
        for path in self.need_rebuild[name]['added']:
            cur.execute('''
                insert or ignore into xrefs(path, mathematician) values(?,?)
            ''', [path, name])

        for path in self.need_rebuild[name]['removed']:
            cur.execute('''
                delete from xrefs where path = ? and mathematician = ?
            ''', [path, name])

        # commit all database updates
        con.commit()



##### PAD GET #####

# re-implementation of pad.get without dependency tracking
def pad_get(pad, path, alt=PRIMARY_ALT, page_num=None, persist=True,
        allow_virtual=True):
    virt_markers = path.count('@')

    # If the virtual marker is included, we also want to look up the
    # virtual path below an item.  Special case: if virtual paths are
    # not allowed but one was passed, we just return `None`.
    if virt_markers == 1:
        if page_num is not None:
            raise RuntimeError('Cannot use both virtual paths and '
                               'explicit page number lookups.  You '
                               'need to one or the other.')
        if not allow_virtual:
            return None
        path, virtual_path = path.split('@', 1)
        rv = pad_get(pad, path, alt=alt, page_num=page_num,
                      persist=persist)
        if rv is None:
            return None
        return pad.get_virtual(rv, virtual_path)

    # Sanity check: there must only be one or things will get weird.
    elif virt_markers > 1:
        return None

    path = cleanup_path(path)
    virtual_path = None
    if page_num is not None:
        virtual_path = str(page_num)

    rv = pad.cache.get(path, alt, virtual_path)
    if rv is not Ellipsis:
        if rv is not None:
            #pad.db.track_record_dependency(rv)
            pass
        return rv

    raw_data = pad.db.load_raw_data(path, alt=alt)
    if raw_data is None:
        pad.cache.remember_as_missing(path, alt, virtual_path)
        return None

    rv = pad.instance_from_data(raw_data, page_num=page_num)

    if persist:
        pad.cache.persist(rv)
    else:
        pad.cache.remember(rv)

    #return self.db.track_record_dependency(rv)
    return rv
