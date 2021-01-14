from odoo import fields, models, api


class SaleOrder(models.Model):
    _inherit = "sale.order"

    drawing_id = fields.Many2one('dotcreek_drawaing_fance.drawing',string='Drawing')
