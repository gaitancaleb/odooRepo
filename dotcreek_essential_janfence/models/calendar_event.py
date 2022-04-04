from datetime import timedelta
import math
import babel.dates
import logging
import pytz

from odoo import models, fields, api
from odoo.tools.translate import _
from odoo import tools

class Meeting(models.Model):
    _inherit = 'calendar.event'

    # @api.onchange('user_id')
    # def onchange_user_event(self):
    #     self.partner_ids += self.user_id.partner_id
    #     if self.opportunity_id:
    #         res= False
    #         try:
    #             if not self.env['mail.followers'].search(
    #                     [('res_id', '=',self.opportunity_id.id),
    #                      ('res_model', '=', self.opportunity_id._name),
    #                      ('partner_id', '=', self.user_id.partner_id.id)]):
    #                 res =self.env['mail.followers'].create({
    #                     'res_model': self.opportunity_id._name,
    #                     'res_id': self.opportunity_id.id,
    #                     'partner_id': self.user_id.partner_id.id,
    #                 })
    #                 self.opportunity_id.message_follower_ids+=res
    #         except:
    #             pass

    @api.model
    def default_get(self, fields):
        # super default_model='crm.lead' for easier use in addons

        if self.env.context.get('default_res_model') and not self.env.context.get('default_res_model_id'):
            self = self.with_context(
                default_res_model_id=self.env['ir.model'].sudo().search([
                    ('model', '=', self.env.context['default_res_model'])
                ], limit=1).id
            )

        defaults = super(Meeting, self).default_get(fields)

        # support active_model / active_id as replacement of default_* if not already given
        if 'res_model_id' not in defaults and 'res_model_id' in fields and \
                self.env.context.get('active_model') and self.env.context['active_model'] != 'calendar.event':
            defaults['res_model_id'] = self.env['ir.model'].sudo().search(
                [('model', '=', self.env.context['active_model'])], limit=1).id
        if 'res_id' not in defaults and 'res_id' in fields and \
                defaults.get('res_model_id') and self.env.context.get('active_id'):
            defaults['res_id'] = self.env.context['active_id']
        if 'duration' in defaults.keys():
            defaults['duration']=1
            self.duration = 1
        return defaults

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

class MailActivity(models.Model):
    _inherit = "mail.activity"

    def action_create_calendar_event(self):
        self.ensure_one()
        action = self.env["ir.actions.actions"]._for_xml_id("calendar.action_calendar_event")
        model= self.env[self.res_model].browse(self.res_id) if self.res_model=='crm.lead' else False
        addres=False
        if self.res_model=='crm.lead':
            addres= model.street+ (','+model.city if model.city else '')+ (','+model.state_id.name if model.state_id.name else '')
        action['context'] = {
            'default_activity_type_id': self.activity_type_id.id,
            'default_res_id': self.env.context.get('default_res_id'),
            'default_res_model': self.env.context.get('default_res_model'),
            'default_name': self.summary or self.res_name,
            'default_duration': 1,
            'duration': 1,
            'default_location': addres or False,
            'default_description': self.note and tools.html2plaintext(self.note).strip() or '',
            'default_activity_ids': [(6, 0, self.ids)],
        }
        return action
