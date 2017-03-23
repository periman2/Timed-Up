$(document).ready(function() {

    $("#login").click(function(){
        $(".signupform").fadeOut(400);
        $(".loginform").delay(400).fadeIn(500);
    });     
    $("#register").click(function(){
        $(".loginform").fadeOut(400);
        $(".signupform").delay(400).fadeIn(500);
    });
});