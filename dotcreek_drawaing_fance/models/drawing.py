from odoo import fields, models, api


class Drawing(models.Model):
    _name = "dotcreek_drawaing_fance.drawing"

    drawing\
        = fields.Binary('Drawing', default=False)
    name = fields.Char('Name')
    lead_id = fields.Many2one('crm.lead',string='Lead')

    _sql_constraints = [
        ('drawing_name_uniq', 'unique(name,lead_id)', "A name have to be unique!"),
    ]

    def go_to_drawing(self):
        self.write({
            "lead_id":self.env.context["lead_id"]
        })
        if self.drawing:
            return {
                'type': 'ir.actions.act_url',
                'url': '/specification?id=%s&name=%s' % (self.id, self.name),
                'target': 'self',
            }
        else:
            return{
                'type': 'ir.actions.act_url',
                'url': '/specification?id=%s&name=%s' % (self.id,self.name),
                'target': 'self',
            }