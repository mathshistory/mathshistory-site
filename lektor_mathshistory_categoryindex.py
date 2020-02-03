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
SOURCE_PATH = '/'
OUTPUT_PATH = '/Categories'

DISPLAY_HISTTOPIC = '<a href="{{ this|url }}">{{ this.shortname }}</a>'
DISPLAY_BIOGRAPHY = '<a href="{{ this|url }}">{{ this.shortname }}</a>{% if this.birthyear %} ({{ this.birthyear|format_year }} - {% if this.deathyear %}{{ this.deathyear|format_year }}{% endif %}){% endif %}'
DISPLAY_HONOUR = '<a href="{{ this|url }}">{{ this.title }}</a>'
DISPLAY_SOCIETY = '<a href="{{ this|url }}">{{ this.name }}</a>'


class CategoryIndexPage(VirtualSourceObject):
    def __init__(self, record, categories):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.categories = categories
        self.template = 'plugins/categoryindex.html'

    @property
    def path(self):
        return build_url([self.parent.path, '@%sindex' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH])


class CategoryPage(VirtualSourceObject):
    def __init__(self, record, category):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.category = category
        self._biographies = None
        self._histtopics = None
        self._societies = None
        self._honours = None
        self.template = 'plugins/category.html'

    def get_results(self, parent):
        tag = self.category['tag']
        return self.pad.query(parent).filter(F.tags.contains(tag)).all()

    @property
    def biographies(self):
        if self._biographies == None:
            self._biographies = self.get_results('/Biographies/')
        return self._biographies

    @property
    def histtopics(self):
        if self._histtopics == None:
            self._histtopics = self.get_results('/HistTopics/')
        return self._histtopics

    @property
    def societies(self):
        if self._societies == None:
            self._societies = self.get_results('/Societies/')
        return self._societies

    @property
    def honours(self):
        if self._honours == None:
            self._honours = self.get_results('/Honours/')
        return self._honours

    @property
    def sections(self):
        sections = []
        if len(self.biographies) > 0:
            sections.append({
                'name': 'Biographies',
                'id': 'biographies',
                'pages': self.biographies
            })
        if len(self.histtopics) > 0:
            sections.append({
                'name': 'History Topics',
                'id': 'histtopics',
                'pages': self.histtopics
            })
        if len(self.societies) > 0:
            sections.append({
                'name': 'Societies',
                'id': 'societies',
                'pages': self.societies
            })
        if len(self.honours) > 0:
            sections.append({
                'name': 'Honours',
                'id': 'honours',
                'pages': self.honours
            })
        return sections

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        tag = self.category['tag']
        return build_url([OUTPUT_PATH, tag])

    def format_display(self, record):
        if record['_model'] == 'biography':
            display_exp = DISPLAY_BIOGRAPHY
        elif record['_model'] == 'historytopic':
            display_exp = DISPLAY_HISTTOPIC
        elif record['_model'] == 'society':
            display_exp = DISPLAY_SOCIETY
        elif record['_model'] == 'honour':
            display_exp = DISPLAY_HONOUR
        else:
            error = 'ERROR: unknown model:', record['_model']
            print(error)
            return error

        try:
            exp = FormatExpression(self.pad.env, display_exp)
            return exp.evaluate(self.pad, this=record)
        except:
            traceback.print_exc()


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
        self.env.add_build_program(CategoryIndexPage, CategoryPageBuildProgram)
        self.env.add_type(CategoryTagsType)

        self.env.jinja_env.globals.update(plugin_categories=self.get_categories)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def category_path_resolver(node, pieces):
            if len(pieces) == 1:
                category = self.get_category(pieces[0])
                return CategoryPage(node,category)

        @self.env.virtualpathresolver('%sindex' % VIRTUAL_SOURCE_ID)
        def category_index_path_resolver(node, pieces):
            categories = self.get_categories()
            return CategoryIndexPage(node, categories)

        @self.env.generator
        def category_generator(record):
            if not isinstance(record, Page):
                return

            if record.path != SOURCE_PATH:
                return

            categories = self.get_categories()
            yield CategoryIndexPage(record, categories)

            for category in categories:
                yield CategoryPage(record, category)
