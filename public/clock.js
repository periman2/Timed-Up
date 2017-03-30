$(document).ready(function(){
    var degreesofbig = 0;
    var degreesofsmall = 0;
    var smcurs = $(".smcursor")[0];
    var value = window.getComputedStyle(smcurs, null);
    var rotation = value.getPropertyValue("transform");
    var bgcurs = $(".bigcursor")[0];
    var value2 = window.getComputedStyle(bgcurs, null);
    var rotation2 = value2.getPropertyValue("transform");
    var angleofsmall = getangle(rotation) - 90;
    var angleofbig = getangle(rotation2) + 180;
    var hovered = true;
    var hoveredoff = 0;



    function liveclock(){
        var mom = moment().format("hh:mm:ss");
        var decimalhours = moment.duration(mom).asHours();
        var mins = new Date().getMinutes();
        if(decimalhours > 12){
            decimalhours -=12 
        }
        degreesofsmall = 90 + (decimalhours * 360) / 12 ;
        degreesofbig = 180 + (mins * 360) / 60 ;
        // console.log(degreesofsmall, degreesofbig);
        $(".smcursor").css({
            "-ms-transform": "translate(80px, -10px) rotate(" + degreesofsmall + "deg)",
            "-ms-transform-origin": "61.2px 31.2px",
            "-webkit-transform": "translate(80px, -10px) rotate(" + degreesofsmall + "deg)",
            "-webkit-transform-origin": "61.2px 31.2px",
            "transform": "translate(80px, -10px) rotate(" + degreesofsmall + "deg)",
            "transform-origin": "61.2px 31.2px"
        });
        $(".bigcursor").css({
            "-ms-transform": "translate(80px, -10px) rotate(" + degreesofbig + "deg)",
            "-ms-transform-origin": "61.2px 31.2px",
            "-webkit-transform": "translate(80px, -10px) rotate(" + degreesofbig + "deg)",
            "-webkit-transform-origin": "61.2px 31.2px",
            "transform": "translate(80px, -10px) rotate(" + degreesofbig + "deg)",
            "transform-origin": "61.2px 31.2px"
        });

        smcurs = $(".smcursor")[0];
        value = window.getComputedStyle(smcurs, null);
        rotation = value.getPropertyValue("transform");
        bgcurs = $(".bigcursor")[0];
        value2 = window.getComputedStyle(bgcurs, null);
        rotation2 = value2.getPropertyValue("transform");
        angleofsmall = getangle(rotation) - 90;
        angleofbig = getangle(rotation2) + 180;
        // console.log(angleofsmall, angleofbig);

    }

    function getangle(rotation){
        var values = rotation.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        return angle;
    }

    liveclock();
    var clock = setInterval(liveclock, 1000);
    $(".mainsvg").click(function(){
        window.location.replace("myschedule");
    });
    $(".mainsvg").hover(function(){
        console.log("hovered", hovered);
        if(hovered){
            hovered = false;
            hoveredfun();
        } else {
            hovered = false;
        }
        
    });

    $(".mainsvg").mouseleave(function(){
        
        if(hovered) {
            unhoveredfun();
        } else {
            if(hoveredoff < 1){
                hoveredoff ++;
                setTimeout(function(){
                    unhoveredfun();
                }, 3000)
            }            
        }
    });

    function hoveredfun(){
        clearInterval(clock);
        $(".smcursor").removeClass("onhoveroff");
        $(".bigcursor").removeClass("onhoveroffbig");
        $(".center").removeClass("onhoveroffcenter");
        $(".smcursor").addClass("onhover");
        $(".bigcursor").addClass("onhoverbig");
        $(".center").addClass("onhovercenter");
        $(".outercircle").fadeOut(1000);
        $(".let").fadeIn(4000);
        setTimeout(function(){
            $(".smcursor").css({
                "-ms-transform": "translate(0, 0) rotate(0)",
                "-ms-transform-origin": "61.2px 31.2px",
                "-webkit-transform": "translate(0, 0) rotate(0)",
                "-webkit-transform-origin": "61.2px 31.2px",
                "transform": "translate(0, 0) rotate(0)",
                "transform-origin": "61.2px 31.2px"
            });
            $(".bigcursor").css({
                "-ms-transform": "translate(0, 0) rotate(0)",
                "-ms-transform-origin": "61.2px 31.2px",
                "-webkit-transform": "translate(0, 0) rotate(0)",
                "-webkit-transform-origin": "61.2px 31.2px",
                "transform": "translate(0, 0) rotate(0)",
                "transform-origin": "61.2px 31.2px"
            });
             $(".center").css({
                "-ms-transform": "translate(0, 0)",
                "-ms-transform-origin": "61.2px 31.2px",
                "-webkit-transform": "translate(0, 0)",
                "-webkit-transform-origin": "61.2px 31.2px",
                "transform": "translate(0, 0)",
                "transform-origin": "61.2px 31.2px"
            });
            hovered = true;

        }, 3000);
    }

    function unhoveredfun() {
        clearInterval(clock);
        $(".let").fadeOut(1000);
        $(".smcursor").removeClass("onhover");
        $(".bigcursor").removeClass("onhoverbig");
        $(".center").removeClass("onhovercenter");
        $(".outercircle").fadeIn(2000);
        $(".smcursor").addClass("onhoveroff");
        $(".bigcursor").addClass("onhoveroffbig");
        $(".center").addClass("onhoveroffcenter");
        setTimeout(function(){
            var smangle = angleofsmall + 90
            var bgangle = angleofbig + 180
            // console.log(smangle, bgangle, "this is angles")
            $(".smcursor").css({
                "-ms-transform": "translate(80px, -10px) rotate(" + smangle + "deg)",
                "-ms-transform-origin": "61.2px 31.2px",
                "-webkit-transform": "translate(80px, -10px) rotate(" + smangle + "deg)",
                "-webkit-transform-origin": "61.2px 31.2px",
                "transform": "translate(80px, -10px) rotate(" + smangle + "deg)",
                "transform-origin": "61.2px 31.2px"
            });
            $(".bigcursor").css({
                "-ms-transform": "translate(80px, -10px) rotate(" + bgangle + "deg)",
                "-ms-transform-origin": "61.2px 31.2px",
                "-webkit-transform": "translate(80px, -10px) rotate(" + bgangle + "deg)",
                "-webkit-transform-origin": "61.2px 31.2px",
                "transform": "translate(80px, -10px) rotate(" + bgangle + "deg)",
                "transform-origin": "61.2px 31.2px"
            });
             $(".center").css({
                "-ms-transform": "translate(80px, -10px)",
                "-ms-transform-origin": "61.2px 31.2px",
                "-webkit-transform": "translate(80px, -10px)",
                "-webkit-transform-origin": "61.2px 31.2px",
                "transform": "translate(80px, -10px) rotate(0)",
                "transform-origin": "61.2px 31.2px"
            });
            hoveredoff = 0;
            clock = setInterval(liveclock, 2000);
        }, 3000);
    }
});