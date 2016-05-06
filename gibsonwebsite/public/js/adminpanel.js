//List users on page ready



$("a[href$='#controlPanel']").ready(function(){
	jQuery.getJSON('/user/listfiller', function(req){
		dropdown_info = {provinces: req.provinces, age_groups: req.age_groups};
		controlpanel(dropdown_info);
	});
});


// AGE GROUP AND PROVINCE BOTH PROVIDE ID. USE age_group: $('#age_group option:selected').val() TO GET THE VALUE (SIMILAR FOR PROVINCE)


function controlpanel (dropdown_info) {

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
    adduser+='      <div class="tab-pane active" id="adduser">';
    adduser+='          <div id="page-content-wrapper" class="container-fluid xyz">';
    adduser+='              <form name="frm" action = "/signup" method = "post" role = "form" id= "frm">';
    adduser+='                  <div id="myCarousel" class="carousel-overflow carousel slide" style="height:600px;" data-interval="false"><!--Carouselstart-->';
    adduser+='                     <input type="hidden" name="_csrf" value="' + csrfmeta.attr("content") + '" id="_csrf">';
    adduser+='                      <div class = "carousel-inner"><!--Items inside carousel-->';
    adduser+='                          <div class = "item active"><!--first item-->';
    adduser+='                              <div class = "panel panel-default">';
    adduser+='                                  <div class = "panel-heading">';
    adduser+='                                      <h2 class = "text-center">Account Creation</h2>';
    adduser+='                                  </div>';
    adduser+='                                  <div class = "panel-body">';
    adduser+='                                                 <div class = "row">';
    adduser+='                        <div class="form-group col-sm-offset-1 col-sm-10">';
    adduser+='                            <label class="control-label"><span class="requiredasterisk">*</span>Username:</label>';
    adduser+='                            <span id = "confirmuser"></span>';
    adduser+='                            <input class = "form-control reqIn" type="text" name ="username" id="username" placeholder = "Enter Username" onchange="delayUsername();" required pattern="\w{3,16}">';
    adduser+='                        </div>';
    adduser+='                    </div>';
    //Input Password
    adduser+='                    <div class = "row">';
    adduser+='                        <div class="form-group col-sm-offset-1 col-sm-5">';
    adduser+='                            <label class="control-label"><span class="requiredasterisk">*</span>Password:</label>';
    adduser+='                            <input type="password" class = "form-control reqIn" name = "password" id="password" placeholder="Enter Password"  onkeyup="checkPass(); return false;" minlength= "6" required pattern="(?=.*\d)(?=.*[a-zA-Z]).{6,}">';
    adduser+='                        </div>';
    adduser+='                        <div class="form-group col-sm-5">';
    adduser+='                            <label class="control-label"><span class="requiredasterisk">*</span>Confirm Password:</label>';
    adduser+='                            <input type="password" class = "form-control reqIn" name = "passwordhashed" id="passwordhashed" placeholder="Re-enter Password" onkeyup="checkPass(); return false;" required pattern="(?=.*\d)(?=.*[a-zA-Z]).{6,}">';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class = "col-sm-offset-1 col-sm-10">';
    adduser+='                            <span id="confirmpass" class="confirmpass"></span>';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class="form-group col-sm-offset-1 col-sm-10">';
    adduser+='                            <label class="control-label"><span class="requiredasterisk">*</span>Email:</label>';
    adduser+='                            <input class = "form-control reqIn" type="email" name = "email" id="email" onchange =" delayEmail();"placeholder="Enter email" required pattern="[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b">';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class = "col-sm-offset-9 col-sm-2">';
    adduser+='                            <button type = "button" class = "btn btn-success next-button" href="#myCarousel" data-slide="next">Next&nbsp;&nbsp;&nbsp;&rarr;</button>';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                                            </div>';
    adduser+='                                        </div>';
    adduser+='                                    </div><!--Firstitem end-->';
    adduser+='                                    <div class = "item"><!--second item-->';
    adduser+='                                     <div class = "panel panel-default signuppanel"><!-- panel start-->';
    adduser+='               <div class = "panel-heading" id="signup2">';
    adduser+='               <h2 class = "text-center">User Information</h2>';
    adduser+='               </div>';
    adduser+='                <div class = "panel-body">';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class = "form-group col-sm-offset-1 col-sm-5">';
    adduser+='                            <label><span class="requiredasterisk">*</span>First Name:</label>';
    adduser+='                            <input type = "text" class = "form-control reqIn" name = "fname" id = "fname" placeholder="eg. Bob" required pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='                        </div>';
    adduser+='                        <div class = "form-group col-sm-5">';
    adduser+='                            <label><span class="requiredasterisk">*</span>Last Name:</label>';
    adduser+='                            <input type = "text" class = "form-control reqIn" name = "lname" id = "lname" placeholder="eg. Smith" required pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='                        </div>';
    adduser+='                    </div>';
    //Input Age
    adduser+='                    <div class = "row">';
    adduser+='                                <div class = "form-group col-sm-offset-1 col-sm-5">';
    adduser+='                            <label><span class="requiredasterisk">*</span>Age Group:</label>';
    adduser+='                            <select class = "form-control" name = "age_group" id = "age_group" placeholder="Age Group">';
    adduser+='                                <option value="" disabled selected>Please Select</option>';
    for (var i = 0; i < dropdown_info.age_groups.length; i++) {
            //editinfo+='                <option value="user_info.provinces_list[i].province_id"';
        adduser+='            <option';
        adduser+=' value=' + dropdown_info.age_groups[i].age_group_id;
        adduser+='>' + dropdown_info.age_groups[i].age_group_description + '</option>';
    }
    adduser+='                            </select>';
    adduser+='                        </div>';
    adduser+='                        <div class = "form-group col-sm-5">';
    adduser+='                            <label class = "control-label"><span class="requiredasterisk">*</span>Gender:</label>';
    adduser+='                            <select class = "form-control" name = "gender" id = "gender" placeholder="Gender" required>';
    adduser+='                                <option value="" disabled selected>Please Select</option>';
    adduser+='                                <option value = "Male">Male</option>';
    adduser+='                                <option value = "Female">Female</option>';
    adduser+='                                <option value = "Other">Other</option>';
    adduser+='                            </select>';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class = "form-group col-sm-offset-1 col-sm-7">';
    adduser+='                            <label class = "control-label"><span class="requiredasterisk">*</span>Address:</label>';
    adduser+='                            <input type = "text" class = "form-control reqIn" name = "address" id = "address" required pattern="^[a-zA-Z0-9._ ]*$" oninvalid="setCustomValidity(\'Invalid address.\')" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='                        </div>';
    adduser+='                        <div class = "form-group col-sm-3">';
    adduser+='                            <label class = "control-label"><span class="requiredasterisk">*</span>Postal Code:</label>';
    adduser+='                            <input type = "text" class = "form-control reqIn" name = "postal_code" id="postal_code" minlength="6" maxlength="7" placeholder="eg. A1A1A1" required pattern="^[a-zA-Z]{1}\d{1}[a-zA-Z]{1} *\d{1}[a-zA-Z]{1}\d{1}$" oninvalid="setCustomValidity(\'Invalid postal code.\')" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class = "form-group col-sm-offset-1 col-sm-3">';
    adduser+='                            <label class = "control-label">Apt/Unit#:</label>';
    adduser+='                            <input type = "number" class = "form-control" name = "apt" id = "apt" max="6">';
    adduser+='                        </div>';
    adduser+='                        <div class = "form-group col-sm-3">';
    adduser+='                            <label class = "control-label"><span class="requiredasterisk">*</span>City:</label>';
    adduser+='                            <input type = "text" class = "form-control reqIn" name = "city" id = "city" required pattern="[a-zA-Z. ]+" oninvalid="setCustomValidity(\'Invalid city.\')" onchange="try{setCustomValidity("")}catch(e){}">';
    adduser+='                        </div>';
    adduser+='                        <div class = "form-group col-sm-4">';
    adduser+='                            <label class = "control-label"><span class="requiredasterisk">*</span>Province:</label>';
    adduser+='                            <select class = "form-control" name = "province" id = "province" placeholder="Province">';
    adduser+='                                <option value="" disabled selected>Please Select</option>';
    for (var i = 0; i < dropdown_info.provinces.length; i++) {
            //editinfo+='                <option value="user_info.provinces_list[i].province_id"';
        adduser+='            <option';
        adduser+=' value=' + dropdown_info.provinces[i].province_id;
        adduser+='>' + dropdown_info.provinces[i].prov_abb + '</option>';
    }
    adduser+='                            </select>';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                        <div class = "row">';
    adduser+='                            <div class = "col-sm-offset-1  col-sm-4">';
    adduser+='                                <label for=\'student\'><input type="checkbox" id="student" name = "student" onclick="studentcheckbox();"> I am a student.</label>';
    adduser+='                            </div>';
    adduser+='                            <div class="col-sm-6" id="signup-notifications">';
    adduser+='                                <label><input type="checkbox" id="send_notifications" name = "send_notifications"> Signup for email newsletters.</label>';
    adduser+='                            </div>';
    adduser+='                        </div>';
    adduser+='                        <div id=\'student_info\' class=\'hidden\'>';
    adduser+='                            <div class="row">';
    adduser+='                                <div class = "form-group col-sm-offset-1 col-sm-5">';
    adduser+='                                    <label><span class="requiredasterisk">*</span>School Name:</label>';
    adduser+='                                    <input type = "text" class = "form-control " class="required" name = "schoolname" id = "schoolname" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                                <div class = "form-group col-sm-5">';
    adduser+='                                    <label><span class="requiredasterisk">*</span>Grade:</label>';
    adduser+='                                    <input type = "text" class = "form-control" class="required" name = "grade" id = "grade" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                            </div>';
    adduser+='                            <div class="row">';
    adduser+='                                <div class = "form-group col-sm-offset-1 col-sm-5">';
    adduser+='                                    <label>Major:</label>';
    adduser+='                                    <input type = "text" class = "form-control" name = "major" id = "major" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                                <div class = "form-group col-sm-5">';
    adduser+='                                    <label>ESL Level (if applicable):</label>';
    adduser+='                                    <input type = "text" class = "form-control" name = "esl" id = "esl" pattern="[a-zA-Z0-9. ]+"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                            </div>';
    adduser+='                        </div>';
    adduser+='                    <div class = "row">';
    adduser+='                        <div class = "col-sm-offset-1 col-sm-5">';
    adduser+='                            <button type = "button" class = "btn btn-warning " href="#myCarousel"  data-slide="prev" >&larr; &nbsp;&nbsp; &nbsp; Back </button>';
    adduser+='                        </div>';

    adduser+='                        <div class = "col-sm-offset-3 col-sm-2">';
    adduser+='                            <button type = "button" class = "btn btn-success next-button" href="#myCarousel" data-slide="next">Next&nbsp;&nbsp; &nbsp; &rarr;</button>';
    adduser+='                        </div>';
    adduser+='                    </div>';
    adduser+='                </div><!--panelbody-->';
    adduser+='            </div><!--panel-default-->';
    adduser+='                                    </div><!--second item end-->';
    adduser+='                                    <div class = "item"><!--third item-->';
    adduser+='                                    <div class = "panel panel-default signuppanel"><!-- panel start-->';
    adduser+='                       <div class = "panel-heading" id="signup3">';
    adduser+='                       <h2 class = "text-center">Contact Info</h2>';
    adduser+='                       </div>';
    adduser+='                        <div class = "panel-body">';
    //Input phonenumber
    adduser+='                            <div class = "row">';
    adduser+='                                <div class = "form-group col-sm-offset-1 col-sm-3 stoppaddingright">';
    adduser+='                                    <label class = "control-label">Phone (Home):</label>';
    adduser+='                                    <input class = "form-control" type = "text" name = "primary_phone" id = "primary_phone" maxlength="16" pattern="[+]?[1]?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}" oninvalid="setCustomValidity(\'Invalid phone number.\')" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                                <div class = "col-sm-2 stoppaddingleft">';
    adduser+='                                    <label class = "control-label">Ext:</label>';
    adduser+='                                    <input class = "form-control" type = "text" name = "primary_extension" id = "primary_extension" maxlength="6" pattern="[+]?[1]?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}" oninvalid="setCustomValidity(\'Invalid Extension.\')" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                                <div class = "form-group col-sm-3 stoppaddingright">';
    adduser+='                                        <label class = "control-label">Phone (Cell):</label>';
    adduser+='                                    <input class = "form-control" type = "text" name = "secondary_phone" id = "secondary_phone" maxlength="16" pattern="[+]?[1]?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}" oninvalid="setCustomValidity(\'Invalid phone number.\')" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                                <div class = "form-group col-sm-2 stoppaddingleft">';
    adduser+='                                    <label class = "control-label">Ext:</label>';
    adduser+='                                    <input class = "form-control" type = "text" name = "secondary_extension" id = "secondary_extension" maxlength="6" pattern="[+]?[1]?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}" oninvalid="setCustomValidity(\'Invalid Extension.\')" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    adduser+='                                </div>';
    adduser+='                            </div>';
    //emergency contacts
    adduser+='                            <div class = "row">';
    adduser+='                               <div class = "col-sm-offset-1 col-sm-5">';
    adduser+='                                    <h4>Emergency Contacts <span class = "normalfont">(Minimum 1)</span></h4>';
    adduser+='                                </div>';
    adduser+='                            </div>';
    for(var i=1; i <= 3; i++) {
        adduser+='<div id = "contact' + i + '"';
        if (i != 1) {
            adduser+=' class = "hidden col-sm-offset-1"';
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
        adduser+='        <div class = "form-group col-sm-3 stoppaddingright">';
        adduser+='            <label><span class="requiredasterisk">*</span>Phone:</label>';
        adduser+='            <input type = "text" class = "form-control reqIn required" name = "ephone' + i + '" id = "ephone' + i + '" maxlength="16" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}"';
        if (i == 1) {
            adduser+=' required';
        }
        adduser+='>';
        adduser+='        </div>';
        adduser+='        <div class = "form-group col-sm-2 stoppaddingleft">';
        adduser+='            <label class="control-label">Ext.</label>';
        adduser+='            <input type="text" class="form-control" type="text" name="ephoneext' + i + '" id="ephoneext' + i + '" maxlength="6" pattern="[+]?[1]?[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}" oninvalid="setCustomValidity(\'Invalid Extension.\')" onchange="try{setCustomValidity("")}catch(e){}">';
        adduser+='        </div>';
        adduser+='    </div>';
        adduser+='</div>';
    }
    adduser+='                                <div class="row">';
    adduser+='                                    <div class = " col-sm-offset-1 col-sm-5">';
    adduser+='                                        <button type = "button" class= "btn btn-info" onclick="addcontact()" id = "addbutton">Add another contact</button>';
    adduser+='                                    </div>';
    adduser+='                                    <div class = "col-sm-5">';
    adduser+='                                        <button type = "button" class= "btn btn-info hidden btnedit" onclick="removecontact()" id = "removebutton">Remove a contact</button>';
    adduser+='                                    </div>';
    adduser+='                                    </div>';
    adduser+='                                <div class = "row signupbuttons">';
    adduser+='                                    <div class = "col-sm-offset-1 col-sm-5">';
    adduser+='                                        <button type = "button" class = "btn btn-warning " id="back" href="#myCarousel" data-slide="prev">&larr; &nbsp;&nbsp; &nbsp; Back </button>';
    adduser+='                                    </div> ';
    adduser+='                                    <div class = "register-button col-sm-5">';
    adduser+='                                        <button type = "button" class = "btn btn-success" name="btnsubmit" onclick="signup()" id="btnsubmit">Complete Signup</button>';
    adduser+='                                    </div>';
    adduser+='                                </div>';
    adduser+='                         </div><!--panelbody-->';
    adduser+='                    </div><!--panel-default-->';
    adduser+='                                    </div><!--third item end-->';
    adduser+='                                </div><!--carousel inner end-->';
    adduser+='                            </div><!--Carousel End-->';
    adduser+='                            </form>';
    adduser+='                        </div> <!-- page-content-wrapper -->';
    adduser+='                    </div> <!-- tab-pane -->';

    //Limited user's tab
    var limiteduser='';
    limiteduser+='                    <div class="tab-pane" id="addlimiteduser">';
    limiteduser+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    limiteduser+='                            <form name="limiteduser" action = "/volunteer/addlimited" method = "post" role = "form" id= "limiteduser">';
    limiteduser+='                            <input type="hidden" name="_csrf" value="' + csrfmeta.attr("content") + '" id="_csrf">';
    limiteduser+='                            <h3>Add Limited User</h3>';
    //The first name and last name input
    limiteduser+='                            <div class = "row">';
    limiteduser+='                                <div class = "form-group col-sm-5">';
    limiteduser+='                                    <label><span class="requiredasterisk">*</span>First Name:</label>';
    limiteduser+='                                    <input type = "text" class = "form-control reqIn" name = "limited_fname" id = "limited_fname" placeholder="eg. Bob" required pattern="[a-zA-Z0-9. ]+">';
    limiteduser+='                                </div>';
    limiteduser+='                                <div class = "form-group col-sm-5">';
    limiteduser+='                                    <label><span class="requiredasterisk">*</span>Last Name:</label>';
    limiteduser+='                                    <input type = "text" class = "form-control reqIn" name = "limited_lname" id = "limited_lname" placeholder="eg. Smith" required pattern="[a-zA-Z0-9. ]+">';
    limiteduser+='                                </div>';
    limiteduser+='                            </div>';

    //The row for email and phone number input
    limiteduser+='                            <div class = "row">';
    limiteduser+='                                <div class="form-group col-sm-5">';
    limiteduser+='                                    <label class="control-label"><span class="requiredasterisk">*</span>Email:</label>';
    limiteduser+='                                    <input class = "form-control reqIn" type="email" name = "limited_email" id="limited_email" onchange =" delayEmail();"placeholder="Enter email" required pattern="[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b">';
    limiteduser+='                                </div>';
    limiteduser+='                                <div class = "form-group col-sm-3 stoppaddingright">';
    limiteduser+='                                    <label class = "control-label">Phone:</label>';
    limiteduser+='                                    <input class = "form-control" type = "text" name = "limited_primary_phone" id = "limited_primary_phone" maxlength="16" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid phone number.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    limiteduser+='                                </div>';
    limiteduser+='                                <div class = "form-group col-sm-2 stoppaddingleft">';
    limiteduser+='                                    <label class = "control-label">Ext:</label>';
    limiteduser+='                                    <input class = "form-control" type = "text" name = "limited_primary_extension" id = "limited_primary_extension" maxlength="6" pattern="[+]?[1]?[\\s-]?[0-9]{3}[\\s-]?[0-9]{3}[\\s-]?[0-9]{4}" oninvalid="setCustomValidity("Invalid Extension.")" onchange="try{setCustomValidity("")}catch(e){}"><!--Character restrictions-->';
    limiteduser+='                                </div>';
    limiteduser+='                            </div>';

    //Submit button
    limiteduser+='                            <div class = "row">';
    limiteduser+='                                <div class = "col-sm-10 text-right">';
    limiteduser+='                                    <button type = "button" class = "btn btn-success" onclick="submitLimitedUser()">Add</button>';
    limiteduser+='                                </div>';
    limiteduser+='                            </div>';
    limiteduser+='                            </form>';
    limiteduser+='                        </div>';
    limiteduser+='                    </div>';

    //Add User To Course tab
    var addusertocourse='';
    addusertocourse+='                    <div class="tab-pane" id="addusertocourse">';
    addusertocourse+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    addusertocourse+='                            <h3>Add User To Course</h3>';
    addusertocourse+='                            <p>Please click here to add a user to a course.</p>';
    addusertocourse+='                            <button type = "button" class= "btn btn-success">Add User</button>';
    addusertocourse+='                        </div>';
    addusertocourse+='                    </div>';

    //Add Course tab
    var addcourse='';
    addcourse+='            <div class="tab-pane" id="addcourse">';
    addcourse+='                <div id="page-content-wrapper" class="container-fluid xyz">';
    addcourse+='                <form name="frm" role = "form" id="courseform" onsubmit="validateCourse();return false">';
    addcourse+='                    <h3>Add Course</h3>';

    //The Course name and code input
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-4">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Course Name:</label>';
    addcourse+='                            <input type = "text" class = "form-control" name = "addcoursename" id = "addcoursename" required>';
    addcourse+='                        </div>';
    addcourse+='                        <div class = "form-group col-sm-4">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Course Code:</label>';
    addcourse+='                            <input type = "text" class = "form-control" name = "addcoursecode" id = "addcoursecode" required>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //The Course's cost and capacity input
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-4">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Cost:</label>';
    addcourse+='                            <input type = "number" class = "form-control" name = "addcost" id = "addcost" required>';
    addcourse+='                        </div>';
    addcourse+='                        <div class = "form-group col-sm-4">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Maximum Capacity:</label>';
    addcourse+='                            <input type = "number" class = "form-control" name = "course_limit" id = "course_limit" required>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //The Language input
    addcourse+='                    <div class = "row" id="language1">';
    addcourse+='                        <div class = "form-group col-sm-4">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Offered Language:</label>';
    addcourse+='                            <input type = "text" class = "form-control" name = "course_language1" id = "course_language1" required>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //Buttons to add or remove language input boxes
    addcourse+='                            <button type = "button" class= "btn btn-default" id = "addlanguage" onClick="nextLanguages()">Add Another Language</button>';
    addcourse+='                            <button type = "button" class= "btn btn-default" id = "removelanguage" onClick="removeLanguages()">Remove Language</button>';
    
    //The Target Audience input
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-8">';
    addcourse+='                            <label class = "targetmargin"><span class="requiredasterisk">*</span>Target Audience:</label>';
    addcourse+='                            <input type = "text" class = "form-control" name = "addtarget" id = "addtarget" required>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //The Description Box
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-8">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Description:</label>';
    addcourse+='                            <textarea class = "form-control" rows = "6" name = "adddescription" id = "adddescription"></textarea>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //The Notes Box
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-8">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Notes:</label>';
    addcourse+='                            <textarea class = "form-control" rows = "4" name = "course_notes" id = "course_notes"></textarea>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //The Instructor's name and username input
    addcourse+='                   <div class = "row">';
    addcourse+='                       <div class = "form-group col-sm-4">';
    addcourse+='                           <label><span class="requiredasterisk">*</span>Instructor\'s Name:</label>';
    addcourse+='                            <input type = "text" class = "form-control" name = "instructor_name" id = "instructor_name" required>';
    addcourse+='                       </div>';
    addcourse+='                       <div class = "form-group col-sm-4">';
    addcourse+='                           <label><span class="requiredasterisk">*</span>Instructor\'s Username:</label>';
    addcourse+='                            <input type = "text" class = "form-control" name = "instructor_username" id = "instructor_username" required>';
    addcourse+='                       </div>';
    addcourse+='                   </div>';

    //The Instructor Biography box
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-8">';
    addcourse+='                            <label><span class="requiredasterisk">*</span>Instructor Biography:</label>';
    addcourse+='                            <textarea class = "form-control" rows = "6" name = "instructor_bio" id = "instructor_bio"></textarea>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //The Date of when the course starts and ends
    addcourse+='                   <div class = "row">';
    addcourse+='                    <div class = "form-group col-sm-8">';
    addcourse+='                        <label class = "addcoursepadding"><span class="requiredasterisk">*</span>Date:</label><br>';
    //addcourse+='                        <label class = "addcoursepadding"><span class="requiredasterisk">*</span>Date:</label><label id="addstartdate-error" id="addenddate-error" class="error" for="addstartdate addenddate"></label><br>';
    //addcourse+='<label id="addenddate-error" class="error hidden" for="addenddate">This field is required.</label>';

    //Choose range of startdate and end date
    addcourse+='                        <div class="input-daterange input-group rangedatepicker">';
    addcourse+='                            <input type="text" class="input-sm-4 form-control" name="addstartdate" id="addstartdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    addcourse+='                            <span class="input-group-addon">to</span>';
    addcourse+='                            <input type="text" class="input-sm-4 form-control" name="addenddate" id="addenddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    addcourse+='                        </div>';

    //Generates custum errors for rangedatepicker
    addcourse+='                        <label id="addstartdate-error" class="error" for="addstartdate"></label>';
    addcourse+='                        <label id="addenddate-error" class="error alignparent" for="addenddate"></label>';

    addcourse+='                    </div>';
    addcourse+='                   </div>';

    //Class Interval input
    addcourse+='                    <div class = "row">';
    addcourse+='                        <div class = "form-group col-sm-4" required>';
    addcourse+='                            <label class="addcoursepadding"><span class="requiredasterisk">*</span>Class Interval:</label><label id="addinterval-error" class="error" for="addinterval"></label><br>';
    addcourse+='                            <label class="radio-inline">';
    addcourse+='                              <input type="radio" name="addinterval" id="addinterval" value="weekly" checked="checked">Weekly';
    addcourse+='                            </label>';
    addcourse+='                            <label class="radio-inline">';
    addcourse+='                              <input type="radio" name="addinterval" id="addinterval" value="bi-weekly">Bi-Weekly';
    addcourse+='                            </label>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //Add Course's days and time
    addcourse+='                    <div class = "row" name="day0" id="day0">';  //Cannot be delete tag for reference
    addcourse+='                        <div>';
    addcourse+='                         <label class="form-group col-sm-4">Course Days:</label>';
    addcourse+='                         <label class="form-group col-sm-2">Start Time:</label>';
    addcourse+='                         <label class="form-group col-sm-2">End Time:</label><br>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //Dropdown for the days
    addcourse+='                    <div class = "row" name="day1" id="day1">';
    addcourse+='                        <div class = "form-group col-sm-4" required>';
    addcourse+='                         <select class="form-control" name="day-of-week1" id="day-of-week1">';
    addcourse+='                             <option value="">Select a day</option>';
    addcourse+='                             <option value="Monday">Monday</option>';
    addcourse+='                             <option value="Tuesday">Tuesday</option>';
    addcourse+='                             <option value="Wednesday">Wednesday</option>';
    addcourse+='                             <option value="Thursday">Thursday</option>';
    addcourse+='                             <option value="Friday">Friday</option>';
    addcourse+='                             <option value="Saturday">Saturday</option>';
    addcourse+='                             <option value="Sunday">Sunday</option>';
    addcourse+='                         </select>';
    addcourse+='                        </div>';

    //time_element for start time
    addcourse+='                        <div class = "form-group col-sm-2" required>';
    addcourse+='                             <input type = "text" class = "form-control time_element" name = "starttime1" id = "starttime1" required>';
    addcourse+='                             <label id="starttime1-error" class="error smalltext" for="starttime1" style="display:none;"></label>';
    addcourse+='                        </div>';

    //time_element for end time
    addcourse+='                        <div class = "form-group col-sm-2" required>';
    addcourse+='                             <input type = "text" class = "form-control time_element" name = "endtime1" id = "endtime1" required>';
    addcourse+='                             <label id="endtime1-error" class="error smalltext" for="endtime1" style="display:none;"></label>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //buttons to add more dates
    addcourse+='                    <button type = "button" class= "btn btn-default" id = "addschedule" onClick="addTime()">Add a schedule</button>';
    addcourse+='                    <button type = "button" class= "btn btn-default" id = "removeschedule" onClick="removeTime()">Remove schedule</button>';

    //add hoc days
    addcourse+='                    <div class = "row" name="adhoc0" id="adhoc0">';
    addcourse+='                     <div>';
    addcourse+='                         <label class = "form-group col-sm-4">Ad-Hoc Days:</label>';
    addcourse+='                         <label class = "form-group col-sm-2">Start Time:</label>';
    addcourse+='                         <label class = "form-group col-sm-2">End Time:</label>';
    addcourse+='                     </div>';
    addcourse+='                    </div>';

    //Choose a date
    addcourse+='                   <div class = "row" id="adhoc1">';
    addcourse+='                    <div class = "form-group col-sm-4">';
    addcourse+='                        <div class="input-daterange input-group rangedatepicker">';
    addcourse+='                            <input type="text" class="input-sm-4 form-control" name="adhocstartdate1" id="adhocstartdate1" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    addcourse+='                        </div>';
    addcourse+='                    </div>';

    //time_element for start time
    addcourse+='                    <div class = "form-group col-sm-2" required>';
    addcourse+='                        <input type = "text" class = "form-control time_element" name = "startadhoc1" id = "startadhoc1" required>';
    addcourse+='                        <label id="startadhoc1-error" class="error smalltext" for="startadhoc1" style="display:none;"></label>';
    addcourse+='                    </div>';

    //time_element for end time
    addcourse+='                    <div class = "form-group col-sm-2" required>';
    addcourse+='                        <input type = "text" class = "form-control time_element" name = "endadhoc1" id = "endadhoc1" required>';
    addcourse+='                        <label id="endadhoc1-error" class="error smalltext" for="endadhoc1" style="display:none;"></label>';
    addcourse+='                    </div>';
    addcourse+='                    </div>';

    //buttons to add more dates
    addcourse+='                    <button type = "button" class= "btn btn-default" id = "addadhoc" onClick="addAdhocTime()">Add a custom schedule</button>';
    addcourse+='                    <button type = "button" class= "btn btn-default" id = "removeadhoc" onClick="removeAdhocTime()">Remove schedule</button>';
    addcourse+='                    <div class="row form-group">';
    //addcourses+='                    <br>';

    //submit button
    addcourse+='                        <div class = "col-sm-8 reducepadding">';
    addcourse+='                            <button type = "submit" class= "btn btn-success" id = "validate">Submit</button>';
    addcourse+='                        </div>';
    addcourse+='                    </div>';
    addcourse+='                </form>';
    addcourse+='                </div>';
    addcourse+='            </div>';

    //Modify Course tab
    var modifycourse='';
    modifycourse+='                     <div class="tab-pane" id="modifycourse">';
    modifycourse+='                         <div id="page-content-wrapper" class="container-fluid xyz">';
    modifycourse+='                             <h3>Modify Course</h3>';
    modifycourse+='                                 <p>Please click here to modify a course.</p>';
    modifycourse+='                                 <button type = "button" class= "btn btn-success">Modify</button>';
    modifycourse+='                         </div>';
    modifycourse+='                     </div>';

    //Modify User tab
    var modifyuser='';
    modifyuser+='                    <div class="tab-pane" id="modifyuser">';
    modifyuser+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    modifyuser+='                            <h3>Modify User Info</h3>';
    modifyuser+='                            <p>Please click here to modify a user Information.</p>';
    modifyuser+='                            <button type = "button" class= "btn btn-success">Modify</button>';
    modifyuser+='                        </div>';
    modifyuser+='                    </div>';

    //Add schedule event tab
    var scheduleevent='';
    scheduleevent+='                <div class="tab-pane" id="scheduleevent">';
    scheduleevent+='                     <div id="page-content-wrapper" class="container-fluid xyz">';
    scheduleevent+='                        <h3>Schedule Event</h3>';
    scheduleevent+='                        <form action="/admin/addEvent" method="post" name="scheduleevent" id="scheduleevent">';
    scheduleevent+='                            <input type="hidden" name="_csrf" value="' + csrfmeta.attr("content") + '" id="_csrf">';

    //Creates the start date and end date inputs
    scheduleevent+='                            <div class = "row">';
    scheduleevent+='                                <div class = "form-group col-sm-6" required>';
    scheduleevent+='                                    <label><span class="requiredasterisk">*</span>Date:</label>';
    scheduleevent+='                                    <div class="input-daterange input-group rangedatepicker">';
    scheduleevent+='                                        <input type="text" class="input form-control" name="startdate" id="startdate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required/>';
    scheduleevent+='                                        <span class="input-group-addon">to</span>';
    scheduleevent+='                                        <input type="text" class="input form-control" name="enddate" id="enddate" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    scheduleevent+='                                    </div>';
    scheduleevent+='                                </div>';

    //Dropdown for the type of event
    scheduleevent+='                                <div class = "form-group col-sm-4">';
    scheduleevent+='                                    <label><span class="requiredasterisk">*</span>Type:</label>';
    scheduleevent+='                                        <select class="form-control" name="eventtype" id="eventtype" required>';
    scheduleevent+='                                            <option value="">Select a type</option>';
    scheduleevent+='                                            <option value="MAINTENANCE">MAINTENANCE</option>';
    scheduleevent+='                                            <option value="SLOW">SLOW</option>';
    scheduleevent+='                                            <option value="EVENT">EVENT</option>';
    scheduleevent+='                                        </select>';
    scheduleevent+='                                </div>';
    scheduleevent+='                            </div>';

    //Creates a message box
    scheduleevent+='                            <div class = "row">';
    scheduleevent+='                                <div class = "form-group col-sm-10">';
    scheduleevent+='                                    <label><span class="requiredasterisk">*</span>Description:</label>';
    scheduleevent+='                                    <textarea class = "form-control" rows = "3" name = "message" id = "message" required></textarea>';
    scheduleevent+='                                </div>';
    scheduleevent+='                            </div>';

    //submit button
    scheduleevent+='                            <div class = "row">';
    scheduleevent+='                                <div class = "col-sm-8">';
    scheduleevent+='                                    <button type = "button" onclick="makeEvent()" class= "btn btn-success eventsubmit" id = "validate">Submit</button>';
    scheduleevent+='                                </div>';
    scheduleevent+='                            </div>';
    scheduleevent+='                        </form>';
    scheduleevent+='                    </div>';
    scheduleevent+='                </div>';

    //Change rank tab
    var changerank='';
    changerank+='                    <div class="tab-pane" id="changerank">';
    changerank+='                        <div id="page-content-wrapper" class="container-fluid xyz">';
    changerank+='                            <h3>Change User Rank</h3>';
    changerank+='                            <p>Please click here to change a user\'s rank.</p>';
    changerank+='                            <button type = "button" class= "btn btn-success">Change</button>';
    changerank+='                        </div>';
    changerank+='                    </div>';

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
    $('.rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
    $('.time_element').timepicki({start_time: ["12", "00", "PM"]});
    $.validator.setDefaults({
        ignore: [],
    });
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Invalid symbols."
    );
    $('#courseform').validate({
        rules: {
            addcoursename: {
                required: true,
                minlength: 3,
                maxlength: 40,
            },
            addcoursecode: {
                required: true,
                maxlength: 20
            },
            addcost: {
                required: true,
                number: true
            },
            course_limit: {
                maxlength: 4
            },
            course_language1: {
                required: true,
                maxlength: 20
            },
            addtarget: {
                required: true,
                minlength: 1,
                maxlength: 100
                // sanitize/escape symbols
            },
            adddescription: {
                required: true
                // sanitize
            },
            instructor_name: {
                required: true,
                regex: "^[\\w'. \-]+$", // Alphanumeric and '.- and space
                maxlength: 64
                // also sanitize
            },
            instructor_username: {
                maxlength: 15,
                regex: "^\\w+$"
            },
            instructor_bio: {
                required: true
                // sanitize
            },
            addstartdate: {
                required: true
            },
            addenddate: {
                required: true
            },
            addinterval: {
                required: true
            },
            starttime: {
                required: true
            }
        }
    });

    //validate for limited users
    $('#limiteduser').validate({
        rules: {
            limited_fname: {
                required: true
            },
            limited_lname: {
                required: true
            },
            limited_email: {
                required: true
            }
        }
    });

    //validate for limited users
    $('#scheduleevent').validate({
        rules: {
            startdate: {
                required: true
            },
            enddate: {
                required: true
            },
            eventtype: {
                required: true
            },
            message: {
                required: true
            }
        }
    });
}

//Creates the limited users
function submitLimitedUser(){
    if ($("#limiteduser").valid()) {
        $.post("/volunteer/addlimited",{
            "lname":$('#limited_lname').val(),
            "fname":$('#limited_fname').val(),
            "primary_phone":$('#limited_primary_phone').val(),
            "primary_extension":$('#limited_primary_extension').val(),
            "email": $('#limited_email').val(),
            "_csrf": $('#_csrf').val()
        })
        .done(function (res){
            swal({
                title: res,
                type: "success"
            });
        })
        .fail(function (err){
            swal({
                title: "Signup was not valid",
                type: "error"
            });
        });
        window.onbeforeunload = null;
    }
}


//Creates the Schedule Event
function makeEvent(){
    if ($("#scheduleevent").valid()) {
    }
}
//==============================
//ADD/REMOVE Languages
//==============================
//==============================
//reset onpage refresh
var COUNTLANGUAGE=1;

function nextLanguages(){
    console.log("Adding " + COUNTLANGUAGE + " languages.");

    var newLanguage=COUNTLANGUAGE+1;

    var language='';
    language+='                    <div class = "row" id="language' + newLanguage +'" style="display:none;">';
    language+='                        <div class = "form-group col-sm-4">';
    language+='                            <label><span class="requiredasterisk">*</span>Offered Language:</label>';
    language+='                            <input type = "text" class = "form-control" name = "course_language' + newLanguage + '" id = "course_language' + newLanguage + '">';
    language+='                        </div>';
    language+='                    </div>';

    $('#language'+COUNTLANGUAGE).after(language);
    $('#language'+newLanguage).slideToggle();

    // Adds rules to the new language
    $("#course_language" + newLanguage).rules("add", {
        required: true,
        minlength: 1,
        maxlength: 20
    });
    COUNTLANGUAGE++;
}

function removeLanguages(){
    if(COUNTLANGUAGE > 1){
        console.log("Removing " + COUNTLANGUAGE + " languages.");
        $('#language'+COUNTLANGUAGE).slideToggle(function(){
            $('#language'+COUNTLANGUAGE).remove();
            COUNTLANGUAGE--;
        });
    }
    else{
        console.log("Cannot Remove Default Language");
    }
}

//==============================
//ADD/REMOVE Scheduled Days
//==============================
//==============================
//reset onpage refresh
var COUNTCOURSEDAYS=1;

function addTime(){
    console.log("Adding " + COUNTCOURSEDAYS + " Course Time.");

    var newCourseDay=COUNTCOURSEDAYS+1;

    var day='';
    day+='                    <div class = "row" name="day'+ newCourseDay +'" id="day'+ newCourseDay +'" style="display:none;">';
    day+='                        <div class = "form-group col-sm-4">';
    day+='                          <select class="form-control" name="day-of-week'+ newCourseDay +'" id="day-of-week'+ newCourseDay +'" required>';
    day+='                              <option value="">Select a day</option>';
    day+='                              <option value="Monday">Monday</option>';
    day+='                              <option value="Tuesday">Tuesday</option>';
    day+='                              <option value="Wednesday">Wednesday</option>';
    day+='                              <option value="Thursday">Thursday</option>';
    day+='                              <option value="Friday">Friday</option>';
    day+='                              <option value="Saturday">Saturday</option>';
    day+='                              <option value="Sunday">Sunday</option>';
    day+='                          </select>';
    day+='                        </div>';
    day+='                         <div class = "form-group col-sm-2">';
    day+='                              <input type = "text" class = "form-control time_element" name = "starttime'+ newCourseDay + '" id = "starttime'+ newCourseDay +'" required>';
    day+='                              <label id="starttime' + newCourseDay + '-error" class="error smalltext" for="starttime' + newCourseDay + '" style="display:none;"></label>';
    day+='                        </div>';
    day+='                         <div class = "form-group col-sm-2">';
    day+='                              <input type = "text" class = "form-control time_element" name = "endtime'+ newCourseDay +'" id = "endtime'+ newCourseDay +'" required>';
    day+='                              <label id="endtime' + newCourseDay + '-error" class="error smalltext" for="endtime' + newCourseDay + '" style="display:none;"></label>';
    day+='                        </div>';
    day+='                    </div>';

    $('#day'+ COUNTCOURSEDAYS).after(day);
    $('#day'+ newCourseDay).slideToggle();
    $('.time_element').timepicki({start_time: ["12", "00", "PM"]});
    COUNTCOURSEDAYS++;
}

function removeTime(){
    if(COUNTCOURSEDAYS > 0){
        console.log("Removing " + COUNTCOURSEDAYS + " Course Time.");
        $('#day'+COUNTCOURSEDAYS).slideToggle(function(){
            $('#day'+COUNTCOURSEDAYS).remove();
            COUNTCOURSEDAYS--;
        });
    }
    else{
        console.log("Cannot Remove Default Time.");
    }
}

//==============================
//ADD/REMOVE Scheduled Days
//==============================
//==============================
//reset onpage refresh
var COUNTADHOCDAYS=1;

function addAdhocTime(){
    console.log("Adding " + COUNTADHOCDAYS + " AD-HOC Course Time.");

    var newAdhocDay=COUNTADHOCDAYS+1;

    var adhoc='';
    adhoc+='                   <div class = "row" id="adhoc'+ newAdhocDay +'" style="display:none;">';
    adhoc+='                    <div class = "form-group col-sm-4">';
    adhoc+='                        <div class="input-daterange input-group rangedatepicker">';
    adhoc+='                            <input type="text" class="input-sm-4 form-control" name="adhocstartdate'+ newAdhocDay +'" id="adhocstartdate'+ newAdhocDay +'" placeholder="YYYY/MM/DD" data-date-end-date="0d" required />';
    adhoc+='                        </div>';
    adhoc+='                    </div>';
    adhoc+='                    <div class = "form-group col-sm-2" required>';
    adhoc+='                           <input type = "text" class = "form-control time_element" name = "startadhoc'+ newAdhocDay +'" id = "startadhoc'+ newAdhocDay +'" required>';
    adhoc+='                           <label id="startadhoc' + newAdhocDay + '-error" class="error smalltext" for="startadhoc' + newAdhocDay + '" style="display:none;"></label>';
    adhoc+='                    </div>';
    adhoc+='                    <div class = "form-group col-sm-2" required>';
    adhoc+='                           <input type = "text" class = "form-control time_element" name = "endadhoc'+ newAdhocDay +'" id = "endadhoc'+ newAdhocDay +'" required>';
    adhoc+='                           <label id="endadhoc' + newAdhocDay + '-error" class="error smalltext" for="endadhoc' + newAdhocDay + '" style="display:none;"></label>';
    adhoc+='                    </div>';
    adhoc+='                   </div>';

    $('#adhoc'+COUNTADHOCDAYS).after(adhoc);
    $('#adhoc'+newAdhocDay).slideToggle();
    $('.time_element').timepicki({start_time: ["12", "00", "PM"]});
    $('.rangedatepicker').not('.hasDatePicker').datepicker({format: 'yyyy/mm/dd', startDate: '1900/01/01'});
    COUNTADHOCDAYS++;
}

function removeAdhocTime(){
    if(COUNTADHOCDAYS > 0){
        console.log("Removing " + COUNTADHOCDAYS + " Course Time.");
        $('#adhoc'+COUNTADHOCDAYS).slideToggle(function(){
            $('#adhoc'+COUNTADHOCDAYS).remove();
            COUNTADHOCDAYS--;
        });
    }
    else{
        console.log("Cannot Remove Default Adhoc Schedule.");
    }
}

function validateCourse(){
    var languages = addLanguages();
    var scheduled_days = addSchedule();
    var adhoc_days = addAdhoc();

    //$("#courseform").slideToggle();
    $.post("/staff/portal/validateCourse",{
        "course_name": $('#addcoursename').val(),
        "course_code": $('#addcoursecode').val(),
        "addcost":$('#addcost').val(),
        "course_limit":$('#course_limit').val(),
        "languages": languages,
        "addtarget": $('#addtarget').val(),
        "adddescription":$('#adddescription').val(),
        "instructor_name":$('#instructor_name').val(),
        "instructor_username":$('#instructor_username').val(),
        "instructor_bio":$('#instructor_bio').val(),
        "addstartdate":$('#addstartdate').val(),
        "addenddate":$('#addenddate').val(),
        "addinterval":$('#addinterval:checked').val(),
        "notes":$('#course_notes').val(),
        "course_days": scheduled_days,
        "adhoc_days": adhoc_days,
        "_csrf": $('#_csrf').val()
    })
    .done(function (res){
        submitCourse();
    })
    .fail(function (err){
        //$("#courseform").slideToggle();
        swal({
            title: err.responseText,
            type: "error"
        });

    });
    //$("#courseform").submit();
}

function submitCourse(){
    var languages = addLanguages();
    var scheduled_days = addSchedule();
    var adhoc_days = addAdhoc();

    $.post("/staff/portal/addCourse",{
        "addcoursecode":$('#addcoursecode').val(),
        "addcoursename":$('#addcoursename').val(),
        "addcost":$('#addcost').val(),
        "course_limit":$('#course_limit').val(),
        "languages": languages,
        "addtarget": $('#addtarget').val(),
        "adddescription":$('#adddescription').val(),
        "instructor_name":$('#instructor_name').val(),
        "instructor_username":$('#instructor_username').val(),
        "instructor_bio":$('#instructor_bio').val(),
        "addstartdate":$('#addstartdate').val(),
        "addenddate":$('#addenddate').val(),
        "addinterval":$('#addinterval:checked').val(),
        "notes":$( '#course_notes' ).val(),
        "course_days": scheduled_days,
        "adhoc_days": adhoc_days,
        "_csrf": $('#_csrf').val()
    })
    .done(function (res){
        swal({
            title: res,
            type: "success"
        });
    });
}

//-----------------------------------------------
//-------Intermediate JSON Creator Functions-----
//-------/AddCourses-----------------------------
//-----------------------------------------------

function addLanguages(){
    var languages = [];
    for(var i=1; i<=COUNTLANGUAGE; i++){
        languages.push($("#course_language"+i).val());
    }

    return languages;
}

function addSchedule(){
    var scheduled_days = [];

    for(var i=1; i<=COUNTCOURSEDAYS; i++){
        var day_of_week = $('#day-of-week'+i).val();
        var start_time = $('#starttime'+i).val();
        var end_time = $('#endtime'+i).val();

        var day = {
            "day":day_of_week,
            "start_time":start_time,
            "end_time":end_time
        }

        scheduled_days.push(JSON.stringify(day));
    }

    return scheduled_days;
}

function addAdhoc(){
    var adhoc_days = [];

    for(var i=1; i<=COUNTADHOCDAYS; i++){
        var date = $('#adhocstartdate'+i).val();
        var start_time = $('#startadhoc'+i).val();
        var end_time = $('#endadhoc'+i).val();

        var day = {
            "day":date,
            "start_time":start_time,
            "end_time":end_time
        }

        adhoc_days.push(JSON.stringify(day));
    }

    return adhoc_days;
}
