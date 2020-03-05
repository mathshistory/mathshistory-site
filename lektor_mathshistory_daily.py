# -*- coding: utf-8 -*-
import posixpath
import json
import os
import time
import traceback
import random
import math
import datetime

from lektor.build_programs import BuildProgram
from lektor.environment import Expression, FormatExpression
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url, bool_from_string
from lektor.context import get_ctx
from lektor.db import Page
from lektor.environment import PRIMARY_ALT
from lektor.utils import cleanup_path

VIRTUAL_SOURCE_ID = 'oftheday'
SOURCE_PATH = '/Biographies'
OUTPUT_PATH = '/OfTheDay'

_born_cache = None
_died_cache = None


def random_int(day):
    # setup the random seed
    year = time.localtime().tm_year
    random.seed(year)

    # convert day-month into day of the year
    year_day = time.strptime(day, '%m-%d').tm_yday

    # run random year_day times
    for i in range(0,year_day):
        random_num = random.randint(0,10000)

    return random_num

def get_born_cache(pad):
    get_page_cache(pad)
    return _born_cache
def get_died_cache(pad):
    get_page_cache(pad)
    return _died_cache

def get_page_cache(pad):
    global _born_cache, _died_cache
    if _born_cache != None and _died_cache != None:
        return
    _born_cache = {}
    _died_cache = {}

    # populate them
    for name, _, is_attachment in pad.db.iter_items('/Biographies'):
        if is_attachment:
            continue

        # use special pad_get which doesn't auto add dependencies
        record = pad_get(pad, '%s/%s' % ('/Biographies', name))

        # born
        born = record['birthdate']
        if born:
            try:
                born = time.strptime(born, '%d %B %Y')
                day = born.tm_mday
                month = born.tm_mon
                born = format_day(day, month)
                if born not in _born_cache:
                    _born_cache[born] = []
                _born_cache[born].append(record)
            except ValueError:
                pass
            except:
                traceback.print_exc()

        # died
        died = record['deathdate']
        if died:
            try:
                died = time.strptime(died, '%d %B %Y')
                day = died.tm_mday
                month = died.tm_mon
                died = format_day(day, month)
                if died not in _died_cache:
                    _died_cache[died] = []
                _died_cache[died].append(record)
            except ValueError:
                pass
            except:
                traceback.print_exc()

def month_days(month):
    res = []
    month_days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    max = month_days[month - 1] + 1
    return range(1, max)

def format_day(day, month):
    return '%02d-%02d' % (month, day)

def month_name(month):
    d = time.strptime(str(month), "%m")
    name = time.strftime("%B", d)
    return name

def all_days():
    res = []
    month_days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    for month in range(0, 12):
        for day in range(0, month_days[month]):
            res.append(format_day(day+1, month+1))
    return res


class OfTheDayIndexPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/ofthedayindex.html'

    @property
    def path(self):
        return build_url([self.parent.path, '@%sindex' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH])


class OfTheDayPage(VirtualSourceObject):
    def __init__(self, record, day):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.day = day
        self._quote = None
        self.template = 'plugins/oftheday.html'

    def record_dependencies(self, records):
        ctx = get_ctx()
        for record in records:
            path = self.pad.db.to_fs_path(record.path)
            ctx.record_dependency(path)

    @property
    def born(self):
        cache = get_born_cache(self.pad)
        self.record_dependencies(cache[self.day])
        return cache[self.day]

    @property
    def died(self):
        cache = get_died_cache(self.pad)
        self.record_dependencies(cache[self.day])
        return cache[self.day]

    @property
    def quote(self):
        # if already calculated, return the cache value
        if self._quote:
            return self._quote

        # choose a random quote from the born/died people
        born = self.born
        died = self.died
        people = born + died

        quotes = []
        for person in people:
            try:
                quotations = person['quotations']
                for quote in quotations.blocks:
                    quotes.append({
                        'quote': quote,
                        'person': person
                    })
            except:
                pass

        if len(quotes) == 0:
            print('no quotations')
            return None

        # gives random number between 0 and 10000
        random_num = random_int(self.day)

        # convert that to index
        max = len(quotes)
        random_item_index = math.floor((random_num/10000)*max)

        chosen = quotes[random_item_index]
        self._quote = chosen
        return chosen

    def get_deltaday(self, delta):
        thisday_datetime = datetime.datetime.fromtimestamp(time.mktime(time.strptime(self.day, '%m-%d')))
        delta_datetime = thisday_datetime + datetime.timedelta(days=delta)
        day = delta_datetime.day
        month = delta_datetime.month
        formatted = format_day(day, month)
        return OfTheDayPage(self.parent, formatted)

    @property
    def previous(self):
        return self.get_deltaday(-1)

    @property
    def next(self):
        return self.get_deltaday(1)

    @property
    def today(self):
        today = datetime.datetime.today()
        day = today.day
        month = today.month
        formatted = format_day(day, month)
        return OfTheDayPage(self.parent, formatted)

    @property
    def year(self):
        return OfTheDayIndexPage(self.parent)

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'oftheday-%s' % self.day])


# this build program is used for category pages and index pages
class OfTheDayPageBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistoryDailyPlugin(Plugin):
    name = 'mathshistory-daily'
    description = u'Creates the Mathematician Of The Day pages for the Maths History site.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(OfTheDayPage, OfTheDayPageBuildProgram)
        self.env.add_build_program(OfTheDayIndexPage, OfTheDayPageBuildProgram)

        self.env.jinja_env.globals.update(month_days=month_days)
        self.env.jinja_env.globals.update(format_day=format_day)
        self.env.jinja_env.filters['month_name'] = month_name


        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def oftheday_path_resolver(node, pieces):
            if len(pieces) == 1 and node.path == SOURCE_PATH:
                    return OfTheDayPage(node, pieces[0])

        @self.env.virtualpathresolver('%sindex' % VIRTUAL_SOURCE_ID)
        def oftheday_path_resolver(node, pieces):
            if len(pieces) == 0 and node.path == SOURCE_PATH:
                    return OfTheDayIndexPage(node)

        @self.env.generator
        def oftheday_generator(record):
            if not isinstance(record, Page):
                return

            if record.path != SOURCE_PATH:
                return

            for day in all_days():
                yield OfTheDayPage(record, day)

            yield OfTheDayIndexPage(record)




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
