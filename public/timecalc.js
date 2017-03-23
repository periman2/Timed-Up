$(document).ready(function(){

    //========================
    //GROUPEDIT FUNCTIONALITY
    //========================
    //========================
    //FRIENDLIST FUNCTIONALITY
    //========================
    //GLOBAL VARIABLE FOR STORING AND EDITING FRIENDS
    var globalfriends = [];
    var globaluser = [];
    var globalgroup;
    
    function keeponlyslackids(friends){
        var nextarray = [];
        friends.forEach(function(friend){
            if(friend.slack !== undefined){
                nextarray.push(friend.slack.id);
            }   
        });
        return nextarray;
    }
    //get user data
    function getuserdata() {
        //console.log("I'm here now ");
        $.ajax({
            type:"GET",
            url: "/getuserdata",
            success: function(user) {
                globaluser = user;
                getfriendlist(user);
                getgrouparrays();
                showgroupmembers();
            },
            error: function(){
                console.log("error happened");
            }
        });
    }

    function getfriendlist(user) {
        $.ajax({
            type:"GET",
            url: "/getfriendlist",
            success: function(list) {
                //console.log(list.friends[0]);
                var isonslack = $(".hasSclack")
                var userdat = getuserdata;
                var slackfriends = keeponlyslackids(list.friends);
                //console.log("friendlist:", slackfriends, user);
                if(user.slack !== undefined){
                    getnewslackfriends(slackfriends, user);
                } else {
                    var seperatedfriends = seperatefriends(list, user);
                    showfriendlist(seperatedfriends, user);
                    //console.log(seperatedfriends,"here they are");
                }
            },
            error: function(){
                console.log("error happened");
            }
        });
    }

    //Uppdate  Slack friends and show friendlist if user has no new slackteam members it gives out the same list as before.
    function getnewslackfriends(oldfriends, user) {
        $.ajax({
            type:"POST",
            data: {slackids: oldfriends},
            url: "/getnewslackfriends",
            success: function(slacklist) {
                //console.log(slacklist.friends + "updatedlist");
                var seperatedfriends = seperatefriends(slacklist, user);
                showfriendlist(seperatedfriends, user);
                //console.log(seperatedfriends,"here they are slack");
            },
            error: function(){
                console.log("error happened");
            }
        });
    }

    //MAKES TAB FUNCTIONLITY FOR THE FRIENDLIST
    $(".friendlist").on("click", ".btn", function(){
        var activated = $('.activenow');
        activated.removeClass('activenow');
        $(this).addClass('activenow');
        showfriendlist(globalfriends, globaluser);
    });

    //SEPERATES FRIENDS INTO THE 3 NEEDED CATEGORIES
    function seperatefriends(friendlist, user){
        var friendsfromotherslackteams = [];
        var friendsfrommyslackteam = [];
        var localfriends = [];
        var friends= friendlist.friends;
        for(var i = 0; i < friends.length; i++){
            if(friends[i].slack !== undefined){
                //console.log("sdffffff", user.slack.teamid, friends[i].slack.teamid)
                if(user.slack !== undefined){
                    if(user.slack.teamid === friends[i].slack.teamid){
                        friendsfrommyslackteam.push(friends[i]);
                    } else {
                        friendsfromotherslackteams.push(friends[i]);
                    }
                } else {
                    friendsfromotherslackteams.push(friends[i]);
                }
                
            } else {
                localfriends.push(friends[i]);
            }
        }
        globalfriends = [friendsfromotherslackteams, friendsfrommyslackteam, localfriends];
        return [friendsfromotherslackteams, friendsfrommyslackteam, localfriends];
    }

    function showfriendlist(friends, user){
        $(".myfriendlist").html("");

        if($(".activenow").hasClass("allfriends")){
            if(user.slack !== undefined){
                if(friends[1].length > 0){
                    $(".myfriendlist").append("<h4>Slack - " + user.slack.teamname + "</h4>");
                    friends[1].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><img height='30'' width='30' src='" + friend.slack.avatar + "'><p>" + friend.slack.username + "</p></li><br>");
                    });
                }
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack - other</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>" + friend.slack.username + "</p></li><br>");
                    });
                }
                if(friends[2].length > 0){
                    $(".myfriendlist").append("<h4>Local friends</h4>");
                    friends[2].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>" + friend.username + "</p></li><br>");
                    });
                }
            } else {
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>" + friend.slack.username + "</p></li><br>");
                    });
                }
                if(friends[2].length > 0){
                    $(".myfriendlist").append("<h4>Local friends</h4>");
                    friends[2].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>" + friend.username + "</p></li><br>");
                    });
                }
            }
        }
        
        if($(".activenow").hasClass("slackfriends")){
            if(user.slack !== undefined){
                if(friends[1].length > 0){
                    $(".myfriendlist").append("<h4>Slack - " + user.slack.teamname + "</h4>");
                    friends[1].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><img height='30'' width='30' src='" + friend.slack.avatar + "'><p>"  + friend.slack.username + "</p></li><br>");
                    });
                }
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack - other</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>"  + friend.slack.username + "</p></li><br>");
                    });
                }
            } else {
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>" + friend.slack.username + "</p></li><br>");
                    });
                }
            }
        }
        if($(".activenow").hasClass("localfriends")){
            if(friends[2].length > 0){
                $(".myfriendlist").append("<h4>Local friends</h4>");
                friends[2].forEach(function(friend){
                    $(".myfriendlist").append("<li class=" + friend._id + "><i class='fa fa-times' aria-hidden='true'></i><p>" + friend.username + "</p></li><br>");
                });
            }
        }

        //make the CSS here:
        $(".myfriendlist img").css({
            "border-radius":"50%"
        })
        $(".myfriendlist h4").css({
            "font-weight": "bold",
            "font-size": "20px"
        });
        $(".myfriendlist li").css({
            "display":"inline-block",
            "font-size": "18px",
            "padding": "0 4px",
        });
        $(".myfriendlist li i").css({
            "display":"inline-block",
            "margin-left": "15px",
            "padding-right": "5px",
            "border-right": "4px solid rgba(100, 125, 150, 1)",
            "cursor": "pointer"
        });
        $(".myfriendlist li p").css({
            "display":"inline-block",
            "cursor": "pointer",
            "padding-left":"6px"
        });
    }

    //Search functionality here:
    $("#friendsearch").on("blur", function(){
        $("#popupbox").fadeOut(300);
    });

    $("#friendsearch").on("input", function(){
        var ids = [];
        globalfriends.forEach(function(friendgroups){
            if(friendgroups !== undefined){
                friendgroups.forEach(function(friend){
                    ids.push(friend._id);
                });
            }
        })
        //console.log(this.value, ids);
        var searchvalue = this.value;
        if(searchvalue !== "") {
            
            // $("#popupbox").fadeIn(100);
            $.ajax({
                type:"POST",
                url: "/searchforfriend",
                data: {value: searchvalue, ids: ids},
                success: function(users) {
                    //console.log("here's my good user list: ", users);
                    popupbox(users);
                },
                error: function(){
                    console.log("error happened");
                }
            });
        } else {
            $("#popupbox").fadeOut(300);
            // $("#popupbox").fadeOut(100);
        }
        
    });

    function popupbox(users){   
        if(users.length > 0){
            $("#popupbox").html("");
            $("#popupbox").append("<div class='searchresults'></div>");
            users.forEach(function(user){
                if(user.slack !== undefined){
                    $(".searchresults").append("<li class='" + user._id + "'><i class='fa fa-plus' alt='Add User' aria-hidden='true'></i>" + "<p>" + user.slack.username + "<em> " + user.slack.teamname + "</em></p>" + "</li>")
                } else {
                    $(".searchresults").append("<li class='" + user._id + "'><i class='fa fa-plus' alt='Add User' aria-hidden='true'></i>" + "<p>" + user.username + "</p>" + "</li>")
                }
            });
        } else {
            $("#popupbox").html("<div class='searchresults'><h5><em>No matches were found.<br>Keep trying though, everyone deserves a friend...</em></h5></div>");
        }
        $(".searchresults").css({
            "padding":"2% 10%",
            "font-size":"20px",
            "display":"inline-block"            
        });
        $(".searchresults li p").css({
            "display":"inline-block",
            "padding":"6px"          
        });
        $(".searchresults li i").css({
            "color":"rgba(77, 179, 165, 1)",
            "display":"inline-block",
            "cursor":"pointer",
            "padding":"0 10px",
            "border-right": "3px solid rgba(57, 104, 132, 1)"
        });
        $(".searchresults li em").css({
            "display":"inline-block",
            "font-size":"9px"
        });
        $("#popupbox").fadeIn(300);
    }

    $("#popupbox").on("click", "i", function(){
        var friendid = $(this).parent().attr("class");
        //console.log(friendid);
        $.ajax({
            type:"POST",
            url:"/addfriend",
            data:{friendid: friendid},
            success: function(result){
                //console.log(result);
                getuserdata();
            },
            error: function(){
                console.log("error happened");
            }
        })
    });
    // setInterval(getuserdata, 5000);

    //============================
    //FRIENDLIST FUNCTIONALITY END
    //============================

    //delete groupie
    $("#members").on("click", "i", function() {
        var groupieid = $(this).attr("id");
        var groupname = $("#gname").html();
        
        console.log( groupname, groupieid);
        $.ajax({
            type: "POST",
            url: "/deletegroupie", 
            data: {groupieid : groupieid , groupname: groupname},
            success: function(result){
                if(result) {
                    // /console.log("deleted groupie!", result);
                    showgroupmembers();
                }
            },
            error: function(err){
                console.log(err);
            }
        });
        return false;
    });

    
    function showgroupmembers(){
        //UPDATE THE GROOP TIMES EACH TIME THE GROUP MEMBERS CHANGE
        getgrouparrays();
        var cururl = document.URL;
        var name = cururl.split("/");
        var groupid = name[name.length - 1];
        $.ajax({
            type: "POST",
            url: "/getgroupmembers", 
            data: {groupid: groupid},
            success: function(group){
                // /console.log("deleted groupie!", result);
                //location.reload();
                console.log(group);
                $("#members").html("");
                if(group.authid === globaluser._id){
                    group.groupies.forEach(function(groupie){
                        if(groupie.slack !== undefined){
                            $("#members").append("<div class='member'><div class='membername'><h3>" + groupie.slack.username + "</h3></div><i  id='" + groupie._id + "' class='fa fa-times fa-2x delgroupie' aria-hidden='true'></i></div>")
                        } else {
                            $("#members").append("<div class='member'><div class='membername'><h3>" + groupie.username + "</h3></div><i  id='" + groupie._id + "' class='fa fa-times fa-2x delgroupie' aria-hidden='true'></i></div>");
                        }
                    })
                } else {
                    group.groupies.forEach(function(groupie){
                        if(groupie.slack !== undefined){
                            $("#members").append("<div class='member' ><h3>" + groupie.slack.username + "</h3></div>");
                        } else {
                            $("#members").append("<div class='member' ><h3>" + groupie.username + "</h3></div>");
                        }
                    })
                }

            },
            error: function(err){
                console.log(err);
            }
        });
    }
    //DELETE FRIEND
    $(".myfriendlist").on("click", "li i", function() {
        var friendid= $(this).parent().attr("class");
        console.log("friendid: " + friendid);
        $.ajax({
            type: "DELETE",
            url: "/deletefriend", 
            data: {friendid: friendid},
            success: function(result){
                var seperatedfriends = seperatefriends(result, globaluser);
                showfriendlist(seperatedfriends, globaluser);
            }
        })
        return false;
    });
    //FRIENDLIST ACTS AS AN ADD BUTTON
    $(".friendlist").on("click", "li p", function(){
        var friendid = $(this).parent().attr("class");
        var friendname = $(this).html();
        var groupnames = [$("#gname").html()];
        var members = $(".member");
        var check =  true;
        var count = 0;
        members.each(function(i, member){
            count ++;
            var membname = $(member).find("h3").html();
            //onsole.log(membname);
            if(friendname === membname){
                check = false;
                return;
            }
        });
        console.log(check, count);
        if(check && (count < 13)){
            $.ajax({
                type: "POST",
                url: "/addgroupie",
                data: {friendid: friendid, groupnames:groupnames},
                success: function(result){
                    showgroupmembers();
                }
            });
        } else {
            if(count > 12){
                alert("You currently can't add more than 12 people to a group.")
            } else {
                alert("This person already exists inside the group");
            }
        }
    });

     //========================
    //GROUPEDIT FUNCTIONALITY END
    //========================

