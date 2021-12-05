import logging
import re

from odoo import api, fields, models, tools, _
from odoo.exceptions import UserError, ValidationError
from odoo.osv import expression


class Product(models.Model):
    _inherit = "stock.quant"

    def create_onhand(self,vals):
        res = self.sudo().create(vals)
        return res.id

    def delete_onhand(self,vals):
        res = self.search([('product_id','in',vals)]).sudo().unlink()
        return res
