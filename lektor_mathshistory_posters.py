# -*- coding: utf-8 -*-
import posixpath
import datetime
from urllib.parse import urljoin

from lektor.build_programs import BuildProgram
from lektor.pluginsystem import Plugin
from lektor.sourceobj import VirtualSourceObject
from lektor.utils import build_url
from lektor.db import Page
from lektor.db import F
from lektor.context import get_ctx

VIRTUAL_SOURCE_ID = 'poster'

class BiographyPoster(VirtualSourceObject):
    def __init__(self, parent, type):
        VirtualSourceObject.__init__(self, parent)
        self.type = type

    @property
    def borndied(self):
        if self.type == 'died':
            return 'died'
        return 'was born'

    @property
    def years(self):
        date = self.date
        then = datetime.datetime.strptime(date, '%d %B %Y')
        now = datetime.datetime.now()
        difference_years = now.year - then.year
        # don't do this, because we want the year to be correct on the day of viewing, not the day of the site build
        #if now.month < then.month or (now.month == then.month and now.day < then.day):
        #    difference_years -= 1
        return difference_years

    @property
    def date(self):
        date = self.parent['birthdate']
        if self.type == 'died':
            date = self.parent['deathdate']
        return date

    @property
    def path(self):
        return build_url([self.parent.path, '@%s/' % VIRTUAL_SOURCE_ID, self.type])

    @property
    def url_path(self):
        return build_url([self.parent.url_path, 'poster', self.type])


class BiographyPosterBuildProgram(BuildProgram):
    def produce_artifacts(self):
        self.declare_artifact(
            posixpath.join(self.source.url_path, 'index.html'),
            sources=list(self.source.iter_source_filenames()),
        )

    def build_artifact(self, artifact):
        artifact.render_template_into('plugins/biographyposter.html', this=self.source)


def can_generate(record, field):
    # does it have a big image
    has_image = record.attachments.filter(F.main == False).count()
    if not has_image:
        return False

    # can we format the born/died date properly?
    date = record[field]
    try:
        datetime.datetime.strptime(date, '%d %B %Y')
        return True
    except:
        return False


def has_born_poster(record):
    return can_generate(record, 'birthdate')
def has_died_poster(record):
    return can_generate(record, 'deathdate')

class MathshistoryPostersPlugin(Plugin):
    name = 'mathshistory-posters'
    description = u'Creates the biography poster pages for the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_build_program(BiographyPoster, BiographyPosterBuildProgram)

        self.env.jinja_env.filters['has_born_poster'] = has_born_poster
        self.env.jinja_env.filters['has_died_poster'] = has_died_poster

        @self.env.generator
        def searchdata_generator(record):
            if not isinstance(record, Page):
                return

            if record['_model'] == 'biography':
                if has_born_poster(record):
                    yield BiographyPoster(record, 'born')
                if has_died_poster(record):
                    yield BiographyPoster(record, 'died')

        @self.env.virtualpathresolver('%s' % VIRTUAL_SOURCE_ID)
        def poster_virtual_path_resolver(node, pieces):
            if len(pieces) == 1:
                if pieces[0] == 'born' and has_born_poster(node):
                    return BiographyPoster(node, 'born')
                if pieces[0] == 'died' and has_died_poster(node):
                    return BiographyPoster(node, 'died')
