from odoo import fields, models, api


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
            dom.append(('categ_id', 'in', categ_id))
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
