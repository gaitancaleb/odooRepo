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
        'contacts',
        'account',
        'crm',
        'dotcreek_janfence_ekit',
        'industry_fsm',
    ],
    'data': [
        'views/contact.xml',
        'views/user.xml',
        'views/sms.xml',
        'views/email.xml',
    ],

}
