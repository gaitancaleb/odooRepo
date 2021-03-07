# -*- coding: utf-8 -*-
# © 2019 dotcreek S.A.

# noinspection PyStatementEffect
{
    'name': 'JanFence Essentials',
    'summary': 'Essential features.',
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
        'calendar',
        'contacts',
        'account',
        'crm',
        'sales_team',
        'sale_crm',
        'dotcreek_janfence_ekit',
        'industry_fsm',
    ],
    'data': [
        'views/record_rules_calendar.xml',
        'views/user.xml',
        'views/contact.xml',
        'views/sms.xml',
        'views/email.xml',
        'views/customers_selectors.xml',
        'views/task_search.xml',
        'views/view_domains.xml',

    ],

}