//==============================
//          TIMECALC
//==============================


    var cururl = document.URL;
    var name = cururl.split("/");
    var groupid = name[name.length - 1];

    function reverse(num){
        return num - 2 * num;
    }



    //get my own available times
 
    // function getmyarrays(){
    //     $.ajax({
    //         type: 'GET',
    //         url: "/getarrays",
    //         success: function(data){
    //             console.log(data.length);
    //         },
    //         error: function(err){
    //             console.log(err);
    //         }
    //     });
    //     return false;
    // }

    function show(all, onlycommon, pairs){
        //THIS IS WHERE THE ARRAYS ARE COMPARED!!
        //console.log('this is the onlycommon:', onlycommon)
        var end = finalcompare(this, all);
        //console.log("end is : ", end);
        if($('.allmembers').hasClass('active')){
            if(end.length > 0) {
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='all'></div>")
                $(".all").append("<h2><strong>The whole group has common times at those dates: </strong></h2>");
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
                $(".all").append("<h2>There is no common time for all the members of the group</h2>");
            }
        }
        
        if($('.onlycommon').hasClass('active')){
            if(onlycommon.length > 0){
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='onlycom'></div>");
                $('.onlycom').append("<h2><strong>People with common times in this group: </strong></h2>");
                onlycommon.forEach(function(persons){
                    $('.onlycom').append(makepeople(persons))
                });
                $('.onlycom').css({
                    'background-color':'transparent',
                    'color':'#212121',
                    'max-height': '300px',
                    'overflow-y': 'auto',
                    'padding': '5px',
                    'width': '100%',
                    'border-bottom': '2px solid rgba(107, 107, 107, 1)',
                    'border-top': 'none',
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append('<h2>No group members have common time with each other.</h2>');
            }
        }
        
        if($('.pairs').hasClass('active')){
            if(pairs.length > 0){
                $(".displayedmembers").html("");
                $(".displayedmembers").append("<div class='onlypair'></div>");
                $('.onlypair').append("<h2><strong>Pairs of people with common times in this group: </strong></h2>");
                pairs.forEach(function(persons){
                    $('.onlypair').append(makepeople(persons));
                });
                $('.onlypair').css({
                    'background-color':'transparent',
                    'color':'#212121',
                    'max-height': '300px',
                    'overflow-y': 'auto',
                    'padding': '5px',
                    'width': '100%',
                    'border-bottom': '2px solid rgba(107, 107, 107, 1)',
                    'border-top': 'none',
                });
            } else {
                $(".displayedmembers").html("");
                $(".displayedmembers").append('<h2>There are no pairs or people with common time in this group.</h2>');
            }
        }
    }
    
    function makepeople(people){
        //console.log('peoooople',people)
        
        var html = ["<div class='peoplewithcom'><h3><strong> These people: </strong><em>" + people[1] + "</em> have common time at: <br>"];
        for(var i = 0; i < people[0].length; i++){
        html.push( 
        "<h3>"
        + moment().add(people[0][i][0],"hours").format('MMMM Do, YYYY h:mm A') + 
        " for: " + 
        Math.floor(people[0][i][1] - people[0][i][0]) + 
        " hours and " +
        Math.floor(((people[0][i][1] - people[0][i][0]) - Math.floor(people[0][i][1] - people[0][i][0])) * 60) +
        " minutes, </h3>")
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
            console.log("after constractor: ", newarray);
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
        if(allarrays[1].slack !== undefined){
            var username = allarrays[1].slack.username;
        } else {
            var username = allarrays[1].username;
        }
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
    getuserdata();
});  
