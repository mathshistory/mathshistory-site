# -*- coding: utf-8 -*-
import posixpath
import traceback

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'chronology'
SOURCE_PATH = '/Chronology'

def get_code(start, end):
    return '%s-%s' % (start, end)

def get_title(start, end):
    if start < 0:
        start = '%s BC' % (start * -1)
    if end < 0:
        end = '%s BC' % (end * -1)
    return '%s - %s' % (start, end)


class ChronologyIndex(VirtualSourceObject):
    def __init__(self, parent, config):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/chronologyindex.html'
        self.config = config

    @property
    def pages(self):
        pages = []
        for section in self.config.sections():
            start = int(self.config.get('%s.start' % section))
            end = int(self.config.get('%s.end' % section))
            page = ChronologyPage(self.parent, self.config, section)
            pages.append(page)
        return pages

    @property
    def path(self):
        return build_url([self.parent.path, '@%sindex' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'index'])


class ChronologyPage(VirtualSourceObject):
    def __init__(self, parent, config, section):
        VirtualSourceObject.__init__(self, parent)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.config = config
        self.section = section
        self.start = int(self.config.get('%s.start' % self.section))
        self.end = int(self.config.get('%s.end' % self.section))
        self.template = 'plugins/chronologycategory.html'
        self._cache = None

    @property
    def title(self):
        return get_title(self.start, self.end)

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID, self.section])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, self.section])

    @property
    def chronology(self):
        try:
            if self._cache == None:
                self._cache = []
                for page in self.pad.query(SOURCE_PATH).include_undiscoverable(True):
                    year = page['year']
                    if year >= self.start and year < self.end:
                        self._cache.append(page)

                # sort them by year
                self._cache = sorted(self._cache, key = lambda c: c['year'])

            return self._cache
        except:
            traceback.print_exc()

class ChronologyPageBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistoryChronologyPlugin(Plugin):
    name = 'mathshistory-chronology'
    description = u'Creates the chronology era/period pages for the the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(ChronologyPage, ChronologyPageBuildProgram)
        self.env.add_build_program(ChronologyIndex, ChronologyPageBuildProgram)

        @self.env.generator
        def chronology_generator(record):
            if not isinstance(record, Page):
                return

            if record.path != SOURCE_PATH:
                return

            for section in self.get_sections():
                yield ChronologyPage(record, self.get_config(), section)

            yield ChronologyIndex(record, self.get_config())

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if len(pieces) == 1:
                return ChronologyPage(node, self.get_config(), pieces[0])

        @self.env.virtualpathresolver('%sindex' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if len(pieces) == 0:
                return ChronologyIndex(node, self.get_config())

    def get_sections(self):
        return self.get_config().sections()
