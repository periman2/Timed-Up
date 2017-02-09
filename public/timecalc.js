

//==============================
//          TIMECALC
//==============================

$(document).ready(function(){
    var cururl = document.URL;
    var name = cururl.split("/");
    var groupid = name[name.length - 1];

    function reverse(num){
        return num - 2 * num;
    }

    function getmyarrays(){
        $.ajax({
            type: 'GET',
            url: "/getarrays",
            success: function(data){
                console.log(data.length) 
            },
            error: function(err){
                console.log(err);
            }
        });
        return false;
    }

    function show(result){
        var end = finalcompare(this, result);
        console.log("end is : ", end);
        
        if(end.length > 0) {
            $(".besttimes").html("");
            $(".besttimes").append("<h2>This group has common times at those dates: </h2>");
            end.forEach(function(array){
                $(".besttimes").append(
                    "<h3 class='best'>" + 
                    moment().add(array[0],"hours").format('MMMM Do, YYYY h:mm A') + 
                    " for: " + 
                    Math.floor(array[1] - array[0]) + 
                    " hours " +
                    Math.floor(((array[1] - array[0]) - Math.floor(array[1] - array[0])) * 60) +
                    " minutes "
                )
            });
        } else {
            $(".besttimes").html("<h2>This group does not have any common time.</h2>");
        }
    }

    function editarrays(everything){
        var onlyarrays = []
        everything.forEach(function(arrays){
            //console.log(data[0], data[1]);
            var newarray = constractor(arrays);
            onlyarrays.push(newarray[0]);
            console.log("this is it!", newarray);
        });
        //console.log("okaaaay", onlyarrays);
        
        show(onlyarrays);
    }

    function getgrouparrays(){
        $.ajax({
            type: "GET", 
            url: groupid + "/getgrouparrays",
            success: function(allarrays){
                editarrays(allarrays);
            },
            error: function(err){
                console.log(err);
            }
        })
        return false;
    }

    getgrouparrays();
    function clarify(array) {
        temp = array.value.map(function(element){
            return eval(element);
        });
        temp.push(array._id)
        temp.push(array.time);
        return checkifexp(temp);
    }

    function checkifexp(array){
        var newarr = [];
        var time = array[3];
        var hours = array[0];
        var dateofexp = moment(time).add(hours,"hours").toISOString();
        var diff = reverse(moment().diff(dateofexp,"hours", true));
        if(diff < 0){
            deletearray(array[2]);
            return false;
        } else {
            newarr = [diff, diff + (array[1] - array[0])];
        }
        return newarr;
    }

    function constractor(allarrays){
        var values = allarrays[0];
        var username = allarrays[1].username;

        var arrays = values.map(clarify).filter(function(el){
            if (el){
                return el;
            }
        });

        var newarray = [arrays, username];
        return newarray;
    }

    function deletearray(arrayid) {
        $.ajax({
            type: "POST",
            url: "/delarray",
            data: {arrayid: arrayid},
            success: function(data){
                console.log("success");
            },
            error: function(err){
                console.log(err);
            }
        })
    }

    function comparepairs(pair1, pair2) {
      if (pair1[0] < pair2[0]) {
        if(pair1[1] >= pair2[0]) {
          if(pair1[1] >= pair2[1]) {
            return [pair2[0], pair2[1]]; 
          }
          else {
            return [pair2[0], pair1[1]];
          }
        }
        else {
          return [];
        }
      }
      else {
        if (pair1[0] < pair2[1]) {
          if (pair1[1] <= pair2[1]) {
            return [pair1[0], pair1[1]];
          }
          else {
            return [pair1[0], pair2[1]];
          }
        }
        else {
          return [];
        }
      }
    }var person2 = [[13.51666, 29.51666], [13.51666, 29.51666]];

    function comparearrays(array1, array2) {
      var matched = [];
      for (var i = 0; i < array1.length; i ++ ){
        for (var j = 0; j < array2.length; j ++){
          var temp = comparepairs(array1[i], array2[j]);
          if (temp.length !== 0) {
            matched.push(comparepairs(array1[i], array2[j]));
          }
        }
      }
      return matched;
    }

    function finalcompare() {
      var args = Array.prototype.slice.call(arguments)[1];
      console.log("args are:", args);
      var solvedarray = args[0];
      for (var i = 0; i < args.length; i ++) {
        if ( args[i + 1] !== undefined) {
          solvedarray = comparearrays(solvedarray, args[i + 1]);
        }
      }
      return solvedarray;
    }

});  
