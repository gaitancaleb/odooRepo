from odoo import fields, models, api


class User(models.Model):
    _inherit = "res.users"

    installers = fields.Boolean('Installer', default=False)