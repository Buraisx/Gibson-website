//List users on page ready
$("a[href$='#controlPanel']").ready(function(){
    controlpanel();
});

function controlpanel () {

    var controlpanel = '';
    controlpanel+='<div class="search-box">';
    controlpanel+='    <h3>Schedule Event</h3>';
    controlpanel+='    <form action="/admin/addEvent" method="post">';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "form-group col-sm-6" required>';
    controlpanel+='                <label><span class="required">*</span>Date:</label>';
    controlpanel+='                <div class="input-daterange input-group rangedatepicker">';
    controlpanel+='                    <input type="text" class="input form-control" name="startdate" id="startdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required/>';
    controlpanel+='                    <span class="input-group-addon">to</span>';
    controlpanel+='                    <input type="text" class="input form-control" name="enddate" id="enddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    controlpanel+='                </div>';
    controlpanel+='            </div>';
    controlpanel+='            <div class = "form-group col-sm-4" required>';
    controlpanel+='                <label><span class="required">*</span>Type:</label>';
    controlpanel+='                 <select class="form-control" name="eventtype" id="eventtype">';
    controlpanel+='                     <option value="">Select a type</option>';
    controlpanel+='                     <option value="MAINTENANCE">MAINTENANCE</option>';
    controlpanel+='                     <option value="SLOW">SLOW</option>';
    controlpanel+='                     <option value="EVENT">EVENT</option>';
    controlpanel+='                 </select>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "form-group col-sm-3">';
    controlpanel+='                <input type = "text" class = "form-control timepicki" name = "starttime" id = "starttime" required>';
    controlpanel+='            </div>';
    controlpanel+='            <div class = "form-group col-sm-3">';
    controlpanel+='                <input type = "text" class = "form-control timepicki" name = "endtime" id = "endtime" required>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "form-group col-sm-10">';
    controlpanel+='                <label><span class="required">*</span>Description:</label>';
    controlpanel+='                <textarea class = "form-control" rows = "3" name = "message" id = "message"></textarea>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='        <div class = "row">';
    controlpanel+='            <div class = "col-sm-8 ">';
    controlpanel+='                <button type = "submit" class= "btn eventsubmit" id = "validate">Submit</button>';
    controlpanel+='            </div>';
    controlpanel+='        </div>';
    controlpanel+='    </form>';
    controlpanel+='</div>';

    $('#controlPanel').append(controlpanel);;

    $('.timepicki').timepicki({start_time: ["12", "00", "PM"]});
}


