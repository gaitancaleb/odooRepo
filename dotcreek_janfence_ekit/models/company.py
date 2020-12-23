from odoo import fields, models


class Company(models.Model):
    _inherit = "res.company"

    licence_id_one = fields.Char("State Licence or Certifcate #1", size=50)
    licence_id_two = fields.Char("State Licence or Certifcate #2", size=50)
    licence_id_three = fields.Char("State Licence or Certifcate #3", size=50)
    licence_id_four = fields.Char("State Licence or Certifcate #4", size=50)