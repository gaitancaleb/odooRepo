import ast
import datetime

from odoo import api, fields, models, _
from odoo.tools.safe_eval import safe_eval


class LeadTeam(models.Model):
    _inherit = "crm.team"

    @api.model
    def action_your_pipeline_installer(self):
        action = self.env["ir.actions.actions"]._for_xml_id("dotcreek_essential_janfence.crm_lead_action_pipeline")
        user_team_id = self.env.user.sale_team_id.id
        if user_team_id:
            # To ensure that the team is readable in multi company
            user_team_id = self.search([('id', '=', user_team_id)], limit=1).id
        else:
            user_team_id = self.search([], limit=1).id
            action['help'] = _("""<p class='o_view_nocontent_smiling_face'>Add new opportunities</p><p>
        Looks like you are not a member of a Sales Team. You should add yourself
        as a member of one of the Sales Team.
    </p>""")
            if user_team_id:
                action['help'] += "<p>As you don't belong to any Sales Team, Odoo opens the first one by default.</p>"

        action_context = safe_eval(action['context'], {'uid': self.env.uid})
        if user_team_id:
            action_context['default_team_id'] = user_team_id

        action['context'] = action_context
        return action

    @api.model
    def action_your_pipeline(self):
        if self.env.user.has_group('dotcreek_essential_janfence.group_sale_salesman_installer'):
            action = self.env["ir.actions.actions"]._for_xml_id("dotcreek_essential_janfence.crm_lead_action_pipeline")
        else:
            action = self.env["ir.actions.actions"]._for_xml_id("crm.crm_lead_action_pipeline")
        user_team_id = self.env.user.sale_team_id.id
        if user_team_id:
            # To ensure that the team is readable in multi company
            user_team_id = self.search([('id', '=', user_team_id)], limit=1).id
        else:
            user_team_id = self.search([], limit=1).id
            action['help'] = _("""<p class='o_view_nocontent_smiling_face'>Add new opportunities</p><p>
        Looks like you are not a member of a Sales Team. You should add yourself
        as a member of one of the Sales Team.
    </p>""")
            if user_team_id:
                action['help'] += "<p>As you don't belong to any Sales Team, Odoo opens the first one by default.</p>"

        action_context = safe_eval(action['context'], {'uid': self.env.uid})
        if user_team_id:
            action_context['default_team_id'] = user_team_id

        action['context'] = action_context
        return action