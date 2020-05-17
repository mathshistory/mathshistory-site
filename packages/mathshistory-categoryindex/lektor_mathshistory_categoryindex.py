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

VIRTUAL_SOURCE_ID = 'categoryindex'
SOURCE_PATH = '/Categories'

TYPES = [
    {
        'path': '/Biographies',
        'name': 'Biographies',
        'display': '<a href="{{ this|url }}">{{ this.shortname }}</a>{% if this.birthyear %} ({{ this.birthyear|format_year }} - {% if this.deathyear %}{{ this.deathyear|format_year }}{% endif %}){% endif %}',
        'id': 'biographies'
    },
    {   'path': '/HistTopics',
        'name': 'History Topics',
        'display': '<a href="{{ this|url }}">{{ this.shortname }}</a>',
        'id': 'histtopics'
    },
    {   'path': '/Honours',
        'name': 'Honours',
        'display': '<a href="{{ this|url }}">{{ this.title }}</a>',
        'id': 'honours'
    },
    {   'path': '/Societies',
        'name': 'Societies',
        'display': '<a href="{{ this|url }}">{{ this.name }}</a>',
        'id': 'societies'
    }
]


class CategoryPage(VirtualSourceObject):
    def __init__(self, record, category, type):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.category = category
        self._cache = None
        self.template = 'plugins/category.html'
        self.type = type

    @property
    def pages(self):
        # todo, display them properly
        tag = self.category['_slug']
        all = self.parent.children
        return all.filter(F.tags.contains(tag))

    @property
    def path(self):
        tag = self.category['_slug']
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID, tag])

    @property
    def url_path(self):
        tag = self.category['_slug']
        return build_url([self.parent.path, 'category-%s' % tag])

    def format_display(self, display_item):
        record = display_item['record']
        display = display_item['display']
        exp = FormatExpression(self.pad.env, self.display)
        return exp.evaluate(self.pad, this=record, display=display)


class CategoryPageBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


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

def get_categories_by_type(pad, type):
    all_categories = pad.query(SOURCE_PATH).include_undiscoverable(True)
    categories = all_categories.filter(F['for'].contains(type))
    return categories

def get_types_by_category(pad, tag):
    category = pad.get('%s/%s' % (SOURCE_PATH, tag))
    try:
        types = [next(t for t in TYPES if t['id'] == type) for type in category['for']]
        return types
    except StopIteration:
        return []


class MathshistoryCategoryindexPlugin(Plugin):
    name = 'mathshistory-categoryindex'
    description = u'Creates the category index pages for the biographies of the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(CategoryPage, CategoryPageBuildProgram)

        self.env.jinja_env.globals.update(get_categories_by_type=get_categories_by_type)
        self.env.jinja_env.globals.update(get_types_by_category=get_types_by_category)
        self.env.jinja_env.filters['query_to_display'] = query_to_display

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def category_path_resolver(record, pieces):
            if len(pieces) != 1:
                return

            try:
                type = next(t for t in TYPES if t['path'] == record.path)
            except StopIteration:
                return

            pad = record.pad
            tag = pieces[0]

            types = get_types_by_category(pad, tag)
            if type in types:
                category = pad.get('%s/%s' % (SOURCE_PATH, tag))
                return CategoryPage(record, category, type)

        @self.env.generator
        def biographies_category_generator(record):
            try:
                type = next(t for t in TYPES if t['path'] == record.path)
            except StopIteration:
                return
            if type:
                pad = record.pad
                for category in get_categories_by_type(pad, type['id']):
                    yield CategoryPage(record, category, type)
