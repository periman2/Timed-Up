$(document).ready(function(){
  $(".smcursor, .bigcursor").fadeIn(3000);
  
  setTimeout(function(){
    $(".smcursor").addClass("firstanimationsm");
    $(".bigcursor").addClass("firstanimationlg");
    $(".smcursor").css({"transform":"rotate(0)"});}, 2000);
  
  setTimeout(function(){$(".let").fadeIn(2000)}, 5000);
});