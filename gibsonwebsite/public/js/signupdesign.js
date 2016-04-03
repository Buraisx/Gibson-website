 $(document).ready(function(){
        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })
        var contacts = 0;
    //CONTACT INFO HEIGHT
    $('#add').click(function(){
        contacts ++;
        $('#myCarousel').animate({height: '+=300'});
    });

    //STUDENT CHECKBOX HEIGHT
    var isStudent = true;
    $('#student').click(function(){
        if(!isStudent)
        {
            //set heightt 1000.log
            console.log('student false')
            //isstundet = true
            isStudent = true
            $('#myCarousel').animate({height: 700});
        }
        else
        {
            console.log('student true')
            isStudent = false
            $('#myCarousel').animate({height: 1000});
        }

        
    });

    
    $('#remove').click(function(){
        $('#myCarousel').animate({height: '-=300'});
    });

$('#back').click(function(){
        $('#myCarousel').animate({height: 700});
    });

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
        console.log(count);
    });

});//END
function progress(percent, $element) 
{
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 500);
}
