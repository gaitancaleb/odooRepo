# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models
from odoo.tools.misc import format_date
from datetime import timedelta

class Task(models.Model):
    _inherit = "project.task.type"

    color = fields.Integer('Stage color')