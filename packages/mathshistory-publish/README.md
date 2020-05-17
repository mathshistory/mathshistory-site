# mathshistory-publish

Adds custom publishers for the Maths History website.

Creates two custom publishers:
1. **Preview**: The internal-access-only preview/testing site.
2. **Production**: The live web server.

## Git
Both publishers first add/commit/push any changes in both the
`mathshistory-content` git repo, and then the `mathshistory-output` git repo.
This ensures that all changes are tracked in git, and the two repos are kept in
sync, which should happen as these publishers should be the only things
modifying the two repos.

The commit messages of these adds/commits/pushes are the same for both repos,
and consist of `autocommit: <random>` where `<random>` is a random 8 character
alphanumeric string. This should be used to match up the commits from each repo.

## Preview
The Preview publisher then `rsync`s the files to the preview web root on the
same machine. This uses a custom rsync command rather than lifting the existing
rsync publisher, because the existing rsync publisher does not (yet?) support
having an output path of a local directory.

It takes in the web root directory as the path, so should be used as follows:
```ini
name = Preview
target = mathshistorypreview:///srv/sitebuild/html/
enabled = yes
default = yes
```

## Production
The Production publisher lifts all the code from the existing rsync publisher.
It should be used as follows:
```ini
name = Production
target = mathshistoryproduction://username@server/path/to/folder
enabled = yes
default = no
```
