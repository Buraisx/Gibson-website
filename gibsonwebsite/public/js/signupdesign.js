 $(document).ready(function(){
    $('#addbutton').click(function(){
        $('#myCarousel').animate({height: '+=300'});
    });
    $('#removebutton').click(function(){
        $('#myCarousel').animate({height: '-=300'});
    });
    $('#student').click(function(){
        $('#myCarousel').animate({height: 1000});
    });
    $('#back').click(function(){
    	$('#myCarousel').animate({height: 700});
    });
 });
 window.onload = progress(33,$('#progressBar'));
 function progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 500);
}