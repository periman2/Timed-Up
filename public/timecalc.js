

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
                $(".all").append("<h2><strong>This group has common times at those dates: </strong></h2>");
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
                    $('.all').css({
                        'max-height': '300px',
                        'overflow-y': 'auto',
                    })
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='all'></div>");
                $(".all").append("<h2><strong>There is no common time for all the members of the group<strong></h2>");
            }
        }
        
        if($('.onlycommon').hasClass('active')){
            if(onlycommon.length > 0){
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='onlycom'></div>");
                $('.onlycom').append("<h2>People with common times in this group: </h2>");
                onlycommon.forEach(function(persons){
                    $('.onlycom').append(makepeople(persons))
                });
                $('.onlycom').css({
                    'background-color':'rgba(31, 55, 76, 1)',
                    'color':'rgba(190, 210, 228, 1)',
                    'max-height': '300px',
                    'overflow-y': 'auto',
                    'padding': '5px',
                    'border': '2px solid rgba(107, 107, 107, 1)',
                    'border-top': 'none',
                    'border-bottom-left-radius': '20px',
                    'border-bottom-right-radius': '20px'
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append('<h2>No group members have common time with each other</h2>');
            }
        }
        
        if($('.pairs').hasClass('active')){
            if(pairs.length > 0){
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='onlypair'></div>");
                $('.onlypair').append("<h2>Pairs of people with common times in this group: </h2>");
                pairs.forEach(function(persons){
                    $('.onlypair').append(makepeople(persons));
                });
                $('.onlypair').css({
                    'background-color':'rgba(31, 55, 76, 1)',
                    'color':'rgba(190, 210, 228, 1)',
                    'max-height': '300px',
                    'overflow-y': 'auto',
                    'padding': '5px',
                    'border': '2px solid rgba(107, 107, 107, 1)',
                    'border-top': 'none',
                    'border-bottom-left-radius': '20px',
                    'border-bottom-right-radius': '20px'
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append('<h2>There are no pairs or people with common time in this group.</h2>');
            }
        }
    }
    
    function makepeople(people){
        //console.log('peoooople',people)
        
        var html = ["<div class='peoplewithcom'><h3><strong> These people:" + people[1] + " have common time in the dates: </strong><br>"];
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
        //console.log("everything", everything);
        everything.forEach(function(arrays){
            //console.log("original array: ", arrays);
            var newarray = constractor(arrays);
            //console.log("after constractor: ", newarray);
            onlyarrays.push(newarray[0]);
            arrayswithnames.push(newarray);
            //console.log("this is it!", newarray);
        });
        //console.log("arrays with names",arrayswithnames )
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
        //console.log("this is the input's element: ", element);
        var finalarray = [];
        var temp = element[0][0];
        var comp = [];
        var names = [element[0][1]];
        
        for(var i = 0; i < element.length; i++){
            
            //console.log("this is the edited element", element[i])
            if(element[i + 1] !== undefined){
                //console.log("pairs:",temp, element[i + 1][0],element[i + 1][1], names);
                temp = finalcompare(this, [temp, element[i + 1][0]]);
                //console.log("temp now is :", temp);
                if (temp !== undefined && temp.length > 0){
                    names.push(element[i + 1][1]);
                    comp = [temp, names.join()];
                    //console.log("nameeeeeeees", names, comp);
                    finalarray.push(comp);
                } else {
                    break;
                }
            }
        }
        
        return finalarray;
    }

    function add(a, b){
        return a + b;
    }

    function checkifitexists(array, arrays){
        checker = [];
        arrays.forEach(function(element){
            if(element[1].length === array[1].length) {
                var temp = [];
                for(var i = 0; i < array[1].length; i ++){
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

        //console.log("these are the permuations: ", allperms);
        var ending = [];
        allperms.forEach(function(element){
            var el = elementedit(element);
            
            if(el !== undefined && el.length > 0){
                //console.log(el.length, el, "elementtttt");
                var check;
                for(var k = 0; k < el.length; k++){
                    //console.log('onlyelement', el[k][1].split(","));
                    el[k][1] = el[k][1].split(",");
                    //console.log('elk is', el[k]);
                    
                    var check = checkifitexists(el[k], ending);
                    if(check === 0){
                            ending.push(el[k]);
                    }
                }
            }
            
        })
        //console.log("all people with common times are:", ending);
        return ending;
        
    }

    function clarify(array) {
        var temp = array.value.map(function(element){
            return eval(element);
        });
        temp.push(array._id)
        temp.push(array.time);
        //console.log("important temp: ", temp);
        return checkifexp(temp);
    }

    function checkifexp(array){
        var newarr = [];
        var time = array[3];
        var hours = array[0];
        var dateofexp = moment(time).add(hours,"hours").toISOString();
        var diff = reverse(moment().diff(dateofexp,"hours", true));
        //console.log("difference is: ", diff, 'array is: ', array);
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
        var temp = values.map(clarify)

        var arrays = temp.filter(function(el){
            //console.log("llllll",el)
            if (el !== false){
                return el;
            }
        });

        var newarray = [arrays, username];
        //console.log("these are the values and the usernames:", newarray, values);
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
