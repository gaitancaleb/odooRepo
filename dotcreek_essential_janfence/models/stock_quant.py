import logging
import re

from odoo import api, fields, models, tools, _
from odoo.exceptions import UserError, ValidationError
from odoo.osv import expression


class Product(models.Model):
    _inherit = "stock.quant"

    def create_onhand(self,vals):
        return self.sudo().create(vals).id
