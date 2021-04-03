# -*- coding: utf-8 -*-
from subprocess import PIPE, Popen
from markupsafe import Markup, escape
from weakref import ref as weakref
from werkzeug.urls import url_parse
import traceback
import html
import random
import string
import requests

from bs4 import BeautifulSoup
#import html5lib
import regex as re

from lektor._compat import PY2
from lektor.context import get_ctx
from lektor.pluginsystem import Plugin
from lektor.types import Type
from lektor.sourceobj import VirtualSourceObject

RENDERER_ERROR_PREFIX = 'Renderer error: '
KATEX_SERVER_URL = 'http://127.0.0.1:5002/'

# precompile the regex
CP_REGEX = re.compile(r'<cp>\s*(.*?)\s*</cp>', re.MULTILINE | re.DOTALL)
CPB_REGEX = re.compile(r'<cpb>\s*(.*?)\s*</cpb>', re.MULTILINE | re.DOTALL)
Q_REGEX = re.compile(r'<[Qq]>\s*(?P<quote>.*?)\s*</[Qq]>', re.MULTILINE | re.DOTALL)
K_REGEX = re.compile(r'<k>\s*(.*?)\s*</k>', re.MULTILINE | re.DOTALL)
IND_REGEX = re.compile(r'<ind>\s*(.*?)\s*</ind>', re.MULTILINE | re.DOTALL)
LATEX_REGEX = re.compile(r'<latex>\s*(?P<latex>.*?)\s*</latex>', re.MULTILINE | re.DOTALL)
SUPERSCRIPT_REGEX = re.compile(r'\^([^\s{}]+)', re.MULTILINE | re.DOTALL)
SUBSCRIPT_REGEX = re.compile(r'¬(\S+)', re.MULTILINE | re.DOTALL)
MLINK_REGEX = re.compile(r'<m(?:\s+(?P<name>.+?))?>(?P<text>.*?)\<\/m\>', re.MULTILINE | re.DOTALL)
GLINK_REGEX = re.compile(r'<g\s+(?P<glossary>.+?)>(?P<text>.*?)\<\/g\>', re.MULTILINE | re.DOTALL)
ACLINK_REGEX = re.compile(r'<ac\s+(?P<society>.+?)>(?P<text>.*?)\<\/ac\>', re.MULTILINE | re.DOTALL)
ELINK_REGEX = re.compile(r'<E (?P<number>\d+)>', re.MULTILINE | re.DOTALL)
FPLUS_REGEX = re.compile(r'<f\+>(.*?)</f>', re.MULTILINE | re.DOTALL)
FP_REGEX = re.compile(r'<fp>(.*?)</fp>', re.MULTILINE | re.DOTALL)
FPLUSPLUS_REGEX = re.compile(r'<f\+\+>(.*?)</f>', re.MULTILINE | re.DOTALL)
FMINUS_REGEX = re.compile(r'<f->(.*?)</f>', re.MULTILINE | re.DOTALL)
FM_REGEX = re.compile(r'<fm>(.*?)</fm>', re.MULTILINE | re.DOTALL)
DIAGRAM_REGEX = re.compile(r'<d\s+(?P<content>.+?)>', re.MULTILINE | re.DOTALL)
REF_REGEX = re.compile(r'\[(?P<number>\d+)\]', re.MULTILINE | re.DOTALL)
TRANS_REGEX = re.compile(r'<T (?P<number>\d+)>', re.MULTILINE | re.DOTALL)
BR_REGEX = re.compile(r'(?:<br\w?/?>\s*){3,}', re.MULTILINE | re.DOTALL)

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
            source = context.source if context is not None else self.__record
            if self.__html is None or self.__cached_for_ctx != context:
                self.__html = render(self.source, source)
                self.__cached_for_ctx = context
        except:
            print(RENDERER_ERROR_PREFIX)
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
    katexstorage = {}

    # convert html character references (ie. &#62;) to unicode
    source = html.unescape(source)
    # convert <cp>...</cp>
    source = re.sub(CP_REGEX, r'<div class="grey-block">\1</div>', source)
    # convert <cpb>...</cpb>
    source = re.sub(CPB_REGEX, r'<div class="blue-block">\1</div>', source)
    # convert <Q>...</Q>
    source = re.sub(Q_REGEX, r'<blockquote>\1</blockquote>', source)
    # convert <k>...</k>
    source = re.sub(K_REGEX, r'<div class="center-paragraph">\1</div>', source)
    # convert <ind>...</ind>
    source = re.sub(IND_REGEX, r'<div class="indent-paragraph">\1</div>', source)
    # convert latex to katex
    source = re.sub(LATEX_REGEX, lambda match: katexprerender(match, katexstorage), source)
    # convert ^superscript
    source = re.sub(SUPERSCRIPT_REGEX, r'<span class="superscript">\1</span>', source)
    # convert ¬subscript
    source = re.sub(SUBSCRIPT_REGEX, r'<span class="subscript">\1</span>', source)
    # convert <m>...</m> and <m name>...</m>
    source = re.sub(MLINK_REGEX, lambda match: mrender(match, record), source)
    # convert <g glossary>...</g>
    source = re.sub(GLINK_REGEX, lambda match: glrender(match, record), source)
    # convert <ac academy>...</ac>
    source = re.sub(ACLINK_REGEX, lambda match: societyrender(match, record), source)
    # convert <E num>
    source = re.sub(ELINK_REGEX, lambda match: extrarender(match, record), source)
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
    source = re.sub(FPLUS_REGEX, r'<span class="bigger">\1</span>', source)
    # convert <fp>...</fp>
    source = re.sub(FP_REGEX, r'<span class="bigger">\1</span>', source)
    # convert <f++>...</f++>
    source = re.sub(FPLUSPLUS_REGEX, r'<span class="bigger"><span class="bigger">\1</span></span>', source)
    # convert <f->...</f->
    source = re.sub(FMINUS_REGEX, r'<span class="smaller">\1</span>', source)
    # convert <fm>...</fm>
    source = re.sub(FM_REGEX, r'<span class="smaller">\1</span>', source)
    # convert <c>...</c>
    source = source.replace('<c>','<code>')
    source = source.replace('</c>','</code>')
    # convert <ovl>...</ovl>
    source = source.replace('<ovl>','<span class="overline">')
    source = source.replace('</ovl>','</span>')
    # convert <d ...>
    source = re.sub(DIAGRAM_REGEX, lambda match: drender(match, record), source)
    # convert [refnum]
    source = re.sub(REF_REGEX, lambda match: referencerender(match, record), source)
    #source = re.sub(regex, r'<span>[<a href="#reference-\1" class="reference reference-\1">\1</a>]</span>', source)
    # convert <T num>
    source = re.sub(TRANS_REGEX, lambda match: trender(match, record), source)


    # other from the htmlformat function in the stack

    # new (improved?) break-adder
    TAGS_MATCHER = r'</?((?:n)|(?:table)|(?:tr)|(?:td(\s+colspan="?\d"?)?)|(?:figure)|(?:p)|(?:br)|(?:li)|(?:ol)|(?:ul)|(?:div(\s+id))|(?:div(\s+class="indent-paragraph"?)?)|(?:div(\s+class="center-paragraph"?)?)|(?:script)|(?:input)|(?:button)|(?:br ?/?)|(?:p)|(?:blockquote)|(?:code)|(?:h\d)|(?:hr ?/?)|(?:area)|(?:map))>'
    regex = re.compile(r'(?<!%s)\s*?\n(?!\s*%s)' % (TAGS_MATCHER, TAGS_MATCHER), re.MULTILINE | re.DOTALL)
    source = re.sub(regex, '\n<br>\n', source)

    # never more than two <br>s together
    match = re.search(BR_REGEX, source)
    while match:
        source = re.sub(BR_REGEX, '<br>\n<br>', source)
        match = re.search(BR_REGEX, source)

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

    source = fix_italics(source, record)

    # put the katex formulas back in
    latex_array = list(katexstorage.values())
    html_array = katexrender(latex_array)
    for idx, key in enumerate(katexstorage.keys()):
        html_formula = html_array[idx]
        source = source.replace(key, html_formula)

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
    extra = get_flowblock(record, 'additional', number)
    if extra == False:
        return ''
    href = extra['link'].strip()
    href = correct_link(href, record)
    return '<a class="elink" href="%s" target="_blank">THIS LINK</a>' % href

