# -*- coding: utf-8 -*-
import posixpath
import time
import random
import math
import datetime

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.context import get_ctx
from lektor.db import Page, F

VIRTUAL_SOURCE_ID = 'oftheday'
SOURCE_PATH = '/Biographies'
OUTPUT_PATH = '/OfTheDay'
MESSAGE_PATH = '/Miscellaneous/messages'

# thanks to https://stackoverflow.com/a/5891598/2370460
def suffix(d):
    return 'th' if 11<=d<=13 else {1:'st',2:'nd',3:'rd'}.get(d%10, 'th')
def custom_strftime(format, t):
    return t.strftime(format).replace('{S}', '%s%s' % (t.day, suffix(t.day)))


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


class OfTheDayTodayPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/ofthedaytoday.php'

    @property
    def path(self):
        return build_url([self.parent.path, '@%stoday' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'today'])


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
        self._born_cache = None
        self._died_cache = None
        self._message_cache = None 

    def record_dependencies(self, records):
        ctx = get_ctx()
        for record in records:
            path = self.pad.db.to_fs_path(record.path)
            ctx.record_dependency(path)

    @property
    def pretty_day(self):
        thisday_datetime = datetime.datetime.fromtimestamp(time.mktime(time.strptime(self.day, '%m-%d')))
        return custom_strftime('{S} %B', thisday_datetime)

    @property
    def start_of_date(self):
        # the 2020 is because it was a leap year, and is needed for the 29th feb to work
        return datetime.datetime.strptime('%s-2020' % self.day, '%m-%d-%Y').strftime('%d %B').lstrip('0')

    @property
    def message(self):
        if self._message_cache == None:
            start_of_date = self.start_of_date
            query = self.pad.query(MESSAGE_PATH).filter(start_of_date.contains(datetime.datetime.strptime(F._id, '%m-%d').strftime('%d %B')))
            if query.count() > 0:
                self._message_cache = query.first()
            if (self._message_cache == None):
                self._message_cache = "No message to show"
        return self._message_cache

    @property
    def born(self):
        if self._born_cache == None:
            start_of_date = self.start_of_date
            query = self.pad.query(SOURCE_PATH).filter(F.birthdate.startswith(start_of_date)).order_by('birthyear')
            self._born_cache = query.all()
        return self._born_cache

    @property
    def died(self):
        if self._died_cache == None:
            start_of_date = self.start_of_date
            query = self.pad.query(SOURCE_PATH).filter(F.deathdate.startswith(start_of_date)).order_by('deathyear')
            self._died_cache = query.all()
        return self._died_cache

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

# used for the PHP 'today' page
class OfTheDayTodayBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.php'),
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
        self.env.add_build_program(OfTheDayTodayPage, OfTheDayTodayBuildProgram)

        self.env.jinja_env.globals.update(month_days=month_days)
        self.env.jinja_env.globals.update(format_day=format_day)
        self.env.jinja_env.filters['month_name'] = month_name


        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def oftheday_path_resolver(node, pieces):
            if len(pieces) == 1 and node.path == SOURCE_PATH:
                    return OfTheDayPage(node, pieces[0])

        @self.env.virtualpathresolver('%sindex' % VIRTUAL_SOURCE_ID)
        def oftheday_index_resolver(node, pieces):
            if len(pieces) == 0 and node.path == SOURCE_PATH:
                    return OfTheDayIndexPage(node)

        @self.env.virtualpathresolver('%stoday' % VIRTUAL_SOURCE_ID)
        def oftheday_today_resolver(node, pieces):
            if len(pieces) == 0 and node.path == SOURCE_PATH:
                    return OfTheDayTodayPage(node)

        @self.env.generator
        def oftheday_generator(record):
            if not isinstance(record, Page):
                return

            if record.path != SOURCE_PATH:
                return

            for day in all_days():
                yield OfTheDayPage(record, day)

            yield OfTheDayIndexPage(record)
            yield OfTheDayTodayPage(record)
