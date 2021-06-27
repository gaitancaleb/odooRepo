# -*- coding: utf-8 -*-
# © 2019 dotcreek S.A.

# noinspection PyStatementEffect
{
    'name': 'JanFence Ekit',
    'summary': 'Custom Reports for sale.',
    'version': '11.0.1.0',
    'category': 'Others',
    'author': 'dotcreek S.A.',
    'license': 'Other proprietary',
    'sequence': 10,
    'application': False,
    'installable': True,
    'auto_install': False,
    'external_dependencies': {
        'python': [],
        'bin': [],
    },
    'depends': [
        'base',
        'sale_management',
        'dotcreek_drawaing_fance',
        'sale_crm'
    ],
    'data': [
        'data/sale.order.template.csv',
        'views/change_oreder.xml',
        'views/damage_form.xml',
        'views/job_proposal.xml',
        'views/job_proposal_customer.xml',
        'views/form_st_8.xml',
        'views/credit_card_form.xml',
        'views/release_form.xml',
        'views/release_send_form.xml',
        'views/e_kit.xml',
        'views/company.xml',
        'views/sale_order.xml',
        'views/mail_template.xml',
        'views/form_st_124.xml',
        'views/account_invoice.xml',
    ],

}
