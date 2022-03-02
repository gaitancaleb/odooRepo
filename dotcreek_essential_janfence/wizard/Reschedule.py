# -*- coding: utf-8 -*-
# © 2018 TechAsERP
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
import base64
import os
import io
import pandas as pd
import datetime
import re

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class UpdateCost(models.TransientModel):
    _name = "dotcreek.reschedule"
    _description = "Reschedule"

    date = fields.Date('Date', required=False)
    days = fields.Integer('Days', required=False)

    option = fields.Selection([
        ('days', 'Increase # of days'),
        ('date', 'Set date'),
    ], string='Options', default='days')

    def update(self):
        task = self.env['project.task'].search([('id', '=', self._context.get('active_ids', []))])
        update=""
        if task:
            for item in task:
                if self.option == 'date':
                    if item.planned_date_end:
                        diff_day=item.planned_date_end - item.planned_date_begin
                        item.write({
                            'planned_date_end': (self.date + datetime.timedelta(days=(diff_day.days*-1))),
                        })
                    item.write({
                        'planned_date_begin':self.date
                    })

                else:
                    if item.planned_date_begin:
                        item.write({
                            'planned_date_begin': (item.planned_date_begin + datetime.timedelta(days=abs(self.days))),
                        })
                    if item.planned_date_end:
                        item.write({
                            'planned_date_end': (item.planned_date_end + datetime.timedelta(days=abs(self.days))),
                        })

        message_id = self.env['message.wizard'].create({'message': _("The update was finished successfully"), 'target':'industry_fsm.project_task_action_all_fsm'})
        return {
            'name': _('Successfull'),
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'message.wizard',
            # pass the id
            'res_id': message_id.id,
            'target': 'new'
        }