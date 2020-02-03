# -*- coding: utf-8 -*-
import posixpath
import json
import os
import time
import traceback
import random
import string

from lektor.build_programs import BuildProgram
from lektor.environment import Expression, FormatExpression
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url, bool_from_string
from lektor.context import get_ctx
from lektor.db import Page
from lektor.db import F
from lektor.types import Type
from lektor.environment import PRIMARY_ALT

PLUGIN_NAME = 'mathshistory-categoryindex'
VIRTUAL_SOURCE_ID = 'categoryindex'
OUTPUT_PATH = '/Categories'

TYPE_BIOGRAPHIES = 'biographies'
TYPE_HISTTOPICS = 'histtopics'
TYPE_HONOURS = 'honours'
TYPE_SOCIETIES = 'societies'


class CategoryPage(VirtualSourceObject):
    def __init__(self, record, category):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.category = category
        self._cache = None
        self.template = 'plugins/category.html'
        # configure these, in subclasses
        self.type = ''
        self.tytle = ''
        self.display = ''

    @property
    def pages(self):
        # todo, display them properly
        tag = self.category['tag']
        all = self.parent.children
        return all.filter(F.tags.contains(tag))

    @property
    def path(self):
        tag = self.category['tag']
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID, tag])

    @property
    def url_path(self):
        tag = self.category['tag']
        return build_url([self.parent.path, 'category-%s' % tag])

    def format_display(self, display_item):
        record = display_item['record']
        display = display_item['display']
        exp = FormatExpression(self.pad.env, self.display)
        return exp.evaluate(self.pad, this=record, display=display)


class BiographiesCategoryPage(CategoryPage):
    def __init__(self, record, category):
        CategoryPage.__init__(self, record, category)
        self.type = TYPE_BIOGRAPHIES
        self.title = 'Biographies'
        self.display = '<a href="{{ this|url }}">{{ this.shortname }}</a>{% if this.birthyear %} ({{ this.birthyear|format_year }} - {% if this.deathyear %}{{ this.deathyear|format_year }}{% endif %}){% endif %}'

class HisttopicsCategoryPage(CategoryPage):
    def __init__(self, record, category):
        CategoryPage.__init__(self, record, category)
        self.type = TYPE_HISTTOPICS
        self.title = 'History Topics'
        self.display = '<a href="{{ this|url }}">{{ this.shortname }}</a>'

class HonoursCategoryPage(CategoryPage):
    def __init__(self, record, category):
        CategoryPage.__init__(self, record, category)
        self.type = TYPE_HONOURS
        self.title = 'Honours'
        self.display = '<a href="{{ this|url }}">{{ this.title }}</a>'

class SocietiesCategoryPage(CategoryPage):
    def __init__(self, record, category):
        CategoryPage.__init__(self, record, category)
        self.type = TYPE_SOCIETIES
        self.title = 'Societies'
        self.display = '<a href="{{ this|url }}">{{ this.name }}</a>'


class CategoryPageBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class CategoryTagsType(Type):
    widget = 'tags'

    def value_from_raw(self, raw):
        return json.loads(raw.value or u'[]')

    def to_json(self, pad, record=None, alt=PRIMARY_ALT):
        plugin = self.env.plugins[PLUGIN_NAME]
        categories = plugin.get_categories()
        rv = Type.to_json(self, pad, record, alt)
        rv['tags'] = [c['tag'] for c in categories]
        return rv

def num_entries(category, type):
    if pad == None:
        ctx = get_ctx()
        if ctx is not None:
            pad = ctx.pad
        else:
            pass

def purge_mlink(s):
    #The below code is modified from the original htmlformat function to ensure compatibility
    rawch   = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ','ł','Ł','ś','Ś','ț','Ț']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n','l','L','s','S','t','T']
    for idx, raw in enumerate(rawch):
        trans = transch[idx]
        s = s.replace(raw, trans)
    return s

def query_to_display(query):
    display_records = []
    for record in query:
        alphabetical = record['alphabetical']
        for display in alphabetical:
            purged = purge_mlink(display).lower()
            data = {
                'record': record,
                'display': display,
                'purged': purged
            }
            display_records.append(data)
    display_records_sorted = sorted(display_records, key=lambda p: p['purged'])
    return display_records_sorted


class MathshistoryCategoryindexPlugin(Plugin):
    name = 'mathshistory-categoryindex'
    description = u'Creates the category index pages for the biographies of the Maths History website.'

    def get_categories(self):
        config = self.get_config()
        categories = []
        for cat in config.sections():
            categories.append(self.get_category(cat))
        return categories

    def get_category(self, tag):
        config = self.get_config()
        return {
            'tag': tag,
            'name': config.get('%s.name' % tag),
            'description': config.get('%s.description' % tag)
        }

    def on_setup_env(self, **extra):
        self.env.add_build_program(CategoryPage, CategoryPageBuildProgram)
        self.env.add_type(CategoryTagsType)

        self.env.jinja_env.globals.update(plugin_categories=self.get_categories)
        self.env.jinja_env.filters['query_to_display'] = query_to_display

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def category_path_resolver(record, pieces):
            if len(pieces) == 1:
                category = self.get_category(pieces[0])

                if record.path == '/Biographies':
                    return BiographiesCategoryPage(record, category)

                if record.path == '/HistTopics':
                    return HisttopicsCategoryPage(record, category)

                if record.path == '/Honours':
                    return HonoursCategoryPage(record, category)

                if record.path == '/Societies':
                    return SocietiesCategoryPage(record, category)

        @self.env.generator
        def biographies_category_generator(record):
            if not isinstance(record, Page):
                return

            categories = self.get_categories()

            if record.path == '/Biographies':
                for category in categories:
                    yield BiographiesCategoryPage(record, category)

            if record.path == '/HistTopics':
                for category in categories:
                    yield HisttopicsCategoryPage(record, category)

            if record.path == '/Honours':
                for category in categories:
                    yield HonoursCategoryPage(record, category)

            if record.path == '/Societies':
                for category in categories:
                    yield SocietiesCategoryPage(record, category)
