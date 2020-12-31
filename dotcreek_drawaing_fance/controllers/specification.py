import base64
import werkzeug
from odoo import fields, http, _
from odoo.http import request


class SpecificationController(http.Controller):

    @http.route('/specification/save', type='http', auth='public', website=True,csrf=False)
    def add_draw(self, **kwargs):
        cr,uid, context =request.cr, request.uid, request.context
        drawing = http.request.env['dotcreek_drawaing_fance.drawing'].search([('id', '=', kwargs['job_form_id'])])
        drawing.write({'name': kwargs['edit-field-type-of-spec-und-0-value'],
                       'drawing': kwargs['tostorejson']})
        return werkzeug.utils.redirect('/web#id=%s&model=crm.lead&view_type=form'%(drawing.lead_id.id))