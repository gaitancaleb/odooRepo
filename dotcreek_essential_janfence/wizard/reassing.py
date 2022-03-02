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
    _name = "dotcreek.reassign"
    _description = "Reassign"

    user_id = fields.Many2one('res.users',
                              string='Assigned to',domain=[('installers','=',True)],
                              required=True,
                              index=True, tracking=True)

    def update(self):
        task = self.env['project.task'].search([('id', '=', self._context.get('active_ids', []))])
        update=""
        if task:
            for item in task:
                item.write({
                    'user_id':self.user_id.id
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