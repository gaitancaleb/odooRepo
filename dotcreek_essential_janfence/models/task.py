from odoo import fields, models, api
from datetime import timedelta, datetime


class Task(models.Model):
    _inherit = "project.task"

    stage_id_name = fields.Char(related='stage_id.name', readonly=True)
    worksheet_template_id_name = fields.Char(related='worksheet_template_id.name', readonly=True)
    user_id = fields.Many2one('res.users',
                              string='Assigned to',domain=[('installers','=',True)],
                              default=lambda self: self.env.uid,
                              index=True, tracking=True)
    installer_id = fields.Many2one('res.users', string='Installer',
        index=True,domain=[('installers','=',True)],group_expand='_read_group_installer_id')

    sale_order_id = fields.Many2one(related='sale_line_id.order_id', readonly=True)

    def create_email_start(self):
        template = self.env.ref('dotcreek_essential_janfence.mail_template_data_send_report')
        res = template.sudo().send_mail(self.id, force_send=True)

    @api.model
    def _read_group_installer_id(self, users, domain, order):
        if self.env.context.get('fsm_mode'):
            recently_created_tasks = self.env['project.task'].search([
                ('create_date', '>', datetime.now() - timedelta(days=30)),
                ('is_fsm', '=', True),
                ('user_id', '!=', False)
            ])
            search_domain = ['|', '|', ('id', 'in', users.ids),
                             ('groups_id', 'in', self.env.ref('dotcreek_essential_janfence.group_field_server_installer').id),
                             ('id', 'in', recently_created_tasks.mapped('installer_id.id'))]
            return users.search(search_domain, order=order)
        return users

    @api.onchange('user_id')
    def onchange_user_installer(self):
        self.installer_id = self.user_id

    @api.model
    def action_your_task(self):
        action=False
        if self.env.user.has_group('dotcreek_essential_janfence.group_field_server_installer'):
            action = self.env["ir.actions.actions"]._for_xml_id("dotcreek_essential_janfence.project_task_action_fsm")
        else:
            if self.env.user.has_group('industry_fsm.group_fsm_user'):
                action = self.env["ir.actions.actions"]._for_xml_id("industry_fsm.project_task_action_fsm")
        return action

    @api.model
    def action_your_task_map(self):
        action=False
        if self.env.user.has_group('dotcreek_essential_janfence.group_field_server_installer'):
            action = self.env["ir.actions.actions"]._for_xml_id("dotcreek_essential_janfence.project_task_action_fsm_map")
        else:
            if self.env.user.has_group('industry_fsm.group_fsm_user'):
                action = self.env["ir.actions.actions"]._for_xml_id("industry_fsm.project_task_action_fsm_map")
        return action