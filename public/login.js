$(document).ready(function() {
    $(".loginform").delay(5000).fadeIn(1000);
    $("#login").click(function(){
        $(".signupform").fadeOut(400);
        $(".loginform").delay(400).fadeIn(500);
    });     
    $("#register").click(function(){
        $(".loginform").fadeOut(400);
        $(".signupform").delay(400).fadeIn(500);
    });

  $(".smcursor, .bigcursor").fadeIn(3000);
  
  setTimeout(function(){
    $(".smcursor").addClass("firstanimationsm");
    $(".bigcursor").addClass("firstanimationlg");
    $(".smcursor").css({"transform":"rotate(0)"});}, 2000);
  
  setTimeout(function(){$(".let").fadeIn(2000)}, 3000);
});