    $(document).ready(function(){
     //initialize tooltip
        $("[data-toggle='tooltip']").tooltip();
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
    
 $('.btn-success').click(function (){ 
        var count = 0;
        var butparents = $(this).parent().parent().parent();
        console.log(butparents);
        butparents.find('input.reqIn').each(function (){
            if ($.trim($(this).val()).length == 0)
            {   
                count ++;
                console.log(count);
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

});
function studentcheckbox()
{
        if (document.getElementById('student').checked) {
            $("#student_info").removeClass("hidden").hide().slideDown();
            document.getElementById("schoolname").required = true;
            document.getElementById("grade").required = true;

        }else
        {
           $("#student_info").addClass("hidden").hide().slideUp();
            document.getElementById("schoolname").required = false;
            document.getElementById("grade").required = false; 
        }
}