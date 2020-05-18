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

    # convert <cp>...</cp>
    regex = re.compile(r'<cp>\s*(.*?)\s*</cp>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<div class="grey-block">\1</div>', source)

    # convert <cpb>...</cpb>
    regex = re.compile(r'<cpb>\s*(.*?)\s*</cpb>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<div class="blue-block">\1</div>', source)

    # convert <Q>...</Q>
    regex = re.compile(r'<[Qq]>\s*(?P<quote>.*?)\s*</[Qq]>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<blockquote>\1</blockquote>', source)

    # convert <k>...</k>
    regex = re.compile(r'<k>\s*(.*?)\s*</k>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<div class="center-paragraph">\1</div>', source)

    # convert <ind>...</ind>
    regex = re.compile(r'<ind>\s*(.*?)\s*</ind>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<div class="indent-paragraph">\1</div>', source)

    # convert latex to katex
    regex = re.compile(r'<latex>\s*(?P<latex>.*?)\s*</latex>', re.MULTILINE | re.DOTALL)
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

    # convert <fp>...</fp>
    regex = re.compile(r'<fp>(.*?)</fp>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="bigger">\1</span>', source)

    # convert <f++>...</f++>
    regex = re.compile(r'<f\+\+>(.*?)</f>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="bigger"><span class="bigger">\1</span></span>', source)

    # convert <f->...</f->
    regex = re.compile(r'<f->(.*?)</f>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, r'<span class="smaller">\1</span>', source)

    # convert <fm>...</fm>
    regex = re.compile(r'<fm>(.*?)</fm>', re.MULTILINE | re.DOTALL)
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

    # convert the link location
    regex = re.compile(r'<a\s+href\s*=\s*[\'"]?(?P<href>.+?)[\'"]?\s*>(?P<text>.*?)<\/a>')
    source = re.sub(regex, lambda match: linkrender(match, record), source)

    # convert [refnum]
    regex = re.compile(r'\[(?P<number>\d+)\]', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: referencerender(match, record), source)
    #source = re.sub(regex, r'<span>[<a href="#reference-\1" class="reference reference-\1">\1</a>]</span>', source)

    # convert <T num>
    regex = re.compile(r'<T (?P<number>\d+)>', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: trender(match, record), source)

    # convert the link location
    regex = re.compile(r'(?P<tag><img\s+.+?>)', re.MULTILINE | re.DOTALL)
    source = re.sub(regex, lambda match: imgreplace(match, record), source)


    # other from the htmlformat function in the stack

    # new (improved?) break-adder
    TAGS_MATCHER = r'</?((?:n)|(?:table)|(?:tr)|(?:td(\s+colspan="?\d"?)?)|(?:figure)|(?:p)|(?:br)|(?:li)|(?:ol)|(?:ul)|(?:div(\s+id))|(?:script)|(?:input)|(?:button)|(?:br ?/?)|(?:p)|(?:blockquote)|(?:code)|(?:h\d))>'
    regex = re.compile(r'(?<!%s)\s*?\n(?!\s*%s)' % (TAGS_MATCHER, TAGS_MATCHER), re.MULTILINE | re.DOTALL)
    source = re.sub(regex, '\n<br>\n', source)

    # never more than two <br>s together
    multiple_br_pattern = re.compile(r'(?:<br\w?/?>\s*){3,}', re.MULTILINE | re.DOTALL)
    match = re.search(multiple_br_pattern, source)
    while match:
        source = re.sub(multiple_br_pattern, '<br>\n<br>', source)
        match = re.search(multiple_br_pattern, source)

    # remove all the <n>s
    source = source.replace('<n>', '')

    # smart quotes
    source = source.replace('’',"'")
    source = source.replace('‘',"'")
    source = source.replace('“','"')
    source = source.replace('”','"')

    source = source.replace('<clear>', '<br clear="right">')
    source = source.replace('<clearl>', '<br clear="left">')
    source = source.replace('<proofend>', '<d xproofend right><br clear=right>')

    source = tags_to_unicode(source)

    source = fix_italics(source)

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
    if 'additional' not in record:
        print('Extra not found. Skipping.')
        return ''
    extras = record['additional'].blocks
    extra = list(filter(lambda extra: int(extra['number']) == int(number), extras))
    if len(extra) != 1:
        print('Extra not found. Skipping.')
        return ''
    extra = extra[0]
    href = extra['link'].strip()
    href = correct_link(href, record)
    return '<a class="elink" href="%s" target="_blank">THIS LINK</a>' % href

def referencerender(match, record):
    number = match.group('number')
    if 'references' not in record:
        print('Reference not found. Skipping.')
        return '[%s]' % number
    references = record['references'].blocks
    references = list(filter(lambda t: int(t['number']) == int(number), references))
    if len(references) != 1:
        print('Reference not found. Skipping.')
        return '[%s]' % number
    reference = references[0]
    text = reference['reference'].__html__().unescape().strip()
    text = html.escape(text, quote=True)
    generated_html = '<span>[<a href="#reference-%s" class="reference" data-popup="%s">%s</a>]</span>' % (number, text, number)
    return generated_html

def trender(match, record):
    number = match.group('number')
    if 'translations' not in record:
        print('Translation not found. Skipping.')
        return ''
    translations = record['translations'].blocks
    translation = list(filter(lambda t: int(t['number']) == int(number), translations))
    if len(translation) != 1:
        print('Translation not found. Skipping.')
        return ''
    translation = translation[0]
    text = translation['translation'].__html__().unescape().strip()
    escaped_text = html.escape(text, quote=True)
    generated_html = '<span><a data-popup="%s" class="translation nonoscript">&#9417;</a><noscript>(%s)</noscript></span>' % (escaped_text, text)
    return generated_html

def drender(match, record):
    content = match.group('content')
    align = ''
    other = ''
    items = content.split(',')
    words = items[0].split(' ')
    name = words[0]
    if len(words) > 1:
        align = words[1].strip()
    if len(items) > 1:
        other = items[1].strip()

    # sort out the align
    style = ''
    if align in ('left', 'right'):
        style = 'float: %s;' % align
    elif align == 'top':
        style = 'vertial-align: top;'
    elif align == 'middle':
        style = 'vertical-align: middle;' # this is not exactly right, but is the best there is
    elif align == 'bottom':
        style = 'vertical-align: initial;'

    # sort out the other
    params = ''
    if '=' in other:
        params = other
    elif ':' in other:
        style += ' %s' % other

    # put it all together
    if style.strip() != '':
        params = ('style="%s" %s' % (style.strip(), params.strip())).strip()

    # sort out the href
    if '.' not in name:
        name = '%s.gif' % name
    href = '/Diagrams/%s' % name

    if params != '':
        return '<img class="diagram" src="%s" %s />' % (href, params)
    else:
        return '<img class="diagram" src="%s" />' % href

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
    generated_html = out.decode('utf-8')
    return '<span class="math">%s</span>' % generated_html.strip()

def imgreplace(match, record):
    tag = match.group('tag')
    soup = BeautifulSoup(tag, 'html5lib')
    img = soup.find('img')
    if img == None:
        print('IMAGE ERROR: %s ' % tag)
    src = img['src']
    img['src'] = correct_link(img['src'], record)
    fixed = str(img).strip()
    return fixed

def correct_link(link, record):
    url = url_parse(link)
    if not url.scheme:
        context = get_ctx()
        if context:
            source = context.source
            link = source.url_to(link)
    link = escape(link)
    return link

# hack function, goes through the entire document and fixes the italics
# this might be quite slow. but John likes non-italic numbers/brackets, so it has to stay for now
NON_ITALIC_PATTERN = re.compile(r'([\d\[\]\(\)]+)')
def fix_italics(x):
    try:
        s = BeautifulSoup(x, 'html5lib')
        for text_node in list(s.strings):
            if re.search(NON_ITALIC_PATTERN, text_node.string):
                new_html = re.sub(NON_ITALIC_PATTERN, r'<span class="non-italic">\1</span>', text_node.string)
                new_soup = BeautifulSoup(new_html, 'html.parser')
                text_node.replace_with(new_soup)
        out = ''
        for child in s.body.children:
            out += '%s\n' % str(child)
        return out
    except:
        return x


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

    return text


source = '<cp>The Association for the Improvement of Geometrical Teaching changed its name to The Mathematical Association in 1897. \xa0The first Annual Meeting of the Mathematical Association was in 1898. \xa0Formal Presidential Addresses started with Professor G H Bryan in 1908. Normally Presidential Addresses were given at the end of each year of the term. One-year terms started in 1934.</cp>\n<table><n>\n<tr><td style=\'width:40px;\'><b>Year </b> <td style=\'width:190px;\'>  <b>President</b>    <td style=\'width:450px;\'>    <b>Presidential Address</b> </i>\n\n<tr><td><b>1898</b> <td>Professor <m>A Lodge</m> <td>No address </i>\n\n<tr><td><b>1899</b> <td>Professor <m>A Lodge</m> <td>No address\n\n<tr><td><b>1900</b> <td>Professor Sir <m>Robert S Ball</m> <td>No address\n\n<tr><td><b>1901</b> <td>Professor Sir <m>Robert S Ball</m> <td>No address\n\n<tr><td><b>1902</b> <td>Mr J F Moulton <td>No address\n\n<tr><td><b>1903</b> <td>Mr J F Moulton <td>No address\n\n<tr><td><b>1904</b> <td>Professor <m>A R Forsyth</m> <td>No address\n\n<tr><td><b>1905</b> <td>Professor <m>A R Forsyth</m> <td>No address\n\n<tr><td><b>1906</b> <td>Mr <m>G B Mathews</m> <td>No address\n\n<tr><td><b>1907</b> <td>Mr <m>G B Mathews</m> <td>No address\n\n<tr><td><b>1908</b> <td>Professor G H Bryan <td><i>The uses of mathematics and the training of the mathematical teacher </i>\n\n<tr><td><b>1909</b> <td>Professor G H Bryan <td><i>Retiring address with no title </i>\n\n<tr><td><b>1910</b> <td>Professor H H Turner <td><i>Mathematics and \'general education\' </i>\n\n<tr><td><b>1911</b> <td>Professor H H Turner <td><i>The outer satellites of Saturn and Jupiter </i>\n\n<tr><td><b>1912</b> <td>Professor <m>E W Hobson</m> <td><i>The democratization of mathematical education </i>\n\n<tr><td><b>1913</b> <td>Professor <m>E W Hobson</m> <td><i>On geometrical constructions by means of the compass </i>\n\n<tr><td><b>1914</b> <td>Mr <m>A G Greenhill</m> <td><i>The use of mathematics </i>\n\n<tr><td><b>1915</b> <td>Mr <m>A G Greenhill</m> <td><i>Mathematics in artillery science </i>\n\n<tr><td><b>1916</b> <td>Professor <m>A N Whitehead</m> <td><i>The aims of education - a plea for reform </i>\n\n<tr><td><b>1917</b> <td>Professor <m>A N Whitehead</m> <td><i>Technical education and its relation to science and literature </i>\n\n<tr><td><b>1918</b> <td>Professor T P Nunn <td><i>Mathematics and individuality </i>\n\n<tr><td><b>1919</b> <td>Professor T P Nunn <td><i>Astronomy as a school subject </i>\n\n<tr><td><b>1920</b> <td>Professor <m>E T Whittaker</m> <td><i>Some mathematical problems awaiting solution </i>\n\n<tr><td><b>1920</b> <td>Professor <m>E T Whittaker</m> <td>No address\n\n<tr><td><b>1921</b> <td>Rev Canon J M Wilson <td><i>The early history of the Association, or, the passing of Euclid from our schools and universities. And how it came about. A story of fifty years ago </i>\n\n<tr><td><b>1922</b> <td>Rev Canon J M Wilson <td>No address\n\n<tr><td><b>1923</b> <td>Sir <m>Thomas L Heath</m> <td><i>Greek geometry with special reference to infinitesimals </i>\n\n<tr><td><b>1924</b> <td>Sir <m>Thomas L Heath</m> <td>No address\n\n<tr><td><b>1925</b> <td>Professor <m>G H Hardy</m> <td><i>What is geometry? </i>\n\n<tr><td><b>1926</b> <td>Professor <m>G H Hardy</m> <td><i>The case against the mathematical tripos </i>\n\n<tr><td><b>1927</b> <td>Professor M J M Hill <td><i>On the teaching of mathematics </i>\n\n<tr><td><b>1928</b> <td>Professor M J M Hill <td><i>The logical eye and the mathematical eye </i>\n\n<tr><td><b>1929</b> <td>Dr <m>W F Sheppard</m> <td><i>Variety of method in the teaching of arithmetic </i>\n\n<tr><td><b>1930</b> <td>Dr <m>W F Sheppard</m> <td><i>Mathematics for the study of frequency statistics </i>\n\n<tr><td><b>1931</b> <td>Prof Sir <m>A S Eddington</m> <td><i>The end of the world from the standpoint of mathematical physics </i>\n\n<tr><td><b>1932</b> <td>Prof Sir <m>A S Eddington</m> <td><i>The decline of determinism </i>\n\n<tr><td><b>1933</b> <td>Professor <m>G N Watson</m> <td><i>The marquis and the land agent </i>\n\n<tr><td><b>1934</b> <td>Professor <m>G N Watson</m> <td><i>Scraps from some mathematical notebooks </i>\n\n<tr><td><b>1935</b> <td>Professor <m>E H Neville</m> <td><i>The food of the gods </i>\n\n<tr><td><b>1936</b> <td>Mr A W Siddons <td><i>Progress </i>\n\n<tr><td><b>1937</b> <td>Professor <m>A R Forsyth</m> <td><i>Applied mathematics in school training </i>\n\n<tr><td><b>1938</b> <td>Professor L N G Filon <td><i>Mass and force in Newtonian mechanics. </i><br>[Read by Professor <m>G B Jeffery</m>] \n\n<tr><td><b>1939</b> <td>Mr W Hope-Jones <td><i>Simplicity and the truthfulness in arithmetic </i>\n\n<tr><td><b>1944</b> <td>Mr W C Fletcher <td>No address\n\n<tr><td><b>1945</b> <td>Mr C O Tuckey <td><i>Teachers and examiners </i>\n\n<tr><td><b>1946</b> <td>Professor <m>S Chapman</m> <td><i>University training of mathematicians </i>\n\n<tr><td><b>1947</b> <td>Mr W F Bushell <td><i>A century of school mathematics </i>\n\n<tr><td><b>1948</b> <td>Professor <m>G B Jeffery</m> <td><i>Mathematics as an educational experience </i>\n\n<tr><td><b>1949</b> <td>Sir Harold Spencer Jones <td><i>The measurement of time </i>(given January 1950) \n\n<tr><td><b>1950</b> <td>Mr A Robson <td><i>How they learnt </i>1600 - 1850 (given April 1949) \n\n<tr><td><b>1951</b> <td>Professor H R Hassé <td><i>My fifty years of mathematics </i>\n\n<tr><td><b>1952</b> <td>Dr <m>M L Cartwright</m> <td><i>Non-linear vibrations: a chapter in mathematical history </i>\n\n<tr><td><b>1953</b> <td>Mr K S Snell <td><i>School mathematics today and tomorrow </i>\n\n<tr><td><b>1954</b> <td>Prof <m>T A A Broadbent</m> <td><i>Printer\'s ink and the teacher </i>\n\n<tr><td><b>1955</b> <td>Professor <m>W V D Hodge</m> <td><i>Changing views of geometry </i>\n\n<tr><td><b>1956</b> <td>Mr G L Parsons <td><i>"Teaching the teacher" </i>\n\n<tr><td><b>1957</b> <td>Professor <m>G F J Temple</m> <td><i>The growth of mathematics </i>\n\n<tr><td><b>1958</b> <td>Mr W J Langford <td><i>Secondary school mathematics: an international survey </i>\n\n<tr><td><b>1959</b> <td>Prof <m>M H A Newman</m> <td><i>What is mathematics? New answers to an old question </i>\n\n<tr><td><b>1960</b> <td>Miss L D Adams <td><i>Full cycle </i>\n\n<tr><td><b>1961</b> <td>Dr E A Maxwell <td><i>Pastors and masters </i>\n\n<tr><td><b>1962</b> <td>Mr J T Combridge <td><i>Mathematics - slave, servant or sovereign? </i>\n\n<tr><td><b>1963</b> <td>Professor V C A Ferraro <td><i>The scientific exploration of outer space since the time of Galileo </i>\n\n<tr><td><b>1964</b> <td>Mr J B Morgan <td><i>The thirteenth grade </i>\n\n<tr><td><b>1965</b> <td>Dr <m>I W Busbridge</m> <td><i>Robbins - and all that </i>\n\n<tr><td><b>1966</b> <td>Mrs E M Williams <td><i>The changing role of mathematics in education </i>\n\n<tr><td><b>1967</b> <td>Mr F W Kellaway <td><i>The teacher of mathematics and society </i>\n\n<tr><td><b>1968</b> <td>Mr A P Rollett <td><i>Class consciousness </i>\n\n<tr><td><b>1969</b> <td>Professor <m>C A Coulson</m> <td><i>On liking mathematics </i>\n\n<tr><td><b>1970</b> <td>Lady <m Jeffreys_Bertha >Bertha Jeffreys</m> <td><i>An easy commerce of the old and the new </i>\n\n<tr><td><b>1971</b> <td>Professor <m>M J Lighthill</m> <td><i>The art of teaching the art of applying mathematics </i>\n\n<tr><td><b>1972</b> <td>Mr B T Bellis <td><i>Whatever next? </i>\n\n<tr><td><b>1973</b> <td>Mr C T Daltry <td><i>Difficulties - a voice from the past </i>\n\n<tr><td><b>1974</b> <td>Professor <m>W H McCrea</m> <td><i>Natural philosophy </i>\n\n<tr><td><b>1975</b> <td>Mrs M Hayman <td><i>To each according to his needs </i>\n\n<tr><td><b>1975</b> <td>Professor <m>R L Goodstein</m> <td><i>Inauguration of the New Headquarters </i>\n\n<tr><td><b>1976</b> <td>Professor <m>R L Goodstein</m> <td><i>Arithmetic without sets [Read by Dr E A Maxwell] </i>\n\n<tr><td><b>1977</b> <td>Dr E Kerr <td><i>Some thoughts on the educational system and mathematics teaching </i>\n\n<tr><td><b>1978</b> <td>Professor G Matthews <td><i>Sausages and bananas </i>\n\n<tr><td><b>1979</b> <td>Mr A R Tammadge <td><i>Creativity </i>\n\n<tr><td><b>1980</b> <td>Professor C W Kilmister <td><i>Zeno, Aristotle, Weyl and Shuard: two-and-a-half millennia of worries over number </i>\n\n<tr><td><b>1981</b> <td>Mr D A Quadling <td><i>Pressures and priorities </i>\n\n<tr><td><b>1982</b> <td>Professor <m>M F Atiyah</m> <td><i>What is geometry? </i>\n\n<tr><td><b>1983</b> <td>Mr F J Budden <td><i>Accuracy is a virtue </i>\n\n<tr><td><b>1984</b> <td>Prof R L Schwarzenberger <td><i>The importance of mistakes </i>\n\n<tr><td><b>1985</b> <td>Mr P B Coaker <td><i>Why teach mathematics? </i>\n\n<tr><td><b>1986</b> <td>Miss H B Shuard <td><i>Primary mathematics: towards </i>2000 \n\n<tr><td><b>1987</b> <td>Mrs A Straker <td><i>The challenge to change </i>\n\n<tr><td><b>1988</b> <td>Dr M E Rayner <td><i>On examinations </i>\n\n<tr><td><b>1989</b> <td>Professor A G Howson <td><i>New challenges </i>\n\n<tr><td><b>1990</b> <td>Mr P Reynolds <td><i>Full circle </i>\n\n<tr><td><b>1991</b> <td>Professor M L Brown <td><i>The second iteration </i>\n\n<tr><td><b>1992</b> <td>Dr A J Bishop <td><i>Visions, mechanisms and professionals </i>\n\n<tr><td><b>1993</b> <td>Mr J Hersee <td><i>AIMS </i>\n\n<tr><td><b>1994</b> <td>Dr W Wynne Wilson <td><i>Five types of ambiguity </i>\n\n<tr><td><b>1995</b> <td>Dr M Bradburn <td><i>The borders of mathematics and natural philosophy </i>\n\n<tr><td><b>1996</b> <td>Mr E R Ashley <td><i>From a still point on a turning world </i>\n\n<tr><td><b>1997</b> <td>Mr W P Richardson <td><i>Why are we here? </i>\n\n<tr><td><b>1998</b> <td>Dr A D Gardiner <td><i>The art of knowing </i>\n\n<tr><td><b>1999</b> <td>Professor J C Robson <td><i>Something interesting! </i>\n\n<tr><td><b>2000</b> <td>Professor J S Berry <td><i>Developing the mathematical feel </i>\n\n<tr><td><b>2001</b> <td>Mr S Abbott <td><i>Rank and file: vision and visualisations </i>\n\n<tr><td><b>2002</b> <td>Dr S Sanders <td><i>Tales from the mathematical classroom </i>\n\n<tr><td><b>2003</b> <td>Mr B Lewis <td><i>Taking perspective </i>\n\n<tr><td><b>2004</b> <td>Prof Sir <m>E C Zeeman</m> <td><i>Three-dimensional theorems for schools </i>\n\n<tr><td><b>2005</b> <td>Professor A McBride <td><i>Mathematics: The greatest subject in the world </i>\n\n<tr><td><b>2006</b> <td>Mrs S Singer <td><i>Sailing through mathematics </i>\n\n<tr><td><b>2007</b> <td>Mr D French <td><i>Simplicity and surprise in school mathematics </i>\n\n<tr><td><b>2008</b> <td>Mr R Eastaway <td><i>Joined up mathematics </i>\n\n<tr><td><b>2009</b> <td>Mr R Barbour <td><i>A manifesto for mathematics </i>\n\n<tr><td><b>2010</b> <td>Mrs J Imrie <td><i>Progressing through mathematics </i>\n\n<tr><td><b>2011</b> <td>Dr D Acheson <td><i>What\'s the problem with maths? </i>\n\n<tr><td><b>2012</b> <td>Dr P Andrews <td><i>Learning from others: Can PISA and TIMSS really inform curriculum developments in mathematics? </i>\n\n<tr><td><b>2013</b> <td>Professor M du Sautoy <td><i>Teaching the Shakespeare of mathematics </i>\n\n<tr><td><b>2014</b> <td>Mr P Ransom <td><i>Triumphs and tribulations in teaching </i>\n\n<tr><td><b>2015</b> <td>Mrs L McClure <td><i>Looking backward, looking forward </i>\n\n<tr><td><b>2016</b> <td>Dr P M Neumann <td><i>Inspiring teachers </i>\n\n<tr><td><b>2017</b> <td>Dr J Golding <td><i>Is it mathematics or is it school mathematics? </i>\n\n<tr><td><b>2018</b> <td>Mr T Roper <td><i>Adventures in shape and space <td><i>\n</table>'
print(render(source, None))
