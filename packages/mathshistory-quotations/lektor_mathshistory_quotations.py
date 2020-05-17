# -*- coding: utf-8 -*-
import posixpath
import traceback

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'quotations'
SOURCE_PATH = '/Biographies'


class Quotations(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'quotations'])


class QuotationsBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into('plugins/quotations.html', this=self.source)


class MathshistoryQuotationsPlugin(Plugin):
    name = 'mathshistory-quotations'
    description = u'Creates the quotation pages for the mathematicians of the Maths History site.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(Quotations, QuotationsBuildProgram)

        @self.env.generator
        def searchdata_generator(record):
            if not isinstance(record, Page):
                return

            if record['_model'] == 'biography':
                if len(record['quotations'].blocks) > 0:
                    yield Quotations(record)
                return

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def quotations_virtual_path_resolver(node, pieces):

            if len(pieces) == 0:
                if len(node['quotations'].blocks) > 0:
                    return Quotations(node)
