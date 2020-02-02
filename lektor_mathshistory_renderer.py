# -*- coding: utf-8 -*-
from subprocess import PIPE, Popen
from markupsafe import Markup, escape
from weakref import ref as weakref
from werkzeug.urls import url_parse
import traceback
import html

from bs4 import BeautifulSoup
#import html5lib
import regex as re

from lektor._compat import PY2
from lektor.context import get_ctx
from lektor.pluginsystem import Plugin
from lektor.types import Type

STDIO_CMD = ['/usr/bin/env', 'katex']

class HTML(object):
    def __init__(self, source, record=None):
        self.source = source
        self.__record = weakref(record) if not None else lambda: None
        self.__cached_for_ctx = None
        self.__html = None

    def __render(self):
        try:
            context = get_ctx()
            if self.__html is None or self.__cached_for_ctx != context:
                self.__html = render(self.source, self.__record())
                self.__cached_for_ctx = context
        except:
            print('render error: ')
            traceback.print_exc()
            raise

    def __bool__(self):
        return bool(self.source)

    def __unicode__(self):
        self.__render()
        return self.__html

    if not PY2:
        __str__ = __unicode__

    def __html__(self):
        self.__render()
        return Markup(self.__html)


# Wrapper with an __html__ method prevents Lektor from escaping HTML tags.
class HTMLDescriptor(object):
    def __init__(self, markup):
        self.markup = markup

    def __get__(self, obj):
        if obj is None:
            return self
        return HTML(self.markup, record=obj)


class MarkupType(Type):
    widget = 'multiline-text'
    def value_from_raw(self, raw):
        return HTMLDescriptor(raw.value or u'')


class MathshistoryRendererPlugin(Plugin):
    name = 'mathshistory-renderer'
    description = u'Renders the markup used for the maths history site into HTML.'

    def on_setup_env(self, **extra):
        self.env.add_type(MarkupType)



#### HTML CONVERSION FUNCTIONS ####

def purge(w):
    rawch = ['á','à','â','ä','ã','Á','Â','Ä','é','è','ê','ë','É','î','í','ó','ô','ö','ò','õ','Ö','û','ú','ü','ù','Ü','ç','ï','ø','Ø','ñ']
    transch = ['a','a','a','a','a','A','A','A','e','e','e','e','E','i','i','o','o','o','o','o','O','u','u','u','u','U','c','i','o','O','n']
    for i in range(0, len(rawch)):
        w = w.replace(rawch[i], transch[i])
    return w


