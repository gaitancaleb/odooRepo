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
    _name = "dotcreek.cost_average"
    _description = "Update Cost by Average"

    average = fields.Float(string='Average', digits=(3,2), required=True)

    def update(self):
        product = self.env['product.product'].search([('id', '=', self._context.get('active_ids', []))])
        update=""
        if product:
            for item in product:
                value = item.standard_price*(self.average/100)
                if (item.standard_price+value)>0:
                    item.write({
                        'standard_price':float(item.standard_price+value)
                    })
                else:
                    update+=(""+str(item.default_code)+" "+str(item.name)+"\n")
        if not update=="":
            message_id = self.env['message.wizard'].create({'message': _("The update was finished successfully with some exceptions:")+"\n"+update, 'target':'product.product_normal_action'})
        else:
            message_id = self.env['message.wizard'].create({'message': _("The update was finished successfully"), 'target':'product.product_normal_action'})
        return {
            'name': _('Successfull'),
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'message.wizard',
            # pass the id
            'res_id': message_id.id,
            'target': 'new'
        }