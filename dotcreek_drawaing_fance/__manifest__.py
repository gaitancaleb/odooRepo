# -*- coding: utf-8 -*-
# © 2019 dotcreek S.A.

# noinspection PyStatementEffect
{
    'name': 'Drawing tool',
    'summary': 'Jan Fences Drawing tool',
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
        'crm',
        'stock',
        'website',
    ],
    'data': [
        'views/lead.xml',
        'views/specification.xml',
        'views/drawing.xml'

    ],

}
