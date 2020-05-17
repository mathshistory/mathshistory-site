# -*- coding: utf-8 -*-
from lektor.pluginsystem import Plugin
from lektor.types import Type
from lektor.types.flow import FlowType
from lektor.environment import PRIMARY_ALT

class ChooserType(FlowType):
    widget = 'chooser'

    def __init__(self, env, options):
        FlowType.__init__(self, env, options)
        flow_block = options.get('flow_block', None)
        self.flow_blocks = [flow_block] if flow_block else None
        self.key_field = options.get('key_field', False)
        self.select_width = options.get('select_width') or '1/6'

    def to_json(self, pad, record=None, alt=PRIMARY_ALT):
        rv = FlowType.to_json(self, pad, record, alt)
        rv['key_field'] = self.key_field
        rv['select_width'] = self.select_width
        return rv

class MathshistoryChooserPlugin(Plugin):
    name = 'mathshistory-chooser'
    description = u'Adds the chooser type required for the Maths History website.'

    def on_setup_env(self, **extra):
        self.env.add_type(ChooserType)
