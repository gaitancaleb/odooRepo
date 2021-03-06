var backgroundImage = new Image()
backgroundImage.src = '/dotcreek_drawaing_fance/static/src/img/bgdrawing.png';

lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {imageURLPrefix: '/dotcreek_drawaing_fance/static/src/img',
      backgroundShapes: [
    LC.createShape(
      'Image', {x: 1, y: 1, image: backgroundImage, scale: 2}),]}
    
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
  lc.loadSnapshot(JSON.parse(drawing));
  lc.backgroundShapes= [
    LC.createShape(
      'Image', {x: 1, y: 1, image: backgroundImage, scale: 2}),];
}


jQuery('#job-specification-entityform-edit-form').submit(function (e) {
    onSubmit();
  });
function onSubmit() {
    lc.backgroundShapes= [];
    const SnapshotJSON=JSON.stringify(lc.getSnapshot());
    const SnapshotImage=lc.getSVGString();
    jQuery('#tostorejson').val(SnapshotJSON);
    png_canvas=lc.getImage().toDataURL()
    jQuery('#edit-field-base64-data').val(png_canvas);
   
  }
$('#bdt-cancel').on('click', function () {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const drawing_id = urlParams.get('lead');
            location.replace("/web#id="+drawing_id+"&model=crm.lead&view_type=form");

            });

