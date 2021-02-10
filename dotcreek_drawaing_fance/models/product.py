import logging
import re

from odoo import api, fields, models, tools, _
from odoo.exceptions import UserError, ValidationError
from odoo.osv import expression


class Product(models.Model):
    _inherit = "product.template"

    default_code = fields.Char(
        'SKU', compute='_compute_default_code',
        inverse='_set_default_code', store=True)
    height = fields.Char('Height')

class ProductProduct(models.Model):
    _inherit = "product.product"

    default_code = fields.Char('SKU', index=True)

    height = fields.Char('Height')
    opening = fields.Char('Opening')

    _sql_constraints = [
        ('default_code', 'unique(default_code)', "A SKU can only be assigned to one product !"),
    ]

    @api.model
    def _name_search(self, name, args=None, operator='ilike', limit=100, name_get_uid=None):
        if not args:
            args = []
        if name:
            positive_operators = ['=', 'ilike', '=ilike', 'like', '=like']
            product_ids = []
            if operator in positive_operators:
                product_ids = list(
                    self._search([('default_code', '=', name)] + args, limit=limit, access_rights_uid=name_get_uid))
                if not product_ids:
                    product_ids = list(
                        self._search([('barcode', '=', name)] + args, limit=limit, access_rights_uid=name_get_uid))
                    if not product_ids:
                        product_ids = list(
                            self._search([('height', '=', name)] + args, limit=limit, access_rights_uid=name_get_uid))
            if not product_ids and operator not in expression.NEGATIVE_TERM_OPERATORS:
                # Do not merge the 2 next lines into one single search, SQL search performance would be abysmal
                # on a database with thousands of matching products, due to the huge merge+unique needed for the
                # OR operator (and given the fact that the 'name' lookup results come from the ir.translation table
                # Performing a quick memory merge of ids in Python will give much better performance
                product_ids = list(self._search(args + [('default_code', operator, name)], limit=limit))
                if not limit or len(product_ids) < limit:
                    # we may underrun the limit because of dupes in the results, that's fine
                    limit2 = (limit - len(product_ids)) if limit else False
                    product2_ids = self._search(args + [('name', operator, name), ('id', 'not in', product_ids)],
                                                limit=limit2, access_rights_uid=name_get_uid)
                    product_ids.extend(product2_ids)
            elif not product_ids and operator in expression.NEGATIVE_TERM_OPERATORS:
                domain = expression.OR([
                    ['&', ('default_code', operator, name), ('name', operator, name)],
                    ['&', ('default_code', '=', False), ('name', operator, name)],
                ])
                domain = expression.AND([args, domain])
                product_ids = list(self._search(domain, limit=limit, access_rights_uid=name_get_uid))
            if not product_ids and operator in positive_operators:
                ptrn = re.compile('(\[(.*?)\])')
                res = ptrn.search(name)
                if res:
                    product_ids = list(self._search([('default_code', '=', res.group(2))] + args, limit=limit,
                                                    access_rights_uid=name_get_uid))
            # still no results, partner in context: search on supplier info as last hope to find something
            if not product_ids and self._context.get('partner_id'):
                suppliers_ids = self.env['product.supplierinfo']._search([
                    ('name', '=', self._context.get('partner_id')),
                    '|',
                    ('product_code', operator, name),
                    ('product_name', operator, name)], access_rights_uid=name_get_uid)
                if suppliers_ids:
                    product_ids = self._search([('product_tmpl_id.seller_ids', 'in', suppliers_ids)], limit=limit,
                                               access_rights_uid=name_get_uid)
        else:
            product_ids = self._search(args, limit=limit, access_rights_uid=name_get_uid)
        return product_ids

    def set_cetgories_foroptional(self):
        categ_ids = self.env['product.category'].search([('name', 'ilike','SECTIONS')])
        if categ_ids:
            templates_ids = self.env['product.product'].search([('categ_id', 'in', categ_ids._ids)])
            for template in templates_ids:
                if template.default_code=='73014375':
                    print(template.default_code)
                template.write({'optional_product_ids': [(5,)]})
                domain = []
                for domain_attr in template.product_template_attribute_value_ids:
                    domain.append(domain_attr.product_attribute_value_id.id)
                for optional in self.env['product.product'].search([('id', '!=', template.id),
                                                                   ('categ_id', 'not in', categ_ids._ids),
                                                                   ('height', '=', template.height)]):
                    is_chield=True

                    for attri_id in optional.product_template_attribute_value_ids:
                        if attri_id.product_attribute_value_id.id not in domain:
                            is_chield=False
                    if is_chield and optional.product_template_attribute_value_ids:
                        if optional.default_code:
                            print(optional.product_tmpl_id.id)
                            template.write({'optional_product_ids': [(4, optional.product_tmpl_id.id)]})

    def set_cetgories_foroptional_af_especial(self):
        categ_ids = self.env['product.category'].search([('name', 'ilike', 'AF SECTIONS')])
        if categ_ids:
            templates_ids = self.env['product.product'].search([('categ_id', 'in', categ_ids._ids)])
            for template in templates_ids:
                template.write({'optional_product_ids': [(5,)]})
                domain = []
                for domain_attr in template.product_template_attribute_value_ids:
                    domain.append(domain_attr.product_attribute_value_id.id)
                for optional in self.env['product.product'].search([('id', 'in', [73002220,73002221,73002222,73002223,73002255,73002256,73002257,73002258,73002265,73002266,73002267,73002268,73002380,73002383,73002385,73002387,73002396,73002398,
                                                                        73002400,73002402,73002404,73002406,73002408,73002410,73003517,73003520,73003524,73003525,73003526,73003527,73003593,73003594,73003595,73003596,73003597,73003598,73003957,73003958,73003959,
                                                                        73003960,73008706,73008707,73008708,73008709,73008710,73008711,73008712,73008713,73008714,73008715,73008716,73008717,73008718,73008719,73008720,73008721,73009098,73009099,
                                                                        73009100,73009101,73009102,73009103,73009104,73009105,73009107,73009108,73009109,73009110,73009111,73009112,73009113,73009114,73009115,73009116,73009117,73009118,73009119,73009120,73009121,
                                                                        73009122,73009123,73009124,73009125,73009126,73009127,73009128,73009129,73009130,73009131,
                                                                        73009132,73009133,73009134,73009135,73009136,73009137,73009138,73009142,73009143,73009144,73009145,73009146,73009147,73009148,73009149,73009150,73009151,73009152,73009153,73009154,
                                                                        73009155,73009156,73009157,73009158,73009159,73009160,73009161,73009162,73009163,73009164,73009165,73009166,73009167,73009168,73009169,73009170,73009171,73009172,73009173,73009174,73009175,73009176,73009177,73009178,73009179,73009180,73009181,73009232,73009233,73009234,73009235,73009240,73009241,73009242,73009243,73009244,
                                                                        73009245,73009246,73009247,73009248,73009249,73009250,73009251,73009252,73009253,73009254,73009255,73009257,73009258,73009259,73009260,73009265,73009266,73009267,73009268,73009269,73009270,73009271,73009272,
                                                                        73009273,73009274,73009275,73009276,73009277,73009278,73009279,73009280,73009283,73009284,73009285,73009286,73009287,73009288,73009289,73009290,73009291,73009292,73009293,73009294,73009299,73009300,73009301,73009302,73009303,73009304,73009305,73009306,73009307,73009308,73009309,73009310,73009311,73009312,73009313,73009314,73017537,73017538,73017539,73017540,73017546,73017547,73017548,73017549,73017560,73017561,73017562,73017563,
                                                                        73017600,73017601,73017602,73017603,73017623,73017624,73017625,73017626,73017663,73017664,73017665,73017666,73017686,73017687,73017688,73017689,73017998,73017999,73019746,73019747,73019748,
                                                                        73019749,73020000,73020001,73020002,73020005,73020006,73020007,73020008,73020009,73020010,73020011,73020012,73020013,73020015,73020016,73020017,73020019,73020020,73020021,
                                                                        73020023,73020024,73020025,73020027,73020028,73020029,73020031,73020032,73020033,73020038,73020039,73020040,73020042,73020043,73020044,73020045,73020046,73020047,73020048,
                                                                        73020049,73020050,73020051,73020052,73020053,73020054,73020055,73020056,73020528,73042492,73042493,73042494,73042495,73042500,73042501,73042502,73042503,73042524,73042525,
                                                                        73042526,73042527,73042540,73042541,73042542,73042543,73042544,73042545,73042546,73042547,73042552,73042553,73042554,73042555,73042556,73042557,73042558,73042559]),
                                                                    ('categ_id', 'not in', categ_ids._ids),
                                                                    ('height', '=', template.height)]):
                    is_chield = False

                    for attri_id in optional.product_template_attribute_value_ids:
                        if attri_id.product_attribute_value_id.id in domain:
                            is_chield = True
                    if is_chield and optional.product_template_attribute_value_ids:
                        if optional.default_code:
                            print(optional.product_tmpl_id.id)
                            template.write({'optional_product_ids': [(4, optional.product_tmpl_id.id)]})

    def change_name_signal(self):
        templates_ids = self.env['product.template'].search([])
        for template in templates_ids:
            template.name = template.name.replace("'","").replace('"',"")
        products_ids = self.env['product.product'].search([])
        for product in products_ids:
            product.name = product.name.replace("'","").replace('"',"")