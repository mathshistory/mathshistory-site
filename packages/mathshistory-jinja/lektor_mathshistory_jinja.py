# -*- coding: utf-8 -*-
from lektor.pluginsystem import Plugin
from lektor.context import get_ctx

from markupsafe import escape
from werkzeug.urls import url_parse
from urllib.parse import urljoin
from num2words import num2words

import time
import os
import datetime

class MathshistoryJinjaPlugin(Plugin):
    name = 'mathshistory-jinja'
    description = u'Defines several useful jinja2 filters and globals that are used throughout the Maths History site.'

    def on_setup_env(self, **extra):

        def refs_format(blocks):
            res = []
            for block in blocks:
                res.append({
                    'number': block['number'],
                    'reference': block['reference']
                })
            return res

        def basename(path):
            return os.path.basename(path)

        def without_ext(name):
            return os.path.splitext(name)[0]

        def format_year(year):
            try:
                if year < 0:
                    year = '%s BC' % (year * -1)
                return year
            except:
                return False

        def any_url(link):
            ctx = get_ctx()
            if ctx is not None:
                record = ctx.source
                if record is not None:
                    url = url_parse(link)
                    if not url.scheme:
                        link = record.url_to(link, base_url=ctx.base_url)
            link = escape(link)
            return link

        def canonical_url(source):
            url_path = source.url_path
            base = 'https://mathshistory.st-andrews.ac.uk/'
            absolute = urljoin(base, url_path)
            return absolute

        def tense(year):
            year_now = datetime.datetime.now().year
            year = int(year)
            if year <= year_now:
                return 'was'
            else:
                return 'will be'

        def tense_plural(year):
            if tense(year) == 'was':
                return 'were'
            return tense(year)

        def actual_safe(text):
            return text.__html__().unescape()

        self.env.jinja_env.filters['refs_format'] = refs_format
        self.env.jinja_env.filters['basename'] = basename
        self.env.jinja_env.filters['without_ext'] = without_ext
        self.env.jinja_env.filters['format_year'] = format_year
        self.env.jinja_env.filters['any_url'] = any_url
        self.env.jinja_env.filters['canonical_url'] = canonical_url
        self.env.jinja_env.filters['tense'] = tense
        self.env.jinja_env.filters['tense_plural'] = tense_plural
        self.env.jinja_env.filters['num2words'] = num2words
        self.env.jinja_env.filters['actual_safe'] = actual_safe
