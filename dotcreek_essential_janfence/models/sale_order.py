from odoo import fields, models, api

class Sale(models.Model):
    _inherit = "sale.order"

    def _compute_sale_order(self):
        for item in self:
            count=0
            for line in item.order_line:
                if line.product_id:
                    if line.product_id.categ_id:
                        if 'POST' in line.product_id.categ_id.name:
                            count += 1
            item.count_post=count

    count_post = fields.Integer('POST',compute='_compute_sale_order', readonly=False, required=True)

    @api.onchange('order_line')
    def onchange_user_installer(self):
        for item in self:
            count = 0
            for line in item.order_line:
                if line.product_id:
                    if line.product_id.categ_id:
                        if 'POST' in line.product_id.categ_id.name:
                            count += 1
            item.count_post = count

class SaleOrder(models.Model):
    _inherit = "sale.order.line"

    @api.onchange('product_template_id','product_id')
    def onchange_pricelist_id_domain(self):
        product_ids = []
        categ_id = []
        for items in self.order_id.pricelist_id.item_ids:
            if items.product_id:
                # mount = self.order_id.pricelist_id.get_product_price(items.product_id.product_tmpl_id, 1,
                #                                                      self.order_id.partner_id,
                #                                                      uom_id=items.product_id.product_tmpl_id.uom_id.id)
                # if mount > 0:
                product_ids.append(items.product_id.product_tmpl_id.id)
            if items.product_tmpl_id:
                # mount = self.order_id.pricelist_id.get_product_price(items.product_tmpl_id, 1, self.order_id.partner_id,
                #                                                      uom_id=items.product_tmpl_id.uom_id.id)
                # if mount > 0:
                product_ids.append(items.product_tmpl_id.id)
            if items.categ_id:
                categ_id.append(items.categ_id.id)
        res = {}
        dom = []
        if len(categ_id) > 0:
            dom.append('|')
            dom.append(('categ_id', 'child_of', categ_id))
        dom.append(('id', 'in', product_ids))
        res['domain'] = {'product_template_id': dom}
        return res

    @api.depends('product_template_id','product_id')
    def onchange_pricelist_id_real_domain(self):
        product_ids = []
        categ_id = []
        for items in self.order_id.pricelist_id.item_ids:
            if items.product_id:
                # mount = self.order_id.pricelist_id.get_product_price(items.product_id.product_tmpl_id, 1,
                #                                                      self.order_id.partner_id,
                #                                                      uom_id=items.product_id.product_tmpl_id.uom_id.id)
                # if mount > 0:
                product_ids.append(items.product_id.product_tmpl_id.id)
            if items.product_tmpl_id:
                # mount = self.order_id.pricelist_id.get_product_price(items.product_tmpl_id, 1, self.order_id.partner_id,
                #                                                      uom_id=items.product_tmpl_id.uom_id.id)
                # if mount > 0:
                product_ids.append(items.product_tmpl_id.id)
            if items.categ_id:
                categ_id.append(items.categ_id.id)
        res = {}
        dom = []
        if len(categ_id) > 0:
            dom.append('|')
            dom.append(('categ_id', 'in', categ_id))
        dom.append(('id', 'in', product_ids))
        res['domain'] = {'product_template_id': dom}
        return res

