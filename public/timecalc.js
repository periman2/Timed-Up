

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

    //get my own available times
 
    function getmyarrays(){
        $.ajax({
            type: 'GET',
            url: "/getarrays",
            success: function(data){
                console.log(data.length);
            },
            error: function(err){
                console.log(err);
            }
        });
        return false;
    }

    function show(all, onlycommon, pairs){
        //THIS IS WHERE THE ARRAYS ARE COMPARED!!
        //console.log('this is the onlycommon:', onlycommon)
        var end = finalcompare(this, all);
        //console.log("end is : ", end);
        if($('.allmembers').hasClass('active')){
            if(end.length > 0) {
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='all'></div>")
                $(".all").append("<h2>This group has common times at those dates: </h2>");
                //$(".all").addClass('hidden');
                end.forEach(function(array){
                    $(".all").append(
                        "<h3 class='best'>" + 
                        moment().add(array[0],"hours").format('MMMM Do, YYYY h:mm A') + 
                        " for: " + 
                        Math.floor(array[1] - array[0]) + 
                        " hours " +
                        Math.floor(((array[1] - array[0]) - Math.floor(array[1] - array[0])) * 60) +
                        " minutes </h3>"
                    )
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='all'></div>");
                $(".all").append("<h3>There is no common time for all the members of the group</h3>");
            }
        }
        
        if($('.onlycommon').hasClass('active')){
            if(onlycommon.length > 0){
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='onlycom'></div>");
                $('.onlycom').append("<h3>People with common times in this group: </h3>");
                onlycommon.forEach(function(persons){
                    $('.onlycom').append(makepeople(persons))
                });
                $('.onlycom').css({
                    'background-color':'rgba(168, 169, 179, 0.75)',
                    'max-height': '300px',
                    'overflow-y': 'scroll',
                    'padding': '5px',
                    'border': '2px solid rgba(107, 107, 107, 1)',
                    'border-radius': '20px'
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append('<h3>No group members have common time with eachother</h3>');
            }
        }
        
        if($('.pairs').hasClass('active')){
            if(pairs.length > 0){
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='onlypair'></div>");
                $('.onlypair').append("<h3>Pairs of people with common times in this group: </h3>");
                pairs.forEach(function(persons){
                    $('.onlypair').append(makepeople(persons));
                });
                $('.onlypair').css({
                    'background-color':'rgba(168, 169, 179, 0.75)',
                    'max-height': '300px',
                    'overflow-y': 'scroll',
                    'padding': '5px',
                    'border': '2px solid rgba(107, 107, 107, 1)',
                    'border-radius': '20px'
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append('<h3>There are no pairs or people with common time in this group.</h3>');
            }
        }
    }
    
    function makepeople(people){
        //console.log('peoooople',people)
        
        var html = ["<div class='peoplewithcom'><h3> These people:" + people[1] + " have common time in those dates: <br>"];
        for(var i = 0; i < people[0].length; i++){
        html.push( 
        "<h3>"
        + moment().add(people[0][i][0],"hours").format('MMMM Do, YYYY h:mm A') + 
        " for: " + 
        Math.floor(people[0][i][1] - people[0][i][0]) + 
        " hours and " +
        Math.floor(((people[0][i][1] - people[0][i][0]) - Math.floor(people[0][i][1] - people[0][i][0])) * 60) +
        " minutes</h3>")
        }
        html.push('</div>');
        return html.join('');
    }
    
    $('.besttimes .btn').click(function(){
        var activated = $('.active');
        activated.removeClass('active');
        $(this).addClass('active');
        getgrouparrays();
    });

    //all the work of my whole life happens here

    function getgrouparrays(){
        $.ajax({
            type: "GET", 
            url: groupid + "/getgrouparrays",
            success: function(allarrays){
                //most important function is this one:
                editarrays(allarrays);
            },
            error: function(err){
                console.log(err);
            }
        })
        return false;
    }

    function editarrays(everything){
        var onlyarrays = []
        var arrayswithnames = [];
        everything.forEach(function(arrays){
            //console.log(data[0], data[1]);
            var newarray = constractor(arrays);
            onlyarrays.push(newarray[0]);
            arrayswithnames.push(newarray);
            //console.log("this is it!", newarray);
        });
        
        var allcommontimes = comparedwithnames(arrayswithnames);
        var pairs = getonlypairs(allcommontimes);
        
        show(onlyarrays, allcommontimes, pairs);
        //console.log("all ever common times: ", allcommontimes, "only pairs are :", pairs)
    }

    function getonlypairs(all){
        var pairs = [];
        for(var i = 0; i < all.length; i++){
            if(all[i][1].length === 2){
                pairs.push(all[i]); 
            }
        }
        return pairs;
    }

    function elementedit(element){
        var finalarray = [];
        var temp = element[0][0];
        var compared;
        var names = [];
        for(var i = 0; i < element.length; i++){
            names.push(element[i][1]);
            if(element[i + 1] != undefined){
                //console.log("pairs:",temp, element[i + 1][0]);
                temp = finalcompare(this, [temp, element[i + 1][0]]);
                if (temp != undefined && temp.length > 0){
                    compared = [temp, names];
                } else {
                    break;
                }
            }
        }

        return compared;
    }

    function add(a, b){
        return a + b;
    }

    function checkifitexists(array, arrays){
        checker = [];
        arrays.forEach(function(element){
            if(element[1].length === array[1].length) {
                var temp = [];
                for(var i = 0; i < element[1].length; i ++){
                    //console.log(array[1].indexOf(element[1][i]));
                    if(array[1].indexOf(element[1][i]) >= 0){
                        temp.push(1);
                    }
                }
                //console.log(element[1], array[1].length, temp, temp.reduce(add, 0))
                if(temp.reduce(add, 0) === array[1].length){
                    checker.push(1);
                } else {
                    checker.push(0);
                }
            } else {
                checker.push(0);
            }
        });
        //console.log(checker)
        return checker.reduce(add, 0);

    }

    function comparedwithnames(arrays){
        var permArr = [],
        usedChars = [];

        function permutate(input) {
            var i, ch;
            for (i = 0; i < input.length; i++) {
                ch = input.splice(i, 1)[0];
                usedChars.push(ch);
                if (input.length == 0) {
                    permArr.push(usedChars.slice());
                }
                permutate(input);
                input.splice(i, 0, ch);
                usedChars.pop();
            }
            return permArr
        };
    
        var allperms = permutate(arrays);
        var ending = [];
        allperms.forEach(function(element){
            var el = elementedit(element);
            if(el !== undefined && el.length > 0){
                //console.log(el.length, el, "elementtttt");
                var check = checkifitexists(el, ending);
                if(check === 0){
                    ending.push(el);
                }
            }
            
        })
        return ending;
        //console.log("all people with common times are:", ending);
    }





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
                //console.log("success");
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
    }

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
      //console.log("args are:", args);
      var solvedarray = args[0];
      for (var i = 0; i < args.length; i ++) {
        if ( args[i + 1] !== undefined) {
          solvedarray = comparearrays(solvedarray, args[i + 1]);
        }
      }
      return solvedarray;
    }

    // time calc combinations
    getgrouparrays();
});  
