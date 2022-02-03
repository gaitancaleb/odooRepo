from odoo import fields, models, api


class User(models.Model):
    _inherit = "res.users"

    installers = fields.Boolean('Installer', default=False)

    def write(self, vals):
        res = super(User, self).write(vals)
        for user in self:
            if not user.installers== user.has_group('dotcreek_essential_janfence.group_field_server_installer'):
                user.installers= user.has_group('dotcreek_essential_janfence.group_field_server_installer')
        return res