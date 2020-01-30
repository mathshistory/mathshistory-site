# -*- coding: utf-8 -*-
from lektor.pluginsystem import Plugin
import time
import os

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
            if year < 0:
                year = '%s BC' % (year * -1)
            return year

        self.env.jinja_env.filters['refs_format'] = refs_format
        self.env.jinja_env.filters['basename'] = basename
        self.env.jinja_env.filters['without_ext'] = without_ext
        self.env.jinja_env.filters['format_year'] = format_year
