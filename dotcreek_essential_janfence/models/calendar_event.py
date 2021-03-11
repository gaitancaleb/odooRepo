from datetime import timedelta
import math
import babel.dates
import logging
import pytz

from odoo import models
from odoo.tools.translate import _


class Meeting(models.Model):
    _inherit = 'calendar.event'

    def read(self, fields=None, load='_classic_read'):
        def hide(field, value):
            """
            :param field: field name
            :param value: field value
            :return: obfuscated field value
            """
            if field in {'name', 'display_name'}:
                return _('Busy')
            return [] if isinstance(value, list) else False

        def split_privacy(events):
            """
            :param events: list of event values (dict)
            :return: tuple(private events, public events)
            """
            private = [event for event in events if event.get('privacy') == 'private']
            public = [event for event in events if event.get('privacy') != 'private']
            return private, public

        def my_events(events):
            """
            :param events: list of event values (dict)
            :return: tuple(my events, other events)
            """
            my = [event for event in events if event.get('user_id') and event.get('user_id')[0] == self.env.uid]
            others = [event for event in events if not event.get('user_id') or event.get('user_id')[0] != self.env.uid]
            return my, others

        def obfuscated(events):
            """
            :param events: list of event values (dict)
            :return: events with private field values obfuscated
            """
            public_fields = self._get_public_fields()
            return [{
                field: hide(field, value) if field not in public_fields else value
                for field, value in event.items()
            } for event in events]

        events = super().read(fields=fields + ['privacy', 'user_id'], load=load)
        event_aux = []
        if not self.env.user.has_group('dotcreek_essential_janfence.group_calendar_event_manager'):
            if self.env.user.has_group('dotcreek_essential_janfence.group_calendar_event_all'):
                for event in events:
                    group_id= self.env.ref('dotcreek_essential_janfence.group_calendar_event_all')
                    if event['user_id']:
                        if event['user_id'][0] in group_id.users._ids:
                            event_aux.append(event)
                events=event_aux
            else:
                for event in events:
                    if event['user_id']:
                        if event['user_id'][0] == self.env.user.id:
                            event_aux.append(event)
                events=event_aux

        private_events, public_events = split_privacy(events)
        my_private_events, others_private_events = my_events(private_events)

        return public_events + my_private_events + obfuscated(others_private_events)