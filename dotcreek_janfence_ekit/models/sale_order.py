from odoo import fields, models, api


class SaleOrder(models.Model):
    _inherit = "sale.order"

    @api.onchange('st_form')
    def _onchange_st_form(self):
        if not self.st_form:
            self.st_note = ""
            self.st_amount = 0

    @api.onchange('st124_form')
    def _onchange_st124_form(self):
        if not self.st_form:
            self.st124_note = ""

    @api.onchange('amount_total','st_form')
    def _onchange_st_amount(self):
        if self.st_form:
            if self.st_amount<=0:
                self.st_amount = self.amount_total

    st_note = fields.Text("Nature of Contract")
    st_amount = fields.Monetary("Amount of Contract")
    st124_note = fields.Text("Capital Improvement to be performed")

    st_form = fields.Boolean("ST8 Form")
    st124_form = fields.Boolean("ST124 Form")
    release_form = fields.Boolean("Realease Form")
    credit_card_form = fields.Boolean("Credit Card Form")
    drawing_id = fields.Many2many('dotcreek_drawaing_fance.drawing','sale_drawing', 'sale_id', 'drawing_id', 'Drawing')
    approximate_start_date = fields.Char('Approximate Start Date')
    approximate_end_date = fields.Char('Approximate End Date')
    change_order = fields.Boolean("Change Order")
    damage_order = fields.Boolean("Damage Order")
    pdft_name = fields.Char('Pdf Name')

    relate_sale_order = fields.Many2one('sale.order',
                                         string='Related Job Proposal')

    opportunity_id = fields.Many2one(
        'crm.lead', string='Opportunity', check_company=True,
        domain="[('active','=',True),('partner_id','=',partner_id),('type', '=', 'opportunity'), '|', ('company_id', '=', False), ('company_id', '=', company_id)]")

    @api.onchange('sale_order_template_id')
    def onchange_change_order(self):
        self.change_order = self.sale_order_template_id.id == self.env.ref('dotcreek_janfence_ekit.sale_order_template_cahnge_order').id
        self.damage_order = self.sale_order_template_id.id == self.env.ref(
            'dotcreek_janfence_ekit.sale_order_template_damage_order').id


    @api.onchange('name','change_order','damage_order')
    def onchange_name_order(self):
        self.pdft_name='Job Proposal - %s' % (self.name)
        if self.change_order:
            self.pdft_name = 'Change Order - %s' % (self.name)
        if self.damage_order:
            self.pdft_name = 'Damage Form - %s' % (self.name)

    @api.model
    def create(self, values):
        user = super(SaleOrder, self).create(values)
        user.pdft_name = 'Job Proposal - %s' % (user.name)
        if user.change_order:
            user.pdft_name = 'Change Order - %s' % (user.name)
        if user.damage_order:
            user.pdft_name = 'Damage Form - %s' % (user.name)
        return user

    def write(self, vals):
        vals.update({
            'pdft_name':'Job Proposal - %s' % (self.name)
        })
        if self.change_order:
            vals.update({
                'pdft_name': 'Change Order - %s' % (self.name)
            })
        if self.damage_order:
            vals.update({
                'pdft_name': 'Damage Form - %s' % (self.name)
            })
        result = super(SaleOrder, self).write(vals)
        return result

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