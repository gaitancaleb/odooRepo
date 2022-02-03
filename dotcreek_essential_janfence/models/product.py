import logging
import re

from odoo import api, fields, models, tools, _
from odoo.exceptions import UserError, ValidationError
from odoo.osv import expression


class Product(models.Model):
    _inherit = "product.template"

    def set_prod_mand(self):
        for bom in self.env['product.template'].search([]):
            bom.product_tmpl_id.write({'route_ids':[(6, 0, [5])]})
        return True
