from odoo import fields, models, api


class lead(models.Model):
    _inherit = "crm.lead"

    partner_delivery_id = fields.Many2one(
        'res.partner', string='Site Address', index=True, tracking=10,
        domain="[('type','=','delivery'),'|', ('company_id', '=', False), ('company_id', '=', company_id)]",
        help="Linked delivery address for extra information.")

    @api.onchange('partner_id')
    def _onchange_partner_delivery_id(self):
        for item in self.partner_id.child_ids:
            if item.type=='delivery':
                self.partner_delivery_id=item

    @api.onchange('partner_delivery_id')
    def _onchange_partner_delivery_information(self):
        self.partner_name=self.partner_delivery_id.name
        self.street = self.partner_delivery_id.street
        self.street2 = self.partner_delivery_id.street2
        self.city = self.partner_delivery_id.city
        self.state_id = self.partner_delivery_id.state_id
        self.zip = self.partner_delivery_id.zip
        self.country_id = self.partner_delivery_id.country_id