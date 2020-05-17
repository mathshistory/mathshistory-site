# -*- coding: utf-8 -*-
import posixpath
import string
import traceback

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page
from lektor.db import F
from lektor.types import Type, BadValue
from lektor.environment import PRIMARY_ALT

VIRTUAL_SOURCE_ID = 'bmc'
SOURCE_PATH = '/BMC'

# they are done in this way to get the correct ordering
PLENARY_TYPE = 'Ap'
MORNING_TYPE = 'Bm'
SPECIAL_TYPE = 'Cs'

def purge_mlink(s):
    #The below code is modified from the original htmlformat function to ensure compatibility
    rawch   = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ','ł','Ł','ś','Ś','ț','Ț']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n','l','L','s','S','t','T']
    for idx, raw in enumerate(rawch):
        trans = transch[idx]
        s = s.replace(raw, trans)
    return s

def add_speakers(dest, source, year):
    for speaker in source:
        name = speaker['name']
        mlink = speaker['mlink']
        if name not in dest:
            dest[name] = {}
            dest[name]['years'] =[]
            dest[name]['purged'] = purge_mlink(name).lower()
        dest[name]['name'] = name
        dest[name]['mlink'] = mlink
        dest[name]['years'].append(year)

class SpeakersPage(VirtualSourceObject):
    def __init__(self, parent, type):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/bmcspeakers.html'
        self.type = type
        self._cache = None
        self._jumpcache = None

    @property
    def jumps(self):
        if self._jumpcache == None:
            self.generate_speakers()
            self._jumpcache = []
            for speaker in self._cache:
                letter = speaker['purged'][0]
                if letter not in self._jumpcache:
                    self._jumpcache.append(letter)
        return self._jumpcache

    @property
    def speakers(self):
        self.generate_speakers()
        return self._cache

    def generate_speakers(self):
        if self._cache != None:
            return

        colloquia_pages = self.pad.query(SOURCE_PATH)
        speakers = {}
        for c in colloquia_pages:
            types = c['speakertypes']
            for type in types.blocks:
                if self.type == 'morning':
                    if type['type'] == MORNING_TYPE:
                        add_speakers(speakers, type['speakers'].blocks, c['year'])
                elif self.type == 'plenary':
                    if type['type'] == PLENARY_TYPE:
                        add_speakers(speakers, type['speakers'].blocks, c['year'])
                elif self.type == 'special':
                    if type['type'] == SPECIAL_TYPE:
                        add_speakers(speakers, type['speakers'].blocks, c['year'])
                elif self.type == 'all':
                    add_speakers(speakers, type['speakers'].blocks, c['year'])
        speakers = speakers.values()
        speakers = sorted(speakers, key=lambda s: s['purged'])
        self._cache = speakers

    @property
    def max_year(self):
        self.generate_speakers()
        max = -1
        for speaker in self._cache:
            for year in speaker['years']:
                if year > max:
                    max = year
        return max

    @property
    def speaker_type(self):
        if self.type == 'morning':
            return 'Morning'
        elif self.type == 'plenary':
            return 'Plenary'
        elif self.type == 'special':
            return 'Special Session'
        else:
            return 'All'

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/%s' % (VIRTUAL_SOURCE_ID, self.type)])

    @property
    def url_path(self):
        return build_url([SOURCE_PATH, 'speakers-%s' % self.type])


class SpeakersPageProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into(self.source.template, this=self.source)


class MathshistoryBmcPlugin(Plugin):
    name = 'mathshistory-bmc'
    description = u'Creates the BMC lists of speakers pages.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(SpeakersPage, SpeakersPageProgram)

        @self.env.generator
        def bmc_generator(record):
            if not isinstance(record, Page):
                return

            if record.path == SOURCE_PATH:
                # do the picture index
                yield SpeakersPage(record, 'plenary')
                yield SpeakersPage(record, 'morning')
                yield SpeakersPage(record, 'special')
                yield SpeakersPage(record, 'all')

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def bmc_virtual_path_resolver(node, pieces):
            if node.path != SOURCE_PATH:
                return

            if len(pieces) == 1:
                return SpeakersPage(node, pieces[0])
