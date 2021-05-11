from odoo import fields, models


class Company(models.Model):
    _inherit = "res.company"

    def cost_change(self):
        products=self.env['product.product'].search([])
        for product in products:
            cost=product.with_context(allowed_company_ids=[1]).standard_price*1.11
            product.with_context(allowed_company_ids=[2]).standard_price=cost
            self.env['product.supplierinfo'].create({
                                                 "name": 1,
                                                 "price": cost,
                                                 'product_tmpl_id':product.product_tmpl_id.id,
                                                 "product_id": product.id
                                             })