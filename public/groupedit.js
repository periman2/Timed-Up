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
                getfriendlist(user)
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

    $(".friendlist").on("click", ".btn", function(){
        var activated = $('.activenow');
        activated.removeClass('activenow');
        $(this).addClass('activenow');
        $(".friendlist .btn").css({
            "background": "#7FB9C4",
            "color": "rgba(70, 90, 114, 1)"
        });
        $(".activenow").css({
            "background": "rgba(70, 90, 114, 1)",
            "color": "#7FB9C4"
        });
        //getuserdata();
        showfriendlist(globalfriends, globaluser);
    });

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
            $(".searchresults").html("<h5><em>No matches were found.<br>Keep trying though, everyone deserves a friend...</em></h5>");
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

    getuserdata();
    // setInterval(getuserdata, 5000);

    //============================
    //FRIENDLIST FUNCTIONALITY END
    //============================

    //delete groupie
    $(".delgroupie").click(function() {
        var groupname = $("#gname").html();
        var groupiename = $(this).parent().find(".membername h3").html();
        console.log( groupname, groupiename);
        $.ajax({
            type: "POST",
            url: "/deletegroupie", 
            data: {groupiename : groupiename , groupname: groupname},
            success: function(result){
                if(result) {
                    // /console.log("deleted groupie!", result);
                    location.reload();
                }
            },
            error: function(err){
                console.log(err);
            }
        });
        return false;
    });

    
    function showgroupmembers(){
        var cururl = document.URL;
        var name = cururl.split("/");
        var groupid = name[name.length - 1];
        $.ajax({
            type: "POST",
            url: "/getgroupmembers", 
            data: {groupid: groupid},
            success: function(result){
                if(result) {
                    // /console.log("deleted groupie!", result);
                    //location.reload();
                    console.log(result);
                }
            },
            error: function(err){
                console.log(err);
            }
        });
    }
    showgroupmembers();
    

    $(".friendlist").on("click", "li p", function(){
        var friendid = $(this).parent().attr("class");
        var friendname = $(this).html();
        var groupnames = [$("#gname").html()];
        var members = $(".member");
        var check =  true;
        members.each(function(i, member){
            var membname = $(member).find(".membername h3").html();
            //onsole.log(membname);
            if(friendname === membname){
                check = false;
                return;
            }
        });
        console.log(check);
        if(check){
            $.ajax({
                type: "POST",
                url: "/addgroupie",
                data: {friendid: friendid, groupnames:groupnames},
                success: function(result){
                    location.reload();
                }
            });
        } else {
            alert("This person already exists inside the group");
        }
    });

     //========================
    //GROUPEDIT FUNCTIONALITY END
    //========================
})