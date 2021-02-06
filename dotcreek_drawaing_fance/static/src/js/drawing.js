
lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {imageURLPrefix: '/dotcreek_drawaing_fance/static/src/img'}
    
);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const drawing_id = urlParams.get('id');
jQuery('#edit-field-type-of-spec-und-0-value').val(urlParams.get('name'));
jQuery('#job_form_id').val(drawing_id);

var request = jQuery.ajax({
method: "GET",
url:"/specification/get",
async: false,
data: { id: drawing_id}
});
const drawing = request.responseText;
if (drawing !== ''){
  lc.loadSnapshot(JSON.parse(drawing))
}


jQuery('#job-specification-entityform-edit-form').submit(function (e) {
    onSubmit();
  });
function onSubmit() {
    const SnapshotJSON=JSON.stringify(lc.getSnapshot());
    const SnapshotImage=lc.getSVGString();
    jQuery('#tostorejson').val(SnapshotJSON);
    png_canvas=lc.getImage().toDataURL()
    jQuery('#edit-field-base64-data').val(png_canvas);
  }
$('#bdt-cancel').on('click', function () {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const drawing_id = urlParams.get('id');
            location.replace("/web#id="+drawing_id+"&model=crm.lead&view_type=form");

            });

