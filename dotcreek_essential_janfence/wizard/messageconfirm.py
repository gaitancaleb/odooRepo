import base64
import os
import io
import pandas as pd
import datetime
import re

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError

class MessageWizard(models.TransientModel):
    _name = 'message.wizard'
    _description = "Message Wizard"

    message = fields.Text('Message', required=True, readonly=True)

    def action_ok(self):
        """ close wizard"""
        return {
            'name': _('Product Variants'),
            'type': 'ir.actions.act_window',
            'view_mode': 'tree',
            'res_model': 'product.product',
            'target': 'self'
        }