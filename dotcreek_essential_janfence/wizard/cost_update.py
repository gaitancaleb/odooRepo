# -*- coding: utf-8 -*-
# © 2018 TechAsERP
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
import base64
import os

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
            PATH_DIR = os.path.dirname(os.path.abspath(__file__))
            with open(PATH_DIR.replace("wizard", "") + '/data/' + self.name_file, "wb+") as f:
                f.write(base64.decodestring(self.file))
            df = pd.read_excel(PATH_DIR.replace("wizard", "") + '/data/' + self.name_file)
            lines = df.to_dict('records')
            for line in lines:
                vendor = self.env['res.partner'].search([('name', '=', line['Vendor'])])
                product = self.env['product.product'].search([('default_code', '=', line['SKU'])])
                if product:
                    product.write({
                        'standard_price':float(line['Cost'])
                    })
                sup_info = self.env['product.supplierinfo'].search([('product_id', '=', product.id),
                                                                  ('name', '=', vendor.id),])
                if sup_info:
                    sup_info.write({
                        'price':float(line['Cost'])
                    })
                else:
                    self.env['product.supplierinfo'].create(
                        {
                            "name": vendor.id,
                            "price": line['Cost'],
                            "product_id": product.id
                        }
                    )
            os.remove(PATH_DIR.replace("wizard", "") + '/data/' + self.name_file)