# -*- coding: utf-8 -*-
import posixpath
import json
import traceback

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'search'
SOURCE_PATH = '/'


class Search(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/search.php'

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'Search'])


class SearchBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.php'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistorySearchPlugin(Plugin):
    name = 'mathshistory-search'
    description = u'Provides search capability to the Maths History site.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(Search, SearchBuildProgram)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def search_path_resolver(node, pieces):
            if len(pieces) == 0:
                if node.path == SOURCE_PATH:
                    return Search(node)

        @self.env.generator
        def search_generator(record):
            if record.path != SOURCE_PATH:
                return

            yield Search(record)
