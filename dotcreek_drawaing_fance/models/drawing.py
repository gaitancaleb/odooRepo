from odoo import fields, models, api


class Drawing(models.Model):
    _name = "dotcreek_drawaing_fance.drawing"

    drawing\
        = fields.Char('Drawing', default=False)
    name = fields.Char('Name')
    lead_id = fields.Many2one('crm.lead',string='Lead')
    drawing_img \
        = fields.Binary('Drawing', default=False, readonly=True)

    _sql_constraints = [
        ('drawing_name_uniq', 'unique(name,lead_id)', "A name have to be unique!"),
    ]

    def duplicate_drawing(self):
        return self.duplicate_withnumber()

    def duplicate_withnumber(self,index=1):
        name = self.name + ' (copy ' + str(index) + ')'
        exist=self.env["dotcreek_drawaing_fance.drawing"].search([('name', '=', name),('lead_id','=',self.lead_id.id)])
        if exist:
            return self.duplicate_withnumber(index + 1)
        result=self.copy({'name': name})
        return {
            'type': 'ir.actions.act_window',
            'name': 'Drawing',
            'view_type': 'form',
            'view_mode': 'form',
            'res_model': self._name,
            'res_id': result.id,
            'target': 'new',
        }


    def go_to_drawing(self):
        if "lead_id" in self.env.context:
            self.write({
                "lead_id":self.env.context["lead_id"]
            })
        if self.drawing:
            return {
                'type': 'ir.actions.act_url',
                'url': '/specification?id=%s&name=%s&lead=%s' % (self.id, self.name,self.lead_id.id),
                'target': 'self',
            }
        else:
            return{
                'type': 'ir.actions.act_url',
                'url': '/specification?id=%s&name=%s&lead=%s' % (self.id,self.name,self.lead_id.id),
                'target': 'self',
            }