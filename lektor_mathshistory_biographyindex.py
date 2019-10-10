# -*- coding: utf-8 -*-
import posixpath
import json
import string
import traceback

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

def purge_mlink(s):
    #The below code is modified from the original htmlformat function to ensure compatibility
    rawch   = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ','ł','Ł','ś','Ś','ț','Ț']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n','l','L','s','S','t','T']
    for idx, raw in enumerate(rawch):
        trans = transch[idx]
        s = s.replace(raw, trans)
    return s


class ChronologicalIndexPage(VirtualSourceObject):
    def __init__(self, record):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.template = 'plugins/biographyindexchronological.html'

    @property
    def people(self):
        found = []
        all = self.pad.query(SOURCE_PATH).all()
        for person in all:
            name = person['shortname']
            purged = purge_mlink(name).lower()
            found.append({
                'person': person,
                'purged': purged,
                'birthyear': person['birthyear']
            })
        found = sorted(found, key=lambda p: (p['birthyear'], p['purged']))
        found = [p['person'] for p in found]
        return found

    @property
    def path(self):
        return build_url([self.parent.path, '@%schronological' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'chronological'])


class BiographyIndexPage(VirtualSourceObject):
    def __init__(self, record, letter):
        VirtualSourceObject.__init__(self, record)
        self.i_want_to_live = self.pad  # See lektor-tags/issues/2
        self.letter = letter.lower()
        self.template = 'plugins/biographyindexcategory.html'

    @property
    def people(self):
        found = []
        all = self.pad.query(SOURCE_PATH).all()
        for person in all:
            alphabetical = person['alphabetical']
            for display in alphabetical:
                purged = purge_mlink(display).lower()
                letter = purged[0]
                if letter == self.letter:
                    found.append({
                        'person': person,
                        'display': display,
                        'purged': purged
                    })
        found = sorted(found, key=lambda p: p['purged'])
        return found

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
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistoryBiographyindexPlugin(Plugin):
    name = 'mathshistory-biographyindex'
    description = u'Creates the alphabetical index pages for the biographies of the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(BiographyIndexPage, BiographyIndexPageBuildProgram)
        self.env.add_build_program(ChronologicalIndexPage, BiographyIndexPageBuildProgram)

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def biographyindex_path_resolver(node, pieces):
            if len(pieces) == 1:
                if node.path == SOURCE_PATH:
                    return BiographyIndexPage(node, pieces[0])

        @self.env.virtualpathresolver('%schronological' % VIRTUAL_SOURCE_ID)
        def biographyindex_path_resolver(node, pieces):
            if len(pieces) == 0:
                if node.path == SOURCE_PATH:
                    return ChronologicalIndexPage(node)

        @self.env.generator
        def biographyindex_generator(record):
            if not isinstance(record, Page):
                return

            if record.path != SOURCE_PATH:
                return

            for letter in all_letters():
                yield BiographyIndexPage(record, letter)

            # do the chronological index page too
            yield ChronologicalIndexPage(record)
