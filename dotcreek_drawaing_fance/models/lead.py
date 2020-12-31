from odoo import fields, models, api


class lead(models.Model):
    _inherit = "crm.lead"

    drawing_lines = fields.One2many('dotcreek_drawaing_fance.drawing', 'lead_id',
                                    string="Drawings", index=True)