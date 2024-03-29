# -*- coding: utf-8 -*-
import posixpath
import json
import traceback
from werkzeug.urls import url_parse

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page

VIRTUAL_SOURCE_ID = 'mapdata'
SOURCE_PATH = '/Map'

# thanks to https://stackoverflow.com/a/2580236/2370460
def format_latlon(dd_lat, dd_lon):
    # do lat
    mnt,sec = divmod(abs(dd_lat) * 3600, 60)
    deg,mnt = divmod(mnt, 60)
    lat_deg = int(deg)
    lat_min = int(mnt) if sec < 30 else int(mnt) + 1
    lat_direction = 'S' if dd_lat < 0 else 'N'

    # do lon
    mnt,sec = divmod(abs(dd_lon) * 3600, 60)
    deg,mnt = divmod(mnt, 60)
    lon_deg = int(deg)
    lon_min = int(mnt) if sec < 30 else int(mnt) + 1
    lon_direction = 'W' if dd_lon < 0 else 'E'

    return "%s°%s'%s %s°%s'%s" % (lat_deg, lat_min, lat_direction, lon_deg, lon_min, lon_direction)

def purge_mlink(s):
    #The below code is modified from the original htmlformat function to ensure compatibility
    rawch   = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ','ł','Ł','ś','Ś','ț','Ț']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n','l','L','s','S','t','T']
    for idx, raw in enumerate(rawch):
        trans = transch[idx]
        s = s.replace(raw, trans)
    return s

def query_to_display(query):
    # this is a modified version that only returns the first alphabetical listing for each record, not them all
    display_records = []
    for record in query:
        alphabetical = record['alphabetical']
        if len(alphabetical) > 0:
            display = alphabetical[0]
            purged = purge_mlink(display).lower()
            data = {
                'record': record,
                'display': display,
                'purged': purged
            }
            display_records.append(data)
    display_records_sorted = sorted(display_records, key=lambda p: p['purged'])
    return display_records_sorted

class MapData(VirtualSourceObject):
    def __init__(self, parent):
        VirtualSourceObject.__init__(self, parent)
        self._cache = None

    def places(self):
        try:
            if self._cache == None:
                # find the places
                places = {}
                map = self.pad.get('/Map')
                for place in self.pad.query(SOURCE_PATH).include_undiscoverable(True):
                    id = place['_slug']

                    # get the gaz urls
                    gaz_urls = []
                    if place['gaz'] and place['gaz'] != '':
                        for gaz_place in place['gaz'].split(','):
                            gaz_urls.append(self.parent.url_to('/Gaz/%s' % gaz_place))

                    # get the country name
                    if place['country'] and place['country'] != '':
                        country = self.pad.get('/Countries/%s' % place['country'])
                        countryName = False
                        if country:
                            countryName = country['name']
                        else:
                            print('Place %s has an invalid country' % place['name'])
                    else:
                        countryName = ''
                        print('Place %s is missing a country' % place['name'])

                    # fill out the json
                    places[id] = {
                        'id': id,
                        'name': place['name'],
                        'country': countryName,
                        'links': [{'text':(p['text']),'url':p['url']} for p in place['links'].blocks],
                        'gaz': gaz_urls,
                        'longitude': place['longitude'],
                        'latitude': place['latitude'],
                        'formatted': format_latlon(place['latitude'], place['longitude']),
                        'people': []
                    }

                # populate the places with people
                for display_person in query_to_display(self.pad.query('/Biographies')):
                    person = display_person['record']
                    place_id = person['maplocation']
                    if place_id and place_id.strip() != '' and place_id in places:
                        data = {
                            'name': display_person['display'],
                            'url': self.parent.url_to(person),
                            'near': person['nearplace']
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
