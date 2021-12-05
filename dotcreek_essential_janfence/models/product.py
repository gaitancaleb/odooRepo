import logging
import re

from odoo import api, fields, models, tools, _
from odoo.exceptions import UserError, ValidationError
from odoo.osv import expression


class Product(models.Model):
    _inherit = "product.template"

    def set_prod_mand(self):
        for item in self.env['product.template'].search([('id','>',47637),('id','<',54139),]):
            item.write({'route_ids':[(6, 0, [5])]})
