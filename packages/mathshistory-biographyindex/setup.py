import ast
import io
import re

from setuptools import setup, find_packages

with io.open('README.md', 'rt', encoding="utf8") as f:
    readme = f.read()

_description_re = re.compile(r'description\s+=\s+(?P<description>.*)')

with open('lektor_mathshistory_biographyindex.py', 'rb') as f:
    description = str(ast.literal_eval(_description_re.search(
        f.read().decode('utf-8')).group(1)))

setup(
    author='David Ferguson',
    author_email='fergusondavid6@gmail.com',
    description=description,
    keywords='Lektor plugin maths history site',
    license='MIT',
    long_description=readme,
    long_description_content_type='text/markdown',
    name='lektor-mathshistory-biographyindex',
    packages=find_packages(),
    py_modules=['lektor_mathshistory_biographyindex'],
    url='https://github.com/mathshistory/mathshistory-biographyindex',
    version='1.0.2',
    classifiers=[
        'Framework :: Lektor',
        'Environment :: Plugins',
    ],
    entry_points={
        'lektor.plugins': [
            'mathshistory-biographyindex = lektor_mathshistory_biographyindex:MathshistoryBiographyindexPlugin',
        ]
    }
)
