# mathshistory-daily

Creates the Mathematician Of The Day pages for the Maths History site.

**Note: Requires a rebuild of the entire site if an existing mathematician's
birth/deathdate is modified**

---

This plugin is currently one big hack. It would be nice to use the standard
Lektor `pad.query(...).filter(F.birthdate == ...)` to discover the
mathematicians that were born/died on each day. However, if doing this, the
build process becomes unbearably slow. Upon investigation, it's not the query or
the filtering that takes up the time, it's actually adding all the biographies
as dependencies of each oftheday page that takes the time.

This may be able to be optimised by better indexing the database or similar,
further investigation is required for this.
