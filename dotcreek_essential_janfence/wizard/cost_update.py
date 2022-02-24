# -*- coding: utf-8 -*-
# © 2018 TechAsERP
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
import base64
import os
import io
import pandas as pd
import datetime
import re

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError


class UpdateCost(models.TransientModel):
    _name = "dotcreek.cost_updater"
    _description = "Update Cost"

    name_file = fields.Char('File')
    file = fields.Binary('File', attachment=True)

    def update(self):
        if self.file:
            # PATH_DIR = os.path.dirname(os.path.abspath(__file__))
            # with open(PATH_DIR.replace("wizard", "") + '/data/' + self.name_file, "wb+") as f:
            #     f.write(base64.decodestring(self.file))
            toread = io.BytesIO()
            toread.write(base64.b64decode(self.file))
            # df = pd.read_excel(PATH_DIR.replace("wizard", "") + '/data/' + self.name_file)
            df = pd.read_excel(toread)
            lines = df.to_dict('records')
            for line in lines:
                # vendor = False
                # if 'Vendor' in line.keys():
                #     vendor = self.env['res.partner'].search([('name', '=', line['Vendor'])])
                # if 'VENDOR' in line.keys():
                #     vendor = self.env['res.partner'].search([('name', '=', line['VENDOR'])])
                sku_value = line['SKU']
                if type(sku_value) is float:
                    sku_value = str(int(line['SKU']))
                else:
                    sku_value = str(line['SKU'])
                product = self.env['product.product'].search([('default_code', '=', sku_value)])
                if product:
                    product.write({
                        'standard_price': float(line['Cost'])
                    })
                # if vendor:
                #     sup_info = self.env['product.supplierinfo'].search([('product_id', '=', product.id),
                #                                                         ('name', '=', vendor.id),
                #                                                         ('company_id', '=',
                #                                                          self.env.user.company_id.id)])
                # if vendor:
                #     if sup_info:
                #         sup_info.write({
                #             "name": vendor.id,
                #             "price": line['Cost'],
                #             "product_id": product.id,
                #             "product_tmpl_id": product.product_tmpl_id.id
                #         })
                #     else:
                #         self.env['product.supplierinfo'].create(
                #             {
                #                 "name": vendor.id,
                #                 "price": line['Cost'],
                #                 "product_id": product.id,
                #                 "product_tmpl_id": product.product_tmpl_id.id
                #             }
                #         )
                for key in line.keys():
                    if key not in ('COST', 'VENDOR', 'Cost', 'Vendor', 'SKU'):
                        price_list = self.env['product.pricelist'].search([('name', '=', key)], limit=1)
                        if price_list:
                            item = self.env['product.pricelist.item'].search(
                                [('product_id', '=', product.id), ('pricelist_id', '=', price_list.id)], limit=1)
                            if item:
                                item.write({
                                    "applied_on": '0_product_variant',
                                    "compute_price": 'fixed',
                                    "fixed_price": line[key],
                                })
                            else:
                                item.create({
                                    "applied_on": '0_product_variant',
                                    "compute_price": 'fixed',
                                    "product_id": product.id,
                                    "fixed_price": line[key],
                                    "pricelist_id": price_list.id
                                })

            return {
                'type': 'ir.actions.client',
                'tag': 'reload',
            }

    def vendor_update(self):
        if self.file:
            toread = io.BytesIO()
            toread.write(base64.b64decode(self.file))
            df = pd.read_excel(toread)
            lines = df.to_dict('records')
            for line in lines:
                vendor=False
                if 'Vendor' in line.keys():
                    vendor = self.env['res.partner'].search([('name', '=', line['Vendor'])])
                if 'VENDOR' in line.keys():
                    vendor = self.env['res.partner'].search([('name', '=', line['VENDOR'])])
                sku_value=line['SKU']
                if type(sku_value) is float:
                    sku_value=str(int(line['SKU']))
                else:
                    sku_value = str(line['SKU'])
                product = self.env['product.product'].search([('default_code', '=', sku_value)])

                if vendor:
                    sup_info = self.env['product.supplierinfo'].search([('product_id', '=', product.id),
                                                                      ('name', '=', vendor.id),
                                                                        ('company_id','=',self.env.user.company_id.id)])
                if vendor:
                    if sup_info:
                        sup_info.write({
                            "name": vendor.id,
                                "price": line['Cost'],
                                "product_id": product.id,
                                "product_tmpl_id":product.product_tmpl_id.id
                        })
                    else:
                        self.env['product.supplierinfo'].create(
                            {
                                "name": vendor.id,
                                "price": line['Cost'],
                                "product_id": product.id,
                                "product_tmpl_id":product.product_tmpl_id.id
                            }
                        )
            return {
                'type': 'ir.actions.client',
                'tag': 'reload',
            }