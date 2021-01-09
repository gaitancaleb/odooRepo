from odoo import fields, models, api


class Product(models.Model):
    _inherit = "product.template"

    default_code = fields.Char(
        'SKU', compute='_compute_default_code',
        inverse='_set_default_code', store=True)

class ProductProduct(models.Model):
    _inherit = "product.product"

    default_code = fields.Char('SKU', index=True)

    height = fields.Integer('Height')
    opening = fields.Integer('Opening')

    _sql_constraints = [
        ('default_code', 'unique(default_code)', "A SKU can only be assigned to one product !"),
    ]

