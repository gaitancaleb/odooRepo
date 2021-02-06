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
                       #'drawing_img': kwargs['edit-field-base64-data'].replace('data:image/png;base64,',''),
                       'drawing': kwargs['tostorejson']})
        return werkzeug.utils.redirect('/web#id=%s&model=crm.lead&view_type=form'%(drawing.lead_id.id))

    @http.route('/specification/drawing', type='http', auth='public',methods=['GET'], website=True, sitemap=False)
    def set_draw(self, id,draw, **values):
        cr, uid, context = request.cr, request.uid, request.context
        drawing = http.request.env['dotcreek_drawaing_fance.drawing'].search([('id', '=', id)])
        drawing.write({'drawing_img': draw.replace('data:image/png;base64,', '')})
        return True

    @http.route('/specification/get', type='http',auth='public',methods=['GET'], website=True,sitemap=False)
    def get_draw(self,id, **values):
        cr,uid, context =request.cr, request.uid, request.context
        drawing = http.request.env['dotcreek_drawaing_fance.drawing'].search([('id', '=', id)])
        return drawing.drawing

    @http.route('/specification/cancel', type='http',auth='public',methods=['GET'], website=True,sitemap=False)
    def get_cancel(self, id,**kwargs):
        cr,uid, context =request.cr, request.uid, request.context
        drawing = http.request.env['dotcreek_drawaing_fance.drawing'].search([('id', '=', id)])
        return werkzeug.utils.redirect('/web#id=%s&model=crm.lead&view_type=form'%(drawing.lead_id.id))