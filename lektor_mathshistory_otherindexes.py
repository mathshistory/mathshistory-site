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
from lektor.types import Type, BadValue
from lektor.environment import PRIMARY_ALT

VIRTUAL_SOURCE_ID = 'otherindexes'
SOURCE_PATH = '/'
OUTPUT_PATH = '/OtherIndexes/'


def purge_mlink(s):
    #The below code is modified from the original htmlformat function to ensure compatibility
    rawch   = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ','ł','Ł','ś','Ś','ț','Ț']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n','l','L','s','S','t','T']
    for idx, raw in enumerate(rawch):
        trans = transch[idx]
        s = s.replace(raw, trans)
    return s


class GazMapPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/gazmap.html'

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/gazmap' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'gazmap'])


class GazMapData(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self._cache = None

    def places(self):
        try:
            if self._cache == None:
                # find the places
                places = {}
                gazplaces = self.pad.query('/Gaz').filter(F._model == 'gazplace')
                for place in gazplaces:
                    id = place['_slug']
                    lat = place['latitude']
                    long = place['longitude']
                    invalid = isinstance(lat, BadValue) or isinstance(long, BadValue)
                    if not invalid:
                        places[id] = {
                            'id': id,
                            'name': place['place'],
                            'longitude': long,
                            'latitude': lat
                        }

                # convert to list
                places = [places[k] for k in places]

                self._cache = places

            return self._cache
        except:
            traceback.print_exc()


    @property
    def path(self):
        return build_url([self.parent.path, '@%s/gazmap-data' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'gazmap', 'data.json'])


class HistoryTopicsAlphabeticalIndexPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/historytopicalphabeticalindex.html'

    @property
    def histtopics(self):
        query = self.pad.query('/HistTopics')
        display_records = []
        for record in query:
            alphabetical = record['alphabetical']
            for display in alphabetical:
                purged = purge_mlink(display).lower()
                data = {
                    'record': record,
                    'display': display,
                    'purged': purged
                }
                display_records.append(data)
        display_records_sorted = sorted(display_records, key=lambda p: p['purged'])
        return display_records_sorted

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/histtopics' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'histtopics'])


class QuotationsIndexPage(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self.template = 'plugins/quotationsindex.html'

    @property
    def mathematicians(self):
        query = self.pad.query('/Biographies')
        display_records = []
        for record in query:
            if len(record['quotations'].blocks) == 0:
                continue
            alphabetical = record['alphabetical']
            for display in alphabetical:
                purged = purge_mlink(display).lower()
                data = {
                    'record': record,
                    'display': display,
                    'purged': purged
                }
                display_records.append(data)
        display_records_sorted = sorted(display_records, key=lambda p: p['purged'])
        return display_records_sorted

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/quotations' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([OUTPUT_PATH, 'quotations'])


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
            bigimages = biographyimages.filter(F.main == False)
            has_pictdisplay = bigimages.count() > 0
            if thumbnail:
                with_thumbnails.append({
                    'page': m,
                    'thumbnail': thumbnail,
                    'has_pictdisplay': has_pictdisplay
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


class MapDataBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        source = self.source
        with artifact.open('w') as f:
            json.dump(source.places(), f)


class MathshistoryOtherindexesPlugin(Plugin):
    name = 'mathshistory-otherindexes'
    description = u'Creates various indexes needed by the Maths History site'

    def on_setup_env(self, **extra):
        self.env.add_build_program(PictureIndexPage, IndexBuildProgram)
        self.env.add_build_program(SocietiesFoundationIndexPage, IndexBuildProgram)
        self.env.add_build_program(QuotationsIndexPage, IndexBuildProgram)
        self.env.add_build_program(HistoryTopicsAlphabeticalIndexPage, IndexBuildProgram)
        self.env.add_build_program(GazMapPage, IndexBuildProgram)
        self.env.add_build_program(GazMapData, MapDataBuildProgram)

        @self.env.generator
        def searchdata_generator(record):
            if not isinstance(record, Page):
                return

            if record.path == SOURCE_PATH:
                # do the picture index
                yield PictureIndexPage(record)
                yield SocietiesFoundationIndexPage(record)
                yield QuotationsIndexPage(record)
                yield HistoryTopicsAlphabeticalIndexPage(record)
                yield GazMapPage(record)
                yield GazMapData(record)


        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def popup_virtual_path_resolver(node, pieces):
            if node.path != SOURCE_PATH:
                return

            if len(pieces) == 1:
                if pieces[0] == 'pictures':
                    return PictureIndexPage(node)
                elif pieces[0] == 'societies':
                    return SocietiesFoundationIndexPage(node)
                elif pieces[0] == 'quotations':
                    return QuotationsIndexPage(node)
                elif pieces[0] == 'histtopics':
                    return HistoryTopicsAlphabeticalIndexPage(node)
                elif pieces[0] == 'gazmap':
                    return GazMapPage(node)
                elif pieces[0] == 'gazmap-data':
                    return GazMapData(node)