def referencerender(match, record):
    number = match.group('number')
    reference = get_flowblock(record, 'references', number)
    if reference == False:
        return '[%s]' % number
    text = reference['reference'].__html__().unescape().strip()
    text = html.escape(text, quote=True)
    generated_html = '<span>[<a href="#reference-%s" class="reference" data-popup="%s">%s</a>]</span>' % (number, text, number)
    return generated_html

def trender(match, record):
    number = match.group('number')
    translation = get_flowblock(record, 'translations', number)
    if translation == False:
        return ''
    text = translation['translation'].__html__().unescape().strip()
    escaped_text = html.escape(text, quote=True)
    generated_html = '<span><a data-popup="%s" class="translation nonoscript non-italic">&#9417;</a><noscript>(%s)</noscript></span>' % (escaped_text, text)
    return generated_html

def get_flowblock(record, blockkey, number):
    # for a virtual source object, look in the parent's fields
    if issubclass(type(record), VirtualSourceObject):
        record = record.parent
    if blockkey not in record:
        print('%srecord %s does not have field %s' % (RENDERER_ERROR_PREFIX, record, blockkey))
        return False
    for block in record[blockkey].blocks:
        try:
            if int(block['number']) == int(number):
                return block
        except:
            print('%sexception when getting flow block number. Continuing anyway...' % RENDERER_ERROR_PREFIX)
            traceback.print_exc()
            continue
    print('%srecord %s does not have block type %s of number %s' % (RENDERER_ERROR_PREFIX, record, blockkey, number))
    return False

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


