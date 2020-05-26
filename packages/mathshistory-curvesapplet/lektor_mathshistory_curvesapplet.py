# -*- coding: utf-8 -*-
import posixpath

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'curvesapplet'


class CurvesApplet(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'curvesapplet'])


class CurvesAppletBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into('plugins/curvesapplet.html', this=self.source)


class MathshistoryCurvesappletPlugin(Plugin):
    name = 'mathshistory-curvesapplet'
    description = u'Creates the interactive curves javascript pages for the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(CurvesApplet, CurvesAppletBuildProgram)

        @self.env.generator
        def curvesapplet_generator(record):
            if not isinstance(record, Page):
                return

            if record['_model'] == 'curve' and record['appletoptions'].strip() != '':
                yield CurvesApplet(record)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def curvesapplet_virtual_path_resolver(node, pieces):
            if len(pieces) == 0 and node['appletoptions'].strip() != '':
                return CurvesApplet(node)
