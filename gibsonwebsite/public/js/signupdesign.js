var destinationstep = 1;
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
            $('#schoolname').addClass('reqIn');
            $('#grade').addClass('reqIn');
            $('#myCarousel').animate({height: 1000});
        }
        else
        {
            $('#schoolname').removeClass('reqIn');
            $('#grade').removeClass('reqIn');
            $('#myCarousel').animate({height: 700});
        }
    });

    $('#removebutton').click(function(){
        $('#myCarousel').animate({height: '-=' + ECONTACTHEIGHTSTR});
    });

    //checks for captcha
   /* $('#btnsubmit').click(function(){
            grecaptcha.reset();
            $(document).find('#dimmer').css("display","block");
            $(document).find('.g-recaptcha').css("display","block");
    });*/
    //clicking on dim section will cancel captcha
    $('#dimmer').click(function(){
        $(document).find('#dimmer').css("display","none");
        $(document).find('.g-recaptcha').css("display","none");
    });


    //CHECK EVERY TEXTBOX FILLED IN
    $('.btn-success').click(function (){
        var count = 0;
        var butparents = $(this).parent().parent().parent();

        butparents.find('input.reqIn').each(function (){
            escapeHtml(this.id);
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
        var i = 1;
            // Iterates through every contact, checking if they're visible
            while($("#contact" + i).is(":visible")) {
            i++;
        }

        if (this.id == "btnsubmit")
        {

            if((count == 8 && i==2)||(count ==4 && i==3)|| (count ==0 &&i==4))
            {
                grecaptcha.reset();
                $(document).find('#dimmer').css("display","block");
                $(document).find('.g-recaptcha').css("display","block");
            }
        }
        else
        {
            if(count == 0)
            {
                butparents.find('.btn-success').attr('data-slide', 'next');
            }
        }

    });

});//END



$('#myCarousel').bind('slide.bs.carousel', function (e) {
    if (destinationstep == 1){
        if (document.getElementById('student').checked) {
            setTimeout(function(){
                $('#myCarousel').animate({height: 700});
            }, WAITTIME);
        }
    }
    else if (destinationstep == 2){
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
    }
    else if (destinationstep == 3){
        var contactheight = getContactInfoHeight();
        setTimeout(function(){
            $('#myCarousel').animate({height: contactheight});
        }, WAITTIME);
    }
});

// Next Step button of Step 1 and Back button of Step 3
$('.topage2').click(function() {
    destinationstep = 2;
});

// Back button of Step 2
$('#topage1').click(function() {
    destinationstep = 1;
});

// Next Step button of Step 2
$('#topage3').click(function() {
    destinationstep = 3;
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
