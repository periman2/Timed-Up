$(document).ready(function(){

    $(".smcursor, .bigcursor").fadeIn(3000);
    
    setTimeout(function(){
        $(".smcursor").addClass("firstanimationsm");
        $(".bigcursor").addClass("firstanimationlg");
        $(".smcursor").css({"transform":"rotate(0)"});}, 2000);
    
    setTimeout(function(){$(".let").fadeIn(2000)}, 3000);

    var mn = $(".menu");
    var head = $(".header");
    $(window).scroll(function() {
        if($(this).scrollTop() > 100){
            head.fadeOut(200);
            $(".let").fadeOut(200)
        } else {
            head.fadeIn(200);
            $(".let").fadeIn(2000)
        }

        if($(this).scrollTop() > 250){
            mn.addClass("menu-scrolled");
        } else {
            mn.removeClass("menu-scrolled");
        }
    });
});