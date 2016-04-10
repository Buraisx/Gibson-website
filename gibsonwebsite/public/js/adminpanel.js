//List users on page ready
$("a[href$='#controlPanel']").ready(function(){
    controlpanel();
});

function controlpanel () {

    var csrfmeta = $("meta[name=_csrf]");
    var controlpanel = '';
    controlpanel+='<div class="search-box">';
    controlpanel+='    <h3>Schedule Event</h3>';
    controlpanel+='    <form action="/admin/addEvent" method="post" class="centeredtool">';
    controlpanel+='        <input type="hidden" name="_csrf" value="' + csrfmeta.attr("content") + '" id="_csrf">';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "form-group col-sm-6" required>';
    controlpanel+='                <label><span class="required">*</span>Date:</label>';
    controlpanel+='                <div class="input-daterange input-group rangedatepicker">';
    controlpanel+='                    <input type="text" class="input form-control" name="startdate" id="startdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required/>';
    controlpanel+='                    <span class="input-group-addon">to</span>';
    controlpanel+='                    <input type="text" class="input form-control" name="enddate" id="enddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    controlpanel+='                </div>';
    controlpanel+='            </div>';
    controlpanel+='            <div class = "form-group col-sm-3">';
    controlpanel+='                <label><span class="required">*</span>Type:</label>';
    controlpanel+='                 <select class="form-control" name="eventtype" id="eventtype" required>';
    controlpanel+='                     <option value="">Select a type</option>';
    controlpanel+='                     <option value="MAINTENANCE">MAINTENANCE</option>';
    controlpanel+='                     <option value="SLOW">SLOW</option>';
    controlpanel+='                     <option value="EVENT">EVENT</option>';
    controlpanel+='                 </select>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "form-group col-sm-9">';
    controlpanel+='                <label><span class="required">*</span>Description:</label>';
    controlpanel+='                <textarea class = "form-control" rows = "3" name = "message" id = "message" required></textarea>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "col-sm-8">';
    controlpanel+='                <button type = "button" onclick="makeEvent()" class= "btn eventsubmit" id = "validate">Submit</button>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='    </form>';
    controlpanel+='</div>';

    $('#controlPanel').append(controlpanel);

    $('.rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
    $('.timepicki').timepicki({start_time: ["12", "00", "PM"]});
}