def katexprerender(match, storage):
    latex = match.group('latex')

    # save the formula to storage
    random_string = ''.join(random.choices(string.ascii_uppercase, k=10))
    storage[random_string] = latex

    return '<span class="math">%s</span>' % random_string


def katexrender(latex_array):
    # special case for empty array
    if len(latex_array) == 0:
        return []
    # try the server first
    try:
        return katexrender_server(latex_array)
    except:
        # if server error, use stdio
        print('katex-server failure, falling back to stdio')
        return katexrender_stdio(latex_array)


def katexrender_server(latex_array):
    r = requests.post(KATEX_SERVER_URL, json=latex_array)
    output_array = r.json()
    return output_array


def katexrender_stdio(latex_array):
    output_array = []
    for latex in latex_array:
        print(latex)
        p = Popen(STDIO_CMD, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        out, err = p.communicate(latex.encode('utf-8'))
        if p.returncode != 0:
            print('%skatex error: %s' % (RENDERER_ERROR_PREFIX, err))
            generated_html = '<span class="math-error">%s</span>' % latex
        else:
            generated_html = out.decode('utf-8')
        output_array.append(generated_html)
    return output_array


def correct_link(link, record):
    url = url_parse(link)
    if not url.scheme:
        # if you do it the markdown way, then it doesn't resolve virtual source paths
        # so we do it this way instead
        link = record.url_to(link)
    link = escape(link)
    return link

# hack function, goes through the entire document and fixes the italics
# this might be quite slow. but John likes non-italic numbers/brackets, so it has to stay for now
NON_ITALIC_PATTERN = re.compile(r'([\d\[\]\(\)]+)')
NON_ITALIC_DONT_MATCH_TAG = ('pre','code')
TAG_REPLACEMENTS = [('b', 'strong'), ('i', 'em')]
def fix_italics(x, record):
    try:
        s = BeautifulSoup(x, 'html5lib')

        # make numbers non-italic
        for text_node in list(s.strings):
            if re.search(NON_ITALIC_PATTERN, text_node.string):
                # check this isn't in a tag we are supposed to leave alone
                parent = text_node.parent
                dontApply = False
                while parent and parent.name != 'body':
                    if parent.name in NON_ITALIC_DONT_MATCH_TAG:
                        dontApply = True
                        break
                    parent = parent.parent
                if dontApply:
                    continue

                new_html = re.sub(NON_ITALIC_PATTERN, r'<span class="non-italic">\1</span>', text_node.string)
                new_soup = BeautifulSoup(new_html, 'html.parser')
                text_node.replace_with(new_soup)

        # fix the urls in images
        for img in s.find_all('img'):
            img['src'] = correct_link(img['src'], record)

        # fix the urls in links
        for link in s.find_all('a'):
            if link.has_attr('href') and link['href'].strip() != '':
                # convert /Biographies/ urls to mlinks
                href = link['href']
                if href.startswith('/Biographies/') and '#' not in href:
                    if (href.endswith('/') and href.count('/') == 3) or href.count('/') == 2:
                        name = href[13:]
                        if href.endswith('/'):
                            name = name[:-1]
                        mlink_html = mlink(name, link.text, record)
                        new_soup = BeautifulSoup(mlink_html, 'html.parser')
                        text_node.replace_with(new_soup)
                        continue

                # non-urls get standard conversion
                link['href'] = correct_link(link['href'], record)
        
        # replace <b> with <strong> and <i> with <em>
        for tag, new_tag in TAG_REPLACEMENTS:
            for node in s.find_all(tag, {}):
                node.name = new_tag

        # render it back to a string
        out = ''.join((str(child) for child in s.body.children))
        return out
    except:
        print('%sException thrown when fixing italics:' % RENDERER_ERROR_PREFIX)
        traceback.print_exc()
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
        text = text.replace(tag, unicode)

    return text
