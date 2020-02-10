# mathshistory-xrefs

Automatically generates the cross-references for biographies.

On each biography, we want to show a list of the other pages on the site that
link to that biography. Currently, we are showing cross-references from the
following sections:
- history topics
- famous curves
- honours
- projects
- societies
- 'page's

This plugin is a rather big hack. We can't have each biography depending on
every other page in the site, because this would reduce the build time of them
to a crawl due to Lektor's slow dependency management.

Instead, what we do is have our own database of crossreferences. At the start of
each build, we go through all the changed pages of the type above, seeing if the
references to biographies has changed (been added to or removed from), and if
they have, then it adds the changed biographies to a list of ones that need to
be rebuilt.

Then, using the `before-build` event, it checks if the record is a biography
in the list of ones that needs to be rebuilt, and if it is, it marks it as dirty
so that the lektor build system will build it.

Using this same event, it then injects the cross-references into that record, so
it is available to the template. We do sort it, so it doesn't keep changing on
every build.

Then lastly, using the `after-build`, we check if the build was successful, and
if it was, we update the sqlite3 database so that it is kept up to date with the
cross references. We don't do this if the build fails, because we want the db to
keep in sync with the working site, not any errors.

---

We have the special `pad_get` function here, because we need to be able to get
records without adding them as dependencies.
