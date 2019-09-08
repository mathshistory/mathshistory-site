# -*- coding: utf-8 -*-
import posixpath

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
        end = '%s BC' % (start * -1)
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
            page = ChronologyPage(self.parent, self.config, start, end)
            pages.append(page)
        return pages

    @property
    def path(self):
        return build_url([self.parent.path, '@%sindex' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'index'])


class ChronologyPage(VirtualSourceObject):
    def __init__(self, parent, config, start, end):
        VirtualSourceObject.__init__(self, parent)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.config = config
        self.start = int(start)
        self.end = int(end)
        self.template = 'plugins/chronology.html'

    @property
    def title(self):
        return get_title(self.start, self.end)

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID, get_code(self.start, self.end)])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, get_code(self.start, self.end)])

    @property
    def chronology(self):
        all = self.parent['chronology'].blocks

        # combine to single list
        chronology = []
        for block in all:
            try:
                year = int(block['year'])
                if year >= self.start and year < self.end:
                    chronology.append(block)
            except:
                pass

        # sort them by start date
        chronology = sorted(chronology, key = lambda c: c['year'])

        return chronology

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
                start = self.get_start(section)
                end = self.get_end(section)
                yield ChronologyPage(record, self.get_config(), start, end)

            yield ChronologyIndex(record, self.get_config())

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if len(pieces) == 2:
                return ChronologyPage(node, self.get_config(), pieces[0], pieces[1])

        @self.env.virtualpathresolver('%sindex' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if len(pieces) == 0:
                return ChronologyIndex(node, self.get_config())

    def get_sections(self):
        return self.get_config().sections()
    def get_start(self, name):
        return self.get_config().get('%s.start' % name)
    def get_end(self, name):
        return self.get_config().get('%s.end' % name)
