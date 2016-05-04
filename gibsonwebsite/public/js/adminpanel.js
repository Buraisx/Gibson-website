//List users on page ready
$("a[href$='#controlPanel']").ready(function(){
    controlpanel();
});

function controlpanel () {

    var csrfmeta = $("meta[name=_csrf]");
    var nav = '';
    nav+='                <hr>';
    nav+='                <div class="col-sm-4 sidebarmargin">';
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

    // Step 1
    adduser+='<div class = "row">';
    adduser+='    <div class="form-group col-sm-10">';
    adduser+='        <label class="control-label"><span class="requiredasterisk">*</span>Username:</label>';
    adduser+='        <span id = "confirmuser"></span>';
    adduser+='        <input class = "form-control reqIn" type="text" name ="username" id="username" placeholder = "Enter Username" onchange="delayUsername();" required pattern="\w{3,16}">';
    adduser+='        <!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='    <div class="form-group col-sm-5">';
    adduser+='        <label class="control-label"><span class="requiredasterisk">*</span>Password:</label>';
    adduser+='        <input type="password" class = "form-control reqIn" name = "password" id="password" placeholder="Enter Password"  onkeyup="checkPass(); return false;" minlength= "6" required pattern="(?=.*\d)(?=.*[a-zA-Z]).{6,}">';
    adduser+='        <!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class="form-group col-sm-5">';
    adduser+='        <label class="control-label"><span class="requiredasterisk">*</span>Confirm Password:</label>';
    adduser+='        <input type="password" class = "form-control reqIn" name = "passwordhashed" id="passwordhashed" placeholder="Re-enter Password" onkeyup="checkPass(); return false;" required pattern="(?=.*\d)(?=.*[a-zA-Z]).{6,}">';
    adduser+='        <!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='    <div class = "form-group col-sm-10">';
    adduser+='        <span id="confirmpass" class="confirmpass"></span>';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='    <div class="form-group col-sm-10">';
    adduser+='        <label class="control-label"><span class="requiredasterisk">*</span>Email:</label>';
    adduser+='        <input class = "form-control reqIn" type="email" name = "email" id="email" onchange =" delayEmail();"placeholder="Enter email" required pattern="[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b">';
    adduser+='    </div>';
    adduser+='</div>';

    // Step 2
    adduser+='<div class = "row">';
    adduser+='    <div class = "form-group  col-sm-5">';
    adduser+='        <label><span class="requiredasterisk">*</span>First Name:</label>';
    adduser+='        <input type = "text" class = "form-control reqIn" name = "fname" id = "fname" placeholder="eg. Bob" required pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-5">';
    adduser+='        <label><span class="requiredasterisk">*</span>Last Name:</label>';
    adduser+='        <input type = "text" class = "form-control reqIn" name = "lname" id = "lname" placeholder="eg. Smith" required pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='            <div class = "form-group  col-sm-5">';
    adduser+='        <label><span class="requiredasterisk">*</span>Age Group:</label>';
    adduser+='        <select class = "form-control" name = "age_group" id = "age_group" placeholder="Age Group">';
    adduser+='            <option value="" disabled selected>Please Select</option>';
    // adduser+='            <% for(var i=0; i<age_group_list.length; i++) { %>';
    // adduser+='                <li>';
    // adduser+='                    <option value = <%= age_group_list[i].age_group_id %>>';
    // adduser+='                        <%= age_group_list[i].age_group_name + " (" + age_group_list[i].age_group_description + ")" %>';
    // adduser+='                    </option>';
    // adduser+='                </li>';
    // adduser+='            <% } %>';
    adduser+='        </select>';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-5">';
    adduser+='        <label class = "control-label"><span class="requiredasterisk">*</span>Gender:</label>';
    adduser+='        <select class = "form-control" name = "gender" id = "gender" placeholder="Gender" required>';
    adduser+='            <option value="" disabled selected>Please Select</option>';
    adduser+='            <option value = "Male">Male</option>';
    adduser+='            <option value = "Female">Female</option>';
    adduser+='            <option value = "Other">Other</option>';
    adduser+='        </select>';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='    <div class = "form-group  col-sm-7">';
    adduser+='        <label class = "control-label"><span class="requiredasterisk">*</span>Address:</label>';
    adduser+='        <input type = "text" class = "form-control reqIn" name = "address" id = "address" required pattern="^[a-zA-Z0-9._ ]*$" oninvalid="setCustomValidity("Invalid address.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-3">';
    adduser+='        <label class = "control-label"><span class="requiredasterisk">*</span>Postal Code:</label>';
    adduser+='        <input type = "text" class = "form-control reqIn" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="eg. A1A1A1" required pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" oninvalid="setCustomValidity("Invalid postal code.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='    <div class = "form-group  col-sm-3">';
    adduser+='        <label class = "control-label">Apt/Unit#:</label>';
    adduser+='        <input type = "number" class = "form-control" name = "apt" id = "apt" max="6">';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-3">';
    adduser+='        <label class = "control-label"><span class="requiredasterisk">*</span>City:</label>';
    adduser+='        <input type = "text" class = "form-control reqIn" name = "city" id = "city" required pattern="[a-zA-Z. ]+" oninvalid="setCustomValidity("Invalid city.")" onchange="try{setCustomValidity("")}catch(e){}">';
    adduser+='        <!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-4">';
    adduser+='        <label class = "control-label"><span class="requiredasterisk">*</span>Province:</label>';
    adduser+='        <select class = "form-control" name = "province" id = "province" placeholder="Province">';
    adduser+='            <option value="" disabled selected>Please Select</option>';
    // adduser+='            <% for(var i=0; i<province_list.length; i++) { %>';
    // adduser+='                <li>';
    // adduser+='                    <option value = <%= province_list[i].province_id %>>';
    // adduser+='                        <%= province_list[i].province_name %>';
    // adduser+='                    </option>';
    // adduser+='                </li>';
    // adduser+='            <% } %>';
    adduser+='        </select>';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='    <div class = "  col-sm-4">';
    adduser+='        <label for="student"><input type="checkbox" id="student" name = "student"> I am a student.</label>';
    adduser+='    </div>';
    adduser+='    <div class="col-sm-6 pull-left" id="signup-notifications">';
    adduser+='        <label><input type="checkbox" id="send_notifications" name = "send_notifications"> Signup for email newsletters.</label>';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div id="student_info" class="hidden">';
    adduser+='    <div class="row">';
    adduser+='        <div class = "form-group col-sm-5">';
    adduser+='            <label><span class="requiredasterisk">*</span>School Name:</label>';
    adduser+='            <input type = "text" class = "form-control " class="required" name = "schoolname" id = "schoolname" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='        </div>';
    adduser+='        <div class = "form-group col-sm-5">';
    adduser+='            <label><span class="requiredasterisk">*</span>Grade:</label>';
    adduser+='            <input type = "text" class = "form-control" class="required" name = "grade" id = "grade" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='        </div>';
    adduser+='    </div>';
    adduser+='    <div class="row">';
    adduser+='        <div class = "form-group  col-sm-5">';
    adduser+='            <label>Major:</label>';
    adduser+='            <input type = "text" class = "form-control" name = "major" id = "major" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='        </div>';
    adduser+='        <div class = "form-group col-sm-5">';
    adduser+='            <label>ESL Level (if applicable):</label>';
    adduser+='            <input type = "text" class = "form-control" name = "esl" id = "esl" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='        </div>';
    adduser+='    </div>';
    adduser+='</div>';

    // Step 3
    adduser+='<div class = "row">';
    adduser+='    <div class = "form-group col-sm-3 stoppaddingright">';
    adduser+='        <label class = "control-label">Phone (Home):</label>';
    adduser+='        <input class = "form-control" type = "text" name = "primary_phone" id = "primary_phone" maxlength="16" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-2 stoppaddingleft">';
    adduser+='        <label class = "control-label">Ext:</label>';
    adduser+='        <input class = "form-control" type = "text" name = "primary_extension" id = "primary_extension" maxlength="6" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid Extension.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-3 stoppaddingright">';
    adduser+='        <label class = "control-label">Phone (Cell):</label>';
    adduser+='        <input class = "form-control" type = "text" name = "secondary_phone" id = "secondary_phone" maxlength="16" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='    <div class = "form-group col-sm-2 stoppaddingleft">';
    adduser+='        <label class = "control-label">Ext:</label>';
    adduser+='        <input class = "form-control" type = "text" name = "secondary_extension" id = "secondary_extension" maxlength="6" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid Extension.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='    </div>';
    adduser+='</div>';
    adduser+='<div class = "row">';
    adduser+='   <div class = "col-sm-5">';
    adduser+='        <h4>Emergency Contacts <span class = "normalfont">(Minimum 1)</span></h4>';
    adduser+='    </div>';
    adduser+='</div>';
    for(var i=1; i <= 3; i++) {
        adduser+='<div id = "contact' + i + '"';
        if (i != 1) {
            adduser+=' class = "hidden"';
        }
        adduser+='>';
        adduser+='    <div class = "row">';
        adduser+='        <div class = "col-sm-5">';
        adduser+='            <label>Emergency Contact ' + i + ':</label>';
        adduser+='        </div>';
        adduser+='    </div>';
        adduser+='    <div class="row">';
        adduser+='        <div class = "form-group col-sm-5">';
        adduser+='            <label><span class="requiredasterisk">*</span>First Name:</label>';
        adduser+='            <input type = "text" class = "form-control reqIn required" name = "emergencyfname' + i + '" id = "emergencyfname' + i + '" placeholder= "eg. Alice" pattern= "[a-zA-Z0-9. ]+" oninvalid="setCustomValidity("Invalid name.")" onchange="try{setCustomValidity("")}catch(e){}"';
        if (i == 1) {
            adduser+='required';
        }
        adduser+='>';
        adduser+='        </div>';
        adduser+='        <div class = "form-group col-sm-5">';
        adduser+='            <label><span class="requiredasterisk">*</span>Last Name:</label>';
        adduser+='            <input type = "text" class = "form-control reqIn required" name = "emergencylname' + i + '" id = "emergencylname' + i + '" placeholder="eg. Smith" pattern="[a-zA-Z0-9. ]+" oninvalid="setCustomValidity("Invalid name.")" onchange="try{setCustomValidity("")}catch(e){}"';
        if (i == 1) {
            adduser+=' required';
        }
        adduser+='>';
        adduser+='        </div>';
        adduser+='    </div>';
        adduser+='    <div class="row">';
        adduser+='        <div class = "form-group col-sm-5">';
        adduser+='            <label><span class="requiredasterisk">*</span>Relationship:</label>';
        adduser+='            <input type = "text" class = "form-control reqIn required" name = "relationship' + i + '" id = "relationship' + i + '" pattern="[a-zA-Z0-9. ]+"';
        if (i == 1) {
            adduser+=' required';
        }
        adduser+='>';
        adduser+='        </div>';
        adduser+='        <div class = "form-group col-sm-5">';
        adduser+='            <label><span class="requiredasterisk">*</span>Phone:</label>';
        adduser+='            <input type = "text" class = "form-control reqIn required" name = "ephone' + i + '" id = "ephone' + i + '" maxlength="16" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}"';
        if (i == 1) {
            adduser+=' required';
        }
        adduser+='>';
        adduser+='        </div>';
        adduser+='    </div>';
        adduser+='</div>';
    }
    adduser+='<div class="row">';
    adduser+='    <div class = "col-sm-5">';
    adduser+='        <button type = "button" class= "btn btn-info" onclick="addcontact()" id = "addbutton">Add another contact</button>';
    adduser+='    </div>';
    adduser+='    <div class = "col-sm-5">';
    adduser+='        <button type = "button" class= "btn btn-info hidden btnedit" onclick="removecontact()" id = "removebutton">Remove a contact</button>';
    adduser+='    </div>';
    adduser+='</div>';


    adduser+='<div class = "row signupbuttons">';
    adduser+='    <div class = "col-sm-5">';
    adduser+='        <button type = "button" class = "btn btn-success" name="btnsubmit" onclick="signup()" id="createbutton">Create User</button>';
    adduser+='    </div>';
    adduser+='</div>';

    adduser+='                        </div> <!-- page-content-wrapper -->';
    adduser+='                    </div> <!-- tab-pane -->';

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
    limiteduser+='                                    <input class = "form-control" type = "text" name = "primary_phone" id = "primary_phone" maxlength="16" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}">';
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
    modifycourse+='                            <h3>Modify Course</h3>';                           
    modifycourse+='                        </div>';
    modifycourse+='                    </div>';

    var modifyuser='';
    modifyuser+='                    <div class="tab-pane" id="modifyuser">';
    modifyuser+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    modifyuser+='                            <h3>Modify User Info</h3>';                           
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
