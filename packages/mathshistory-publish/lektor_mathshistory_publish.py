# -*- coding: utf-8 -*-
import random
import string

from lektor.pluginsystem import Plugin
from lektor.publisher import Publisher, RsyncPublisher, Command


GIT_SOURCE_DIRECTORY = '/home/mathshistory/mathshistory-site/content'


def random_string(n):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

def get_git_command(dir):
    return ['git', '-C', dir]

def yield_git_commands(dir, commit_message, author):
    # add all changes
    git_add = get_git_command(dir) + ['add', dir]
    add_command = Command(git_add, env={})
    with add_command:
        for line in add_command:
            yield line

    # commit the changes
    git_commit = get_git_command(dir) + ['commit', '--author="%s <>"' % author, '-m', commit_message]
    commit_command = Command(git_commit, env={})
    with commit_command:
        for line in commit_command:
            yield line

    # push the changes
    git_push = get_git_command(dir) + ['push']
    push_command = Command(git_push, env={})
    with push_command:
        for line in push_command:
            yield line


class MathshistoryPreviewPublisher(Publisher):

    def publish(self, target_url, credentials=None, **extra):
        build_out_directory = self.output_path.rstrip('/\\') + '/'
        deploy_target_directory = target_url.path.rstrip('/') + '/'        
        
        if (self.commit_message==None):
            self.commit_message = 'autocommit: %s' % random_string(8)

        if (self.author==None):
            self.author = 'Maths History'

        print("Commit message: %s" % self.commit_message)
        print("Author: %s" % self.author)

        # git add/commit/push the source repo
        for line in yield_git_commands(GIT_SOURCE_DIRECTORY, self.commit_message, self.author):
            print("preview publish: %s" % line)
            yield line

        # git add/commit/push the build output repo
        for line in yield_git_commands(build_out_directory, self.commit_message, self.author):
            print("preview publish: %s" % line)
            yield line

        # rsync it to the deploy target directory
        rsync = ['rsync', '-rclzv', '--exclude=.lektor', build_out_directory, deploy_target_directory]
        rsync_command = Command(rsync, env={})
        with rsync_command:
            for line in rsync_command:
                print("preview publish: %s" % line)
                yield line


class MathshistoryProductionPublisher(RsyncPublisher):
    def publish(self, target_url, credentials=None, **extra):
        build_out_directory = self.output_path.rstrip('/\\') + '/'
        deploy_target_directory = target_url.path.rstrip('/') + '/'        
        if (self.commit_message==None):
            self.commit_message = 'autocommit: %s' % random_string(8)

        if (self.author==None):
            self.author = 'Maths History'

        print("Commit message: %s" % self.commit_message)
        print("Author: %s" % self.author)

        # git add/commit/push the source repo
        for line in yield_git_commands(GIT_SOURCE_DIRECTORY, self.commit_message, self.author):
            print("production publish: %s" % line)
            yield line

        # git add/commit/push the build output repo
        for line in yield_git_commands(build_out_directory, self.commit_message, self.author):
            print("production publish: %s" % line)
            yield line

        # now run the rsync as normal
        for line in super().publish(target_url, credentials):
            print("production publish: %" % line)
            yield line


class MathshistoryPublishPlugin(Plugin):
    name = 'mathshistory-publish'
    description = u'Adds custom publishers for the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_publisher('mathshistorypreview', MathshistoryPreviewPublisher)
        self.env.add_publisher('mathshistoryproduction', MathshistoryProductionPublisher)
