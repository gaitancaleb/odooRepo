from odoo import fields, models, api


class SaleOrder(models.Model):
    _inherit = "sale.order"

    @api.onchange('st_form')
    def _onchange_digits(self):
        if not self.st_form:
            self.st_note=""
            self.st_amount=0

    st_note = fields.Text("Nature of Contract")
    st_amount = fields.Monetary("Amount of Contract")

    st_form = fields.Boolean("ST8 Form")
    release_form = fields.Boolean("Realease Form")
    credit_card_form = fields.Boolean("Credit Card Form")

    def action_quotation_send(self):
        ''' Opens a wizard to compose an email, with relevant mail template loaded by default '''
        self.ensure_one()
        template_id = self._find_mail_template()
        ids_sale_reports= []
        if self.credit_card_form:
            res_id = self.env.ref('dotcreek_janfence_ekit.action_report_saleorder_credit_card')
            ids_sale_reports.append(res_id.id)
        if self.st_form:
            res_id = self.env.ref('dotcreek_janfence_ekit.action_report_saleorder_form_st8')
            ids_sale_reports.append(res_id.id)
        if self.release_form:
            res_id = self.env.ref('dotcreek_janfence_ekit.action_report_saleorder_release_send_form')
            ids_sale_reports.append(res_id.id)

        lang = self.env.context.get('lang')
        template = self.env['mail.template'].browse(template_id)
        template.report_template_ids = [(6, 0, ids_sale_reports)]
        if template.lang:
            lang = template._render_lang(self.ids)[self.id]
        ctx = {
            'default_model': 'sale.order',
            'default_res_id': self.ids[0],
            'default_use_template': bool(template_id),
            'default_template_id': template_id,
            'default_composition_mode': 'comment',
            'mark_so_as_sent': True,
            'custom_layout': "mail.mail_notification_paynow",
            'proforma': self.env.context.get('proforma', False),
            'force_email': True,
            'model_description': self.with_context(lang=lang).type_name,
        }
        return {
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'mail.compose.message',
            'views': [(False, 'form')],
            'view_id': False,
            'target': 'new',
            'context': ctx,
        }