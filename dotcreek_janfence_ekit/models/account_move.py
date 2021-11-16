from odoo import fields, models


class AccountMove(models.Model):
    _inherit = "account.move"

    delivery_state = fields.Many2one(related='partner_shipping_id.state_id',string='State', store=True)