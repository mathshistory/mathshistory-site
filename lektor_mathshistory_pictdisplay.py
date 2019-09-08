# -*- coding: utf-8 -*-
import posixpath

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'pictdisplay'


class PictDisplay(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'pictdisplay'])


class PictDisplayBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into('plugins/pictdisplay.html', this=self.source.parent)


class MathshistoryPictdisplayPlugin(Plugin):
    name = 'mathshistory-pictdisplay'
    description = u'Creates the bigpicture/pictdisplay pages for the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(PictDisplay, PictDisplayBuildProgram)

        @self.env.generator
        def searchdata_generator(record):
            if not isinstance(record, Page):
                return

            if record['_model'] == 'biography':
                if record.attachments.count() > 1:
                    yield PictDisplay(record)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if len(pieces) == 0:
                return PictDisplay(node)
