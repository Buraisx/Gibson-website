//List users on page ready
$("a[href$='#controlPanel']").ready(function(){
    controlpanel();
});

function controlpanel () {

    var csrfmeta = $("meta[name=_csrf]");
    var nav = '';
    nav+='                <hr>';
    nav+='                <div class="col-sm-4">';
    nav+='                    <div id="sidebar-wrapper">';
    nav+='                        <ul class="sidebar-nav nav-stacked" id="menu">';
    nav+='                        <li class="active"><a class="menucolour" href="#adduser" data-toggle="tab"><i class="fa fa-user-plus"></i> Add New User</a></li>';
    nav+='                        <li><a class="menucolour" href="#addlimiteduser" data-toggle="tab"><i class="fa fa-user"></i> Add Limited User</a></li>';
    nav+='                        <li><a class="menucolour" href="#addusertocourse" data-toggle="tab"><i class="fa fa-plus-square-o"></i> Add User To Course</a></li>';
    nav+='                        <li><a class="menucolour" href="#addcourse" data-toggle="tab"><i class="fa fa-plus-square-o"></i> Add Course</a></li>';
    nav+='                        <li><a class="menucolour" href="#modifycourse" data-toggle="tab"><i class="fa fa-plus-square-o"></i> Modify Course</a></li>';
    nav+='                        <li><a class="menucolour" href="#modifyuser" data-toggle="tab"><i class="fa fa-plus-square-o"></i> Modify User Info</a></li>';
    nav+='                        <li><a class="menucolour" href="#scheduleevent" data-toggle="tab"><i class="fa fa-plus-square-o"></i> Schedule Event</a></li>';
    nav+='                        <li><a class="menucolour" href="#changerank" data-toggle="tab"><i class="fa fa-plus-square-o"></i> Change User Rank</a></li>';
    nav+='                        </ul>';
    nav+='                    </div>';
    nav+='                </div>';

    var controlpanel='';
    controlpanel+='      <div class="tab-content">';

    var adduser='';
    adduser+='                    <div class="tab-pane active" id="adduser">';
    adduser+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    adduser+='                            <h3>Add New User</h3>';
    adduser+='                        </div>';
    adduser+='                    </div>';

    var limiteduser='';
    limiteduser+='                    <div class="tab-pane" id="addlimiteduser">';
    limiteduser+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    limiteduser+='                            <form name="frm" action = "/volunteer/addlimited" method = "post" role = "form" id= "frm">';
    limiteduser+='                            <h3>Add Limited User</h3>';
    limiteduser+='                            <div class = "row">';
    limiteduser+='                                <div class = "form-group col-sm-5">';
    limiteduser+='                                    <label><span class="requiredasterisk">*</span>First Name:</label>';
    limiteduser+='                                    <input type = "text" class = "form-control reqIn" name = "fname" id = "fname" placeholder="eg. Bob" required pattern="[a-zA-Z0-9. ]+">';
    limiteduser+='                                </div>';
    limiteduser+='                                <div class = "form-group col-sm-5">';
    limiteduser+='                                    <label><span class="requiredasterisk">*</span>Last Name:</label>';
    limiteduser+='                                    <input type = "text" class = "form-control reqIn" name = "lname" id = "lname" placeholder="eg. Smith" required pattern="[a-zA-Z0-9. ]+">';
    limiteduser+='                                </div>';
    limiteduser+='                            </div>';
    limiteduser+='                            <div class = "row">';
    limiteduser+='                                <div class="form-group col-sm-5">';
    limiteduser+='                                    <label class="control-label"><span class="requiredasterisk">*</span>Email:</label>';
    limiteduser+='                                    <input class = "form-control reqIn" type="email" name = "email" id="email" onchange =" delayEmail();"placeholder="Enter email" required pattern="[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b">';
    limiteduser+='                                </div>';
    limiteduser+='                                <div class = "form-group col-sm-5">';
    limiteduser+='                                    <label class = "control-label">Phone (Home):</label>';
    limiteduser+='                                    <input class = "form-control" type = "text" name = "primary_phone" id = "primary_phone" maxlength="16" pattern="[+]?[1]?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}">';
    limiteduser+='                                </div>';
    limiteduser+='                            </div>';
    limiteduser+='                            <div class = "row">';
    limiteduser+='                                <div class = "col-sm-10 text-right">';
    limiteduser+='                                    <button type = "button" class = "btn btn-default">Add</button>';
    limiteduser+='                                </div>';
    limiteduser+='                            </div>';
    limiteduser+='                            </form>';
    limiteduser+='                        </div>';
    limiteduser+='                    </div>';

    var addusertocourse='';
    addusertocourse+='                    <div class="tab-pane" id="addusertocourse">';
    addusertocourse+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    addusertocourse+='                            <h3>Add User To Course</h3>';                           
    addusertocourse+='                        </div>';
    addusertocourse+='                    </div>';

    var addcourse='';
    addcourse+='                    <div class="tab-pane" id="addcourse">';
    addcourse+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    addcourse+='                            <h3>Add Course</h3>';                           
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    var modifycourse='';
    modifycourse+='                    <div class="tab-pane" id="modifycourse">';
    modifycourse+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    modifycourse+='                            <h3>Add Course</h3>';                           
    modifycourse+='                        </div>';
    modifycourse+='                    </div>';

    var modifyuser='';
    modifyuser+='                    <div class="tab-pane" id="modifyuser">';
    modifyuser+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    modifyuser+='                            <h3>Add Course</h3>';                           
    modifyuser+='                        </div>';
    modifyuser+='                    </div>';

    var scheduleevent='';
    scheduleevent+='                <div class="tab-pane" id="scheduleevent">';
    scheduleevent+='                     <div id="page-content-wrapper" class="container-fluid xyz">';
    scheduleevent+='                        <h3>Schedule Event</h3>';
    scheduleevent+='                        <form action="/admin/addEvent" method="post" class="centeredtool">';
    scheduleevent+='                            <input type="hidden" name="_csrf" value="' + csrfmeta.attr("content") + '" id="_csrf">';
    scheduleevent+='                            <div class = "row">';
    scheduleevent+='                                <div class = "form-group col-sm-6" required>';
    scheduleevent+='                                    <label><span class="required">*</span>Date:</label>';
    scheduleevent+='                                    <div class="input-daterange input-group rangedatepicker">';
    scheduleevent+='                                        <input type="text" class="input form-control" name="startdate" id="startdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required/>';
    scheduleevent+='                                        <span class="input-group-addon">to</span>';
    scheduleevent+='                                        <input type="text" class="input form-control" name="enddate" id="enddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    scheduleevent+='                                    </div>';
    scheduleevent+='                                </div>';
    scheduleevent+='                                <div class = "form-group col-sm-3">';
    scheduleevent+='                                    <label><span class="required">*</span>Type:</label>';
    scheduleevent+='                                        <select class="form-control" name="eventtype" id="eventtype" required>';
    scheduleevent+='                                            <option value="">Select a type</option>';
    scheduleevent+='                                            <option value="MAINTENANCE">MAINTENANCE</option>';
    scheduleevent+='                                            <option value="SLOW">SLOW</option>';
    scheduleevent+='                                            <option value="EVENT">EVENT</option>';
    scheduleevent+='                                        </select>';
    scheduleevent+='                                </div>';
    scheduleevent+='                            </div>';
    scheduleevent+='                            <div class = "row">';
    scheduleevent+='                                <div class = "form-group col-sm-9">';
    scheduleevent+='                                    <label><span class="required">*</span>Description:</label>';
    scheduleevent+='                                    <textarea class = "form-control" rows = "3" name = "message" id = "message" required></textarea>';
    scheduleevent+='                                </div>';
    scheduleevent+='                            </div>';
    scheduleevent+='                            <div class = "row">';
    scheduleevent+='                                <div class = "col-sm-8">';
    scheduleevent+='                                    <button type = "button" onclick="makeEvent()" class= "btn eventsubmit" id = "validate">Submit</button>';
    scheduleevent+='                                </div>';
    scheduleevent+='                            </div>';
    scheduleevent+='                        </form>';
    scheduleevent+='                    </div>';
    scheduleevent+='                </div>';

    var changerank='';
    changerank+='                    <div class="tab-pane" id="changerank">';
    changerank+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    changerank+='                            <h3>Change User Rank</h3>';                           
    changerank+='                        </div>';
    changerank+='                    </div>';

    $('.rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
    $('.timepicki').timepicki({start_time: ["12", "00", "PM"]});

    controlpanel+=adduser;
    controlpanel+=limiteduser;
    controlpanel+=addusertocourse;
    controlpanel+=addcourse;
    controlpanel+=modifycourse;
    controlpanel+=modifyuser;
    controlpanel+=scheduleevent;
    controlpanel+=changerank;

    //Submit Tab
    controlpanel+='                   </div>';   //closing tab div

    $('#controlPanel').append(nav);
    $('#controlPanel').append(controlpanel);
}
