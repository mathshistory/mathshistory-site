# mathshistory-biographyindex

Creates the alphabetical index pages for the biographies of the Maths History
website.

Biographies can be added to multiple index pages, by specifying multiple lines
in the field in the Lektor Admin GUI. Each line in the field represents an index
page, and will be normalized, and displayed.

Jump points can be created for both the alphabetical indexes, and the
chronological index. They are created by creating a config file
`mathshistory-biographyindex.ini` with a section for each index, containing a
list of the jump points. For example for the alphabetical index *a*:

```ini
[a]
jumps = ["al", "am", "ar"]
```

And for the chronological index:

```ini
[chronological]
jumps = [500, 1000, 1500, 1600 ... ]
```
