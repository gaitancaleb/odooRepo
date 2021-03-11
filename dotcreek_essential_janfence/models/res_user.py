from odoo import fields, models, api


class User(models.Model):
    _inherit = "res.users"

    installers = fields.Boolean('Installer', default=False)

    def write(self, vals):
        res = super(User, self).write(vals)
        if not self.installers== self.has_group('dotcreek_essential_janfence.group_field_server_installer'):
            self.installers= self.has_group('dotcreek_essential_janfence.group_field_server_installer')
        return res