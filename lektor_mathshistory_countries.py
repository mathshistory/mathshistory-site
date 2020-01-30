# -*- coding: utf-8 -*-
import posixpath
import json
import os
import time
import traceback
import random
import re

from lektor.build_programs import BuildProgram
from lektor.environment import Expression, FormatExpression
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url, bool_from_string
from lektor.context import get_ctx
from lektor.db import Page
from lektor.environment import PRIMARY_ALT
from lektor.utils import cleanup_path

VIRTUAL_SOURCE_ID = 'countries'
SOURCE_PATH = '/Biographies'
OUTPUT_PATH = '/Countries'

_countries_cache = None

def random_int():
    return random.randint(0, 3000)

def get_countries_cache(pad):
    get_page_cache(pad)
    return _countries_cache

def get_page_cache(pad):
    global _countries_cache
    if _countries_cache != None:
        return
    _countries_cache = {}

    # first get the countries
    locations_to_countries = {}
    for name, _, is_attachment in pad.db.iter_items('/Map'):
        if is_attachment or name is None or name == '':
            continue
        # use special pad_get which doesn't auto add dependencies
        record = pad_get(pad, '%s/%s' % ('/Map', name))
        locations_to_countries[name] = record['country']


    # now get the biographies
    for name, _, is_attachment in pad.db.iter_items(SOURCE_PATH):
        if is_attachment:
            continue
        # use special pad_get which doesn't auto add dependencies
        record = pad_get(pad, '%s/%s' % (SOURCE_PATH, name))
        location = record['maplocation']
        if location is None or location == '' or location not in locations_to_countries:
            continue

        country = locations_to_countries[location]
        if country is None or country == '':
            continue

        if country not in _countries_cache:
            _countries_cache[country] = []
        _countries_cache[country].append(record)


class CountryIndexPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/countryindex.html'

    @property
    def countries(self):
        cache = get_countries_cache(self.pad)
        as_array = [{'country':k,'number':len(v)} for (k,v) in cache.items()]
        return sorted(as_array, key=lambda k: k['country'])

    @property
    def path(self):
        return build_url([self.parent.path, '@%sindex' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH])


class CountryPage(VirtualSourceObject):
    def __init__(self, record, country):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.country = country
        self._quote = None
        self.template = 'plugins/country.html'

    def record_dependencies(self, records):
        ctx = get_ctx()
        for record in records:
            path = self.pad.db.to_fs_path(record.path)
            ctx.record_dependency(path)

    @property
    def mathematicians(self):
        cache = get_countries_cache(self.pad)
        #self.record_dependencies(cache[self.country])
        return cache[self.country]

    @property
    def countries(self):
        cache = get_countries_cache(self.pad)
        as_array = [{'country':k,'number':len(v)} for (k,v) in cache.items()]
        return sorted(as_array, key=lambda k: k['country'])

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        #url_country = re.sub(r'\W+', '', self.country.lower())
        return build_url([OUTPUT_PATH, self.country])


# this build program is used for category pages and index pages
class CountryPageBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistoryCountriesPlugin(Plugin):
    name = 'mathshistory-countries'
    description = u'Creates the country pages, listing mathematicians by birth country.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(CountryPage, CountryPageBuildProgram)
        self.env.add_build_program(CountryIndexPage, CountryPageBuildProgram)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def countries_path_resolver(node, pieces):
            if len(pieces) == 1 and node.path == SOURCE_PATH:
                    return CountryPage(node, pieces[0])

        @self.env.virtualpathresolver('%sindex' % VIRTUAL_SOURCE_ID)
        def countries_index_path_resolver(node, pieces):
            if len(pieces) == 0 and node.path == SOURCE_PATH:
                    return CountryIndexPage(node)

        @self.env.generator
        def countries_generator(record):
            if record.path != SOURCE_PATH:
                return

            pad = self.env.new_pad()
            for country in pad.query('/Map').include_undiscoverable(True).distinct('country'):
                if country is None or country == '':
                    continue
                yield CountryPage(record, country)

            yield CountryIndexPage(record)




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
