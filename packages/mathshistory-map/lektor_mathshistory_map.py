# -*- coding: utf-8 -*-
import posixpath
import json
import traceback

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'mapdata'
SOURCE_PATH = '/Map'

class MapData(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self._cache = None

    def places(self):
        try:
            if self._cache == None:
                # find the places
                places = {}
                for place in self.pad.query(SOURCE_PATH).include_undiscoverable(True):
                    id = place['_slug']
                    gaz_urls = []
                    if place['gaz'] and place['gaz'] != '':
                        for gaz_place in place['gaz'].split(','):
                            gaz_urls.append(self.parent.url_to('/Gaz/%s' % gaz_place))
                    places[id] = {
                        'id': id,
                        'name': place['name'],
                        'country': place['country'],
                        'webref': place['webref'].url,
                        'gaz': gaz_urls,
                        'longitude': place['longitude'],
                        'latitude': place['latitude'],
                        'people': []
                    }

                # populate the places with people
                for person in self.pad.query('/Biographies'):
                    place_id = person['maplocation']
                    if place_id and place_id.strip() != '' and place_id in places:
                        data = {
                            'name': person['shortname'],
                            'url': self.parent.url_to(person)
                        }
                        places[place_id]['people'].append(data)

                # remove any empty places, and convert to list
                places = [places[k] for k in places if len(places[k]['people']) != 0]

                self._cache = places

            return self._cache
        except:
            traceback.print_exc()


    @property
    def path(self):
        return build_url([self.parent.path, '@%s' % VIRTUAL_SOURCE_ID])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'data.json'])


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


class MathshistoryMapPlugin(Plugin):
    name = 'mathshistory-map'
    description = u'Creates the interactive birthplace map for the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(MapData, MapDataBuildProgram)

        @self.env.virtualpathresolver(VIRTUAL_SOURCE_ID)
        def map_data_path_resolver(node, pieces):
            if len(pieces) == 0:
                if node.path == SOURCE_PATH:
                    return MapData(node)

        @self.env.generator
        def map_data_generator(record):
            if record.path != SOURCE_PATH:
                return

            yield MapData(record)
