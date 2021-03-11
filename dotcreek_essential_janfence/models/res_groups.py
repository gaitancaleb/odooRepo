from odoo import fields, models, api


class Group(models.Model):
    _inherit = "res.groups"

    @api.onchange('users')
    def onchange_user_installer(self):
        for user in self.users:
            user.installers = user.has_group('dotcreek_essential_janfence.group_field_server_installer')