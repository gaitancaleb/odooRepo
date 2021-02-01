from odoo import fields, models, api


class Task(models.Model):
    _inherit = "project.task"

    def create_email_start(self):
        template = self.env.ref('dotcreek_essential_janfence.mail_template_data_send_report')
        res = template.sudo().send_mail(self.id, force_send=True)

