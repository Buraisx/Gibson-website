var page = 1;
var WAITTIME = 150; // Wait time before page shrinks
var ECONTACTHEIGHT = 250; // Height added when a single econtact is added
var ECONTACTHEIGHTSTR = ECONTACTHEIGHT.toString();

$(document).ready(function(){
    $('#addbutton').prop('disabled', false);
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    //CONTACT INFO HEIGHT
    $('#addbutton').click(function(){
        $('#myCarousel').animate({height: '+=' + ECONTACTHEIGHTSTR});
    });

    //STUDENT CHECKBOX HEIGHT
    $('#student').click(function(){
        if(document.getElementById('student').checked)
        {
            //set heightt 1000.log
            console.log('student false')
            $('#myCarousel').animate({height: 1000});
        }
        else
        {
            console.log('student true')
            $('#myCarousel').animate({height: 700});
        }
    });

    $('#removebutton').click(function(){
        $('#myCarousel').animate({height: '-=' + ECONTACTHEIGHTSTR});
    });

    //checks for captcha
    $('#btnsubmit').click(function(){
        $('#frm').submit(function(){
            $(document).find('#dimmer').css("display","block");
            $(document).find('.g-recaptcha').css("display","block");
            return false;
        });
    });
   /* $('#frm').submit(function(e){
    return false;
    });*/

    //CHECK EVERY TEXTBOX FILLED IN
    $('.btn-success').click(function (){ 
        var count = 0;
        var butparents = $(this).parent().parent().parent();

        butparents.find('input.reqIn').each(function (){
            if ($.trim($(this).val()).length == 0)
            {   
                count ++;
                $('.btn-success').parent().parent().parent().find('.btn-success').removeAttr('data-slide');
                $(this).attr('data-toggle', 'tooltip');
                $(this).attr('title', 'Please fill this in.');
                $(this).attr('data-placement','bottom');
                $(this).tooltip('show');
            }
        });
        if(count == 0)
        {
            butparents.find('.btn-success').attr('data-slide', 'next');
        }
    });

});//END

// Next Step button of Step 1 and Back button of Step 3
$('.topage2').click(function() {
    if (document.getElementById('student').checked) {
        $("#student_info").removeClass("hidden").hide().slideDown();
        document.getElementById("schoolname").required = true;
        document.getElementById("grade").required = true;
        setTimeout(function() {
            $('#myCarousel').animate({height: 1000});
        }, WAITTIME);

    }
    else {
        setTimeout(function() {
            $('#myCarousel').animate({height: 700});
        }, WAITTIME);
    }
});

// Back button of Step 2
$('#back2').click(function() {
    if (document.getElementById('student').checked) {
        setTimeout(function(){
            $('#myCarousel').animate({height: 700});
        }, WAITTIME);
    }
});

// Next Step button of Step 2
$('#next2').click(function() {
    var contactheight = getContactInfoHeight();
    setTimeout(function(){
        $('#myCarousel').animate({height: contactheight});
    }, WAITTIME);
});

// Finds the appropriate height for Step 3
function getContactInfoHeight() {
    var contacts = 0; // Number of contacts visible
    var i = 1;
    // Increments contacts while contact i exists and is not hidden
    while((document.getElementById('contact' + i) != null) && (!$('#contact' + i).hasClass('hidden'))) { //
        i++;
        contacts++;
    }
    return 700 + ECONTACTHEIGHT*(contacts-1);
}

function progress(percent, $element) 
{
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 500);
}
function recaptchacallback()
{
   document.getElementById('frm').submit();
}