from odoo import fields, models, api


class Task(models.Model):
    _inherit = "project.task"

    stage_id_name = fields.Char(related='stage_id.name', readonly=True)
    worksheet_template_id_name = fields.Char(related='worksheet_template_id.name', readonly=True)
    user_id = fields.Many2one('res.users',
                              string='Assigned to',domain=[('installers','=',True)],
                              default=lambda self: self.env.uid,
                              index=True, tracking=True)
    installer_id = fields.Many2one('res.users', string='Installer')

    def create_email_start(self):
        template = self.env.ref('dotcreek_essential_janfence.mail_template_data_send_report')
        res = template.sudo().send_mail(self.id, force_send=True)

    @api.onchange('user_id')
    def onchange_user_installer(self):
        self.installer_id = self.user_id