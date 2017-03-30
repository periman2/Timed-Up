$(document).ready(function() {
    $(".loginform").delay(5000).fadeIn(2000);
    $("#login").click(function(){
        $(".signupform").fadeOut(400);
        $(".loginform").delay(400).fadeIn(500);
    });     
    $("#register").click(function(){
        $(".loginform").fadeOut(400);
        $(".signupform").delay(400).fadeIn(500);
    });
});