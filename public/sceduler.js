

//==============================
//          SCEDULER
//==============================

$(document).ready(function(){
    

    var mdy = new Date()
    var newdate = new Date();
    var value = $('input[name="daterange"]').val();
    var value2 = $('input[name="daterange2"]').val();


    $('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY h:mm A'));
        value = $('input[name="daterange"]').val();
        mdy = value;
        consolelog();
    });

    $('input[name="daterange2"]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY h:mm A'));
        value2 = $('input[name="daterange2"]').val();
        mdy = value2;
        consolelog();
    });

    $('input[name="daterange"]').daterangepicker({
        timePicker: true,
        autoUpdateInput: false,
        "alwaysShowCalendars": true,
        "singleDatePicker": true,
        timePickerIncrement: 5,
        locale: {
            format: 'MM/DD/YYYY h:mm A',
            cancelLabel: 'Clear'
        }
    });

    $('input[name="daterange"]').on("change", function(){
        
    })

    $('input[name="daterange2"]').daterangepicker({
        timePicker: true,
        autoUpdateInput: false,
        "alwaysShowCalendars": true,
        "singleDatePicker": true,
        timePickerIncrement: 5,
        locale: {
            format: 'MM/DD/YYYY h:mm A',
            cancelLabel: 'Clear'
        }
    });

    var hoursfromnow1;
    var hoursfromnow2;
    var expiredarrays = [];


    function consolelog() {
        var formated = moment(value, 'MM/DD/YYYY h:mm A');
        hoursfromnow1 = reverse(moment().diff(formated,"hours", true));
        var formated2 = moment(value2, 'MM/DD/YYYY h:mm A');
        hoursfromnow2 = reverse(moment().diff(formated2,"hours", true));
        console.log(hoursfromnow1 ,hoursfromnow2 );
    }
        

            
    function reverse(num){
        return num - 2 * num;
    }
    function makearray(hours1, hours2) {
        if(!(isNaN(hours1)) && !(isNaN(hours2)) ) {
            if (hours1 < hours2) {
                if (hours1  < 0 || hours2 < 0) {
                    alert("I'm really sorry, time travel isn't possible yet.");
                    return false;
                }
                else { 
                    return [hours1  , hours2];
                }
            }
            else {
                alert("The first date has to be before the second one");
                return false;
            }
        } else {
            alert("Please select a complete range before submiting");
            return false;
        }
    };

    $("#arrays").on("click", ".myarray", function(){
        var arrayid = $(".hidden", this).html();
        deletearray(arrayid);
        
    });

    $(".deletelist").click(function() {
        var friendid= $(this).prev().html();
        $.ajax({
            type: "DELETE",
            url: "/deletefriend", 
            data: {friendid: friendid},
            success: function(result){
                //console.log("deleted!");
                
            }
        })
        location.reload();
        return false;
    });

    function deletearray(arrayid) {
        $.ajax({
            type: "POST",
            url: "/delarray",
            data: {arrayid: arrayid},
            success: function(data){
                console.log("success");
                getarrays();
            },
            error: function(err){
                console.log(err);
            }
        })

    }

    function convertarrays(arrays){
        var newarr = [];
        arrays.forEach(function(array){
            var time = array.time;
            var hours = eval(array.value[0]);
            var dateofexp = moment(time).add(hours,"hours").toISOString();
            var diff = reverse(moment().diff(dateofexp,"hours", true));
            var length = (eval(array.value[1]) - hours)
            if(diff < 0){
                deletearray(array._id)
            } else {
                console.log(dateofexp, length, hours, time);
                newarr.push([dateofexp, length, array._id])
            }
            
        });
        return newarr;
    }   

    function buildarrays(arrays){
        $("#arrays").html("");
        if(arrays.length > 0){
            $("#arrays").append("<h2>Your are available at:</h2>");
        } else {
            $("#arrays").append("<h2>Your free time ranges will all show up here.</h2>");
        }
        

        arrays.forEach(function(daydiff){
            $("#arrays").append(
                "<div class='myarray'><h3>"
                 + moment(daydiff[0]).format('MMMM Do, YYYY h:mm A') + 
                 " for: <br>"
                 + Math.floor(daydiff[1]/24) + 
                 " Days, "
                 + Math.floor(24 * (daydiff[1]/24 - Math.floor(daydiff[1]/24)))
                 + " Hours and "
                 + Math.floor(60 * (daydiff[1] - Math.floor(daydiff[1]))) +
                 " Minutes.</h3><button class='btn btn-danger' >Delete Range</button><p class='hidden'>"
                  + daydiff[2] + 
                  "</p></div><hr>"
            )
        });
        
    }

    function getarrays(){
        $.ajax({
            type: 'GET',
            url: "/getarrays",
            success: function(data){
                //console.log(data.length);
                var newdata = convertarrays(data);
                buildarrays(newdata);
            },
            error: function(err){
                console.log(err);
            }
        });
        return false;
    }

    getarrays();
    
    $("#submit").click(function(){
        var array = makearray(hoursfromnow1,hoursfromnow2);
        var now = moment(newdate).toISOString();
        $.ajax({
            type:"POST",
            url:"/addarray",
            data:{value: array, time: now},
            success: function(data){
                console.log("done it!");
                getarrays();
            },
            error: function(err){
                console.log("something went wrong");
            }
        })
        return false;
    }); 

});  
