# -*- coding: utf-8 -*-
import posixpath
import json
import string
import traceback
import json

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page
from lektor.db import F
from lektor.types import Type
from lektor.environment import PRIMARY_ALT

VIRTUAL_SOURCE_ID = 'otherindexes'
SOURCE_PATH = '/'
OUTPUT_PATH = '/OtherIndexes/'

class SocietiesFoundationIndexPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/societiesfoundationindex.html'

    @property
    def societies(self):
        return self.pad.query('/Societies').order_by('foundation')

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/societies' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'societies'])


class PictureIndexPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/pictureindex.html'

    @property
    def mathematicians(self):
        all_mathematicians = self.pad.query('/Biographies').order_by('birthyear')
        with_thumbnails = []
        for m in all_mathematicians:
            attachments = m.attachments
            images = attachments.images
            biographyimages = images.filter(F._model == 'biographyimage')
            thumbnail = biographyimages.filter(F.main == True).first()
            if thumbnail:
                with_thumbnails.append({
                    'page': m,
                    'thumbnail': thumbnail
                })
        return with_thumbnails

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/pictures' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'pictures'])


class IndexBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistoryOtherindexesPlugin(Plugin):
    name = 'mathshistory-otherindexes'
    description = u'Creates various indexes needed by the Maths History site'

    def on_setup_env(self, **extra):
        self.env.add_build_program(PictureIndexPage, IndexBuildProgram)
        self.env.add_build_program(SocietiesFoundationIndexPage, IndexBuildProgram)

        @self.env.generator
        def searchdata_generator(record):
            if not isinstance(record, Page):
                return

            if record.path == SOURCE_PATH:
                # do the picture index
                yield PictureIndexPage(record)
                yield SocietiesFoundationIndexPage(record)


        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if node.path != SOURCE_PATH:
                return

            if len(pieces) == 1:
                if pieces[0] == 'pictures':
                    return PictureIndexPage(node)
                elif pieces[0] == 'societies':
                    return SocietiesFoundationIndexPage(node)
