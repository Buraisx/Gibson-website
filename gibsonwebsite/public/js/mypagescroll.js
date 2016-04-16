 $(document).ready(function(){
            $('.scroll').click(function() {
        event.preventDefault();
            $('html,body').animate({ 
                scrollTop: $(this.hash).offset().top 
            } , 1000);
    } );
});