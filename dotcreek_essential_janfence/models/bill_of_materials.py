from odoo import models
from odoo.tools.translate import _


class BOM(models.Model):
    _inherit = 'mrp.bom'

    def create_bom(self, sku,working_center,vals):
        product=self.env['product.product'].search([('default_code', '=', sku)])
        work_center = self.env['mrp.workcenter'].search([('name', '=', working_center)])
        lines=[]
        for item in vals:
            component = self.env['product.product'].search([('default_code', '=', item['sku_component'])])
            uom = self.env['uom.uom'].search([('name', '=', item['product_uom_id'])])
            lines.append((0, 0, {
                'product_id': component.id,
                'product_qty': item['product_qty'],
                'product_uom_id': uom.id,
            }))

        self.env['mrp.bom'].create({
            'product_tmpl_id':product.product_tmpl_id.id,
            'product_id':product.id,
            'bom_line_ids':lines,
            'operation_ids':[(0,0,{'name': working_center,
                                   'workcenter_id':work_center.id})]
        })
        return True