def render(source, record):
    # convert html character references (ie. &#62;) to unicode
    source = html.unescape(source)

    # breaks and paragraphs (this needs to be fixed)
    # see /Honours/AMShistory/
    '''source = source.replace('\n','¶')
    source = source.replace('<n>¶','\n')
    source = source.replace('¶¶','\n<p>')
    source = source.replace('¶','<br>\n')'''
    source = source.replace('\n\n','\n<br><br>\n')

    # convert <cp>...</cp>
    source = source.replace('<cp>','<div class="grey-block">')
    source = source.replace('</cp>','</div>')

    # convert <cpb>...</cpb>
    source = source.replace('<cpb>','<div class="blue-block">')
    source = source.replace('</cpb>','</div>')

    # convert <Q>...</Q>
    regex = re.compile(r'<[Qq]>(.*?)</[Qq]>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<blockquote>\1</blockquote>', source)

    # convert <k>...</k>
    source = source.replace('<k>','<div class="center-paragraph">')
    source = source.replace('</k>','</div>')

    # convert <ind>...</ind>
    source = source.replace('<ind>','<div class="indent-paragraph">')
    source = source.replace('</ind>','</div>')

    # convert latex to katex
    regex = re.compile(r'<latex>(?P<latex>.*?)</latex>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: katexrender(match, record), source)

    # convert ^superscript
    regex = re.compile(r'\^([^\s{}]+)', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="superscript">\1</span>', source)

    # convert ¬subscript
    regex = re.compile(r'¬(\S+)', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="subscript">\1</span>', source)

    # convert <m>...</m> and <m name>...</m>
    regex = re.compile(r'<m(?:\s+(?P<name>.+?))?>(?P<text>.*?)\<\/m\>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: mrender(match, record), source)

    # convert <g glossary>...</g>
    regex = re.compile(r'<g\s+(?P<glossary>.+?)>(?P<text>.*?)\<\/g\>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: glrender(match, record), source)

    # convert <ac academy>...</ac>
    regex = re.compile(r'<ac\s+(?P<society>.+?)>(?P<text>.*?)\<\/ac\>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: societyrender(match, record), source)

    # convert <E num>
    regex = re.compile(r'<E (?P<number>\d+)>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: extrarender(match, record), source)

    # convert <r>...</r>
    source = source.replace('<r>','<span class="red-text">')
    source = source.replace('</r>','</span>')

    # convert <bl>...</bl>
    source = source.replace('<bl>','<span class="blue-text">')
    source = source.replace('</bl>','</span>')

    # convert <gr>...</gr>
    source = source.replace('<gr>','<span class="green-text">')
    source = source.replace('</gr>','</span>')

    # convert <bro>...</bro>
    source = source.replace('<bro>','<span class="brown-text">')
    source = source.replace('</bro>','</span>')

    # convert <f+>...</f+>
    regex = re.compile(r'<f\+>(.*?)</f>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="bigger">\1</span>', source)

    # convert <f++>...</f++>
    regex = re.compile(r'<f\+\+>(.*?)</f>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="bigger"><span class="bigger">\1</span></span>', source)

    # convert <f->...</f->
    regex = re.compile(r'<f->(.*?)</f>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="smaller">\1</span>', source)

    # convert <c>...</c>
    source = source.replace('<c>','<code>')
    source = source.replace('</c>','</code>')

    # convert <ovl>...</ovl>
    source = source.replace('<ovl>','<span class="overline">')
    source = source.replace('</ovl>','</span>')

    # convert <d ...>
    regex = re.compile(r'<d\s+(?P<content>.+?)>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: drender(match, record), source)

    # convert [refnum]
    regex = re.compile(r'\[(\d+)\]', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span>[<a href="#reference-\1" class="reference reference-\1">\1</a>]</span>', source)

    # convert <T num>
    regex = re.compile(r'<T (?P<number>\d+)>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: trender(match, record), source)

    # convert the link location
    regex = re.compile(r'<a\s+href\s*=\s*[\'"]?(?P<href>.+?)[\'"]?\s*>(?P<text>.*?)<\/a>')
    source = re.sub(regex, lambda match: linkrender(match, record), source)

    # convert the link location
    regex = re.compile(r'(?P<tag><img\s+.+?>)', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: imgreplace(match, record), source)


    # other from the htmlformat function in the stack

    # smart quotes
    source = source.replace('’',"'")
    source = source.replace('‘',"'")
    source = source.replace('“','"')
    source = source.replace('”','"')

    source = source.replace('<clear>', '<br clear=right>')
    source = source.replace('<clearl>', '<br clear=left>')
    source = source.replace('<proofend>', '<d xproofend right><br clear=right>')

    source = tags_to_unicode(source)

    return source



def mrender(match, record):
    name = match.group('name')
    text = match.group('text')
    return mlink(name, text, record)

def mlink(name, text, record):
    if not name:
        last_word = text.split(' ')[-1]
        name = purge(last_word)
    href = '/Biographies/%s/' % name
    popup_href = '/Biographies/%s/@popup/' % name
    href = correct_link(href, record)
    popup_href = correct_link(popup_href, record)
    return '<a class="mlink" data-popup="%s" href="%s">%s</a>' % (popup_href, href, text)

def glrender(match, record):
    glossary = match.group('glossary')
    text = match.group('text')
    href = '/Glossary/#%s' % glossary
    popup_href = '/Glossary/%s/' % glossary
    href = correct_link(href, record)
    popup_href = correct_link(popup_href, record)
    return '<a class="gllink" href="%s" data-popup="%s">%s</a>' % (href, popup_href, text)

def societyrender(match, record):
    society = match.group('society')
    text = match.group('text')
    href = '/Societies/%s/' % society
    href = correct_link(href, record)
    return '<a class="aclink" href="%s" target="_blank">%s</a>' % (href, text)

def extrarender(match, record):
    number = match.group('number')
    extras = record['additional'].blocks
    extra = list(filter(lambda extra: int(extra['number']) == int(number), extras))
    if len(extra) != 1:
        print('Extra not found. Skipping.')
        return ''
    extra = extra[0]
    href = extra['link'].strip()
    href = correct_link(href, record)
    return '<a href="%s">THIS LINK</a>' % href

def trender(match, record):
    number = match.group('number')
    translations = record['translations'].blocks
    translation = list(filter(lambda t: int(t['number']) == int(number), translations))
    if len(translation) != 1:
        print('Translation not found. Skipping.')
        return ''
    translation = translation[0]
    text = translation['translation'].__html__().strip()
    return '<span><a data-translation="%s" class="translation nonoscript">&#9417;</a><noscript>(%s)</noscript></span>' % (text, text)

def drender(match, record):
    content = match.group('content')
    align = ''
    other = ''
    items = content.split(',')
    words = items[0].split(' ')
    name = words[0]
    if len(words) > 1:
        align = words[1]
    if len(items) > 1:
        other = items[1]
    if '.' not in name:
        name = '%s.gif' % name
    href = '/Diagrams/%s' % name
    href = correct_link(href, record)
    if align != '':
        return '<img src="%s" %s />' % (href, other)
    else:
        return '<img src="%s" align="%s" %s />' % (href, align, other)

def linkrender(match, record):
    text = match.group('text')
    href = match.group('href')
    # convert biography links into m links
    if href.startswith('/Biographies/') and '#' not in href:
        if (href.endswith('/') and href.count('/') == 3) or href.count('/') == 2:
            name = href[13:]
            if href.endswith('/'):
                name = name[:-1]

            return mlink(name, text, record)
    href = correct_link(href, record)
    return '<a href="%s">%s</a>' % (href, text)

def katexrender(match, record):
    latex = match.group('latex')
    p = Popen(STDIO_CMD, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = p.communicate(latex.encode('utf-8'))
    if p.returncode != 0:
        return '<span class="math-error">%s</span>' % latex
    html = out.decode('utf-8')
    return '<span class="math">%s</span>' % html

def imgreplace(match, record):
    tag = match.group('tag')
    soup = BeautifulSoup(tag, 'html5lib')
    img = soup.find('img')
    src = img['src']
    img['src'] = correct_link(img['src'], record)
    fixed = img.prettify().strip()
    return fixed

def correct_link(link, record):
    if record is not None:
        url = url_parse(link)
        if not url.scheme:
            if get_ctx():
                link = record.url_to(link, base_url=get_ctx().base_url)
    link = escape(link)
    return link




# from symbolreplace.py

def tags_to_unicode(text, katex=False):
    # web browsers can now understand unicode fine, so there is no reason to use
    # the custom tages that get converted into symbols any more.
    # instead we can just plop in the unicode characters
    greek_tags = ['<a>','<beta>','<be>','<g>','<gamma>','<d>','<e>','<th>','<theta>','<lambda>','<l>','<mu>','<nu>','<rho>','<sigma>','<psi>','<tau>','<phi>','<chi>','<omega>','<xi>','<zeta>','<eta>']
    greek_unicode = ['α','β','β','γ','γ','δ','ε','θ','θ','λ','λ','μ','ν','ρ','σ','ψ','τ','φ','χ','ω','ξ','ζ','η']
    greek_katex = ['\\alpha','\\beta','\\beta','\\gamma','\\gamma','\\delta','\\epsilon','\\theta','\\theta','\\lambda','\\lambda','\\mu','\\nu','\\rho','\\sigma','\\psi','\\tau','\\phi','\\chi','\\omega','\\xi','\\zeta','\\eta']

    math_tags = ['<bigdelta>','<bigsigma>','<sum>','<biglambda>','<bigpi>','<prod>','<bigomega>','<biggamma>','<degrees>','<curlyd>','<divide>','<pounds>','<angle>','<integral>','<intersect>','<inter>','<union>','<infinity>','<section>','<rarrow>','<cross>','<aleph>','<vec>','<wedge>','<isin>','<notin>','<half>','<isomorphic>','<forall>','<thereexists>','<subset>','<psubset>','<not>','<planck>','<tensor>']
    math_unicode = ['Δ','Σ','∑','Λ','Π','∏','Ω','Γ','°','∂','÷','£','∠','∫','∩','∩','∪','∞','§','→','×','ℵ','∧','∨','∈','∉','½','≅','∀','∃','⊆','⊂','¬','ℏ','⊗']
    math_katex = ['\\Delta','\\Sigma','\\sum','\\Lambda','\\Pi','\\prod','\\Omega','\\Gamma','\\degree','\\partial','\\div','\\pounds','\\angle','\\int','\\cap','\\cap','\\cup','\\infty','\\text{\\sect}','\\rightarrow','\\times','\\aleph','\\land','\\lor','\\isin','\\notin','1\\over2','\\approxeq','\\forall','\\exists','\\subseteq','\\subset','\\neg','\\hbar','\\otimes']

    other_tags = ['<scomma>','<tcomma>','<Tcomma>','<acup>','<L/>','<l/>','<o//>','<O/>','<o/>','<Zdot>','<zdot>','<ao>','<Ccup>','<z/>','<s/>','<n/>','<Scup>','<edot>','<scup>','<ccup>','<ecedil>','<ehook>','<S/>','<laplacian>','<Ao>','<dot>','<curlytheta>','<angle>','<ahook>','<scedil>','<Acup>','<atilde>','<c/>','<gcup>','<Zcup>','<zcup>','<ubar>','<u//>','<ss>','<uhook>','<ecup>','<rcup>','<uring>','<d/>']
    other_unicode = ['ș','ț','Ț','ă','Ł','ł','ő','Ø','ø','Ż','ż','å','Č','ź','ś','ń','Š','ė','š','č','ȩ','ę','Ś','∇','Å','·','ϑ','∠','ą','ş','Ǎ','ã','ć','ğ','Ž','ž','ū','ű','ß','ų','ě','ř','ů','ð']
    other_katex = ['ș','ț','Ț','\\check{a}','Ł','ł','\\text{\\H{o}}','\\text{\\O}','\\text{\\o}','\\dot{Z}','\\dot{z}','\\text{\\r{a}}','\\check{C}','\\acute{z}','\\acute{s}','\\acute{n}','\\check{S}','\\dot{e}','\\check{s}','\\check{c}','ȩ','ę','\\acute{S}','\\nabla','\\mathring{A}','\\cdot','\\vartheta','\\angle','ą','ş','\\check{A}','\\tilde{a}','\\acute{c}','\\check{g}','\\check{~}','\\check{z}','\\bar{u}','\\text{\\H{u}}','\\text{\\ss}','ų','\\check{e}','\\check{r}','\\mathring{u}','ð']

    math_codes = ['==>','<==','<=>','|->','<-->','-->']
    math_codes_unicode = ['⇒','⇐','⇔','↦','⟷','→']
    math_codes_katex = ['\\Rightarrow','\\Leftarrow','\\Leftrightarrow','\\mapsto','\\leftrightarrow','\\rarr']

    all_tags = greek_tags + math_tags + other_tags + math_codes
    all_unicode = greek_unicode + math_unicode + other_unicode + math_codes_unicode

    if katex:
        all_unicode = greek_katex + math_katex + other_katex + math_codes_katex
        all_unicode = [' %s ' % s for s in all_unicode]

    for tag, unicode in zip(all_tags, all_unicode):
        #unicode = unicode.replace('\\', '\\\\')
        text = text.replace(tag, unicode)

    # sneaky fix - also do html character tags
    text = html.unescape(text)

    return text
