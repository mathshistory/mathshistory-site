# -*- coding: utf-8 -*-
import posixpath
import json
import string

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page
from lektor.db import F
from lektor.types import Type
from lektor.environment import PRIMARY_ALT

VIRTUAL_SOURCE_ID = 'biographyindex'
SOURCE_PATH = '/Biographies'

def all_letters():
    return list(string.ascii_lowercase)


class BiographyIndexPage(VirtualSourceObject):
    def __init__(self, record, letter):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.letter = letter

    @property
    def people(self):
        items = self.pad.query(SOURCE_PATH).filter(F.alphabetical.contains(self.letter))
        return items

    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'letter-%s' % self.letter])


# this build program is used for index pages
class BiographyIndexPageBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into('plugins/biographyindexcategory.html', this=self.source)


class AlphabeticalTagsType(Type):
    widget = 'tags'

    def value_from_raw(self, raw):
        return json.loads(raw.value or u'[]')

    def to_json(self, pad, record=None, alt=PRIMARY_ALT):
        rv = Type.to_json(self, pad, record, alt)
        rv['tags'] = all_letters()
        return rv


class MathshistoryBiographyindexPlugin(Plugin):
    name = 'mathshistory-biographyindex'
    description = u'Creates the alphabetical index pages for the biographies of the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(BiographyIndexPage, BiographyIndexPageBuildProgram)
        self.env.add_type(AlphabeticalTagsType)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def biographyindex_path_resolver(node, pieces):
            if len(pieces) == 1:
                if node.path == SOURCE_PATH:
                    return BiographyIndexPage(node, pieces[0])

        @self.env.generator
        def biographyindex_generator(record):
            if not isinstance(record, Page):
                return

            if record.path != SOURCE_PATH:
                return

            for letter in all_letters():
                yield BiographyIndexPage(record, letter)
