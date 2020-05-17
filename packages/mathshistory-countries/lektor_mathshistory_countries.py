# -*- coding: utf-8 -*-
import posixpath
import json
import os
import time
import traceback
import random
import re

from lektor.build_programs import BuildProgram
from lektor.environment import Expression, FormatExpression
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url, bool_from_string
from lektor.context import get_ctx
from lektor.db import Page
from lektor.environment import PRIMARY_ALT
from lektor.utils import cleanup_path

VIRTUAL_SOURCE_ID = 'countries'
SOURCE_PATH = '/Biographies'
DATA_PATH = '/Countries'
PASS_UNKNOWN = '--Unknown--'

_countries_cache = None
_countries_name_cache = None

def random_int():
    return random.randint(0, 3000)

def get_countries_cache(pad):
    get_page_cache(pad)
    return _countries_cache

def get_countries_name_cache(pad):
    get_page_cache(pad)
    return _countries_name_cache

def get_page_cache(pad):
    global _countries_cache, _countries_name_cache
    if _countries_cache != None:
        return
    _countries_cache = {}

    # first get the countries
    _countries_name_cache = {}
    for slug, _, is_attachment in pad.db.iter_items(DATA_PATH):
        if is_attachment or slug is None or slug == '' or slug == PASS_UNKNOWN:
            continue
        # use special pad_get which doesn't auto add dependencies
        record = pad_get(pad, '%s/%s' % (DATA_PATH, slug))
        _countries_name_cache[slug] = record['name']


    # now get the biographies
    for name, _, is_attachment in pad.db.iter_items(SOURCE_PATH):
        if is_attachment:
            continue
        # use special pad_get which doesn't auto add dependencies
        record = pad_get(pad, '%s/%s' % (SOURCE_PATH, name))
        country = record['country']
        if country is None or country == '' or country not in _countries_name_cache:
            continue

        country = _countries_name_cache[country]
        if country is None or country == '':
            continue

        if country not in _countries_cache:
            _countries_cache[country] = []
        _countries_cache[country].append(record)


def mathematicians_by_country(pad, country):
    cache = get_countries_cache(pad)
    return cache[country]

def all_countries(pad):
    cache = get_countries_cache(pad)
    name_cache = get_countries_name_cache(pad)
    as_array = [{'slug':k,'name':name_cache[k],'number':len(v)} for (k,v) in cache.items()]
    return sorted(as_array, key=lambda k: k['name'])


class MathshistoryCountriesPlugin(Plugin):
    name = 'mathshistory-countries'
    description = u'Creates the country pages, listing mathematicians by birth country.'

    def on_setup_env(self, **extra):
        self.env.jinja_env.globals.update(mathematicians_by_country=mathematicians_by_country)
        self.env.jinja_env.globals.update(all_countries=all_countries)




##### PAD GET #####

# re-implementation of pad.get without dependency tracking
def pad_get(pad, path, alt=PRIMARY_ALT, page_num=None, persist=True,
        allow_virtual=True):
    virt_markers = path.count('@')

    # If the virtual marker is included, we also want to look up the
    # virtual path below an item.  Special case: if virtual paths are
    # not allowed but one was passed, we just return `None`.
    if virt_markers == 1:
        if page_num is not None:
            raise RuntimeError('Cannot use both virtual paths and '
                               'explicit page number lookups.  You '
                               'need to one or the other.')
        if not allow_virtual:
            return None
        path, virtual_path = path.split('@', 1)
        rv = pad_get(pad, path, alt=alt, page_num=page_num,
                      persist=persist)
        if rv is None:
            return None
        return pad.get_virtual(rv, virtual_path)

    # Sanity check: there must only be one or things will get weird.
    elif virt_markers > 1:
        return None

    path = cleanup_path(path)
    virtual_path = None
    if page_num is not None:
        virtual_path = str(page_num)

    rv = pad.cache.get(path, alt, virtual_path)
    if rv is not Ellipsis:
        if rv is not None:
            #pad.db.track_record_dependency(rv)
            pass
        return rv

    raw_data = pad.db.load_raw_data(path, alt=alt)
    if raw_data is None:
        pad.cache.remember_as_missing(path, alt, virtual_path)
        return None

    rv = pad.instance_from_data(raw_data, page_num=page_num)

    if persist:
        pad.cache.persist(rv)
    else:
        pad.cache.remember(rv)

    #return self.db.track_record_dependency(rv)
    return rv
