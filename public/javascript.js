
$(document).ready(function(){

    var groupcount = 0;

    getgroups();
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
                        $(".myfriendlist").append("<li class=" + friend._id + "><img height='30' width='30' src='" + friend.slack.avatar + "'><p>" + friend.slack.username + "</p></li><br>");
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
                        $(".myfriendlist").append("<li class=" + friend._id + "><img height='30' width='30' src='" + friend.slack.avatar + "'><p>"  + friend.slack.username + "</p></li><br>");
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

    getuserdata();
    // setInterval(getuserdata, 5000);

    //============================
    //FRIENDLIST FUNCTIONALITY END
    //============================

    //HORIZONTAL MOUSEWHEEL SCROLL FOR GROUPS
    $(function() {
        $("#groups").on("mousewheel", function(event) {
            var delta = Math.max(-1, Math.min(1, (event.originalEvent.wheelDelta || -event.originalEvent.detail)));
            $(this).scrollLeft( $(this).scrollLeft() - ( delta * 40 ) );
            event.preventDefault();
        });
    });


    function updategroupclass(group) {
        var thisgroup = $("#" + group._id);
        //console.log(thisgroup.html());
        thisgroup.addClass("activated");
        thisgroup.css("background-color", "#80D06D");
    }
    
    
    function creategroups(groups){
        $("#groups").html("");
        //here I need to create a new way of showing the groups!
        // groups.forEach(function(groups){
            
        // });
        $.each(groups, function(i, group){
            //console.log(group);
            
            $("#groups").prepend("<div class='selector' id='" + group._id + "'></div>");
            $("#" + group._id).append(
                "<div class='row'><div class='title col-xs-9'>"
                    + group.name + 
                    "</div><div class='col-xs-3'><button class='btn btn-danger deletegroup' >X</button></div></div><hr><div class='onlynames'></div>"
                    );
            $(".title").css({
                'display': 'inline',
                'overflow': 'visible',
                'word-wrap': 'break-word'
            });

            group.groupies.forEach(function(groupie){
                if(groupie.slack !== undefined){
                    $("#" + group._id + " .onlynames").append("<li class='groupie'style='clear:both;' id='" + groupie._id + "'><i style='float:left;' class='fa fa-times deletegroupie' aria-hidden='true'></i><p style='float:left;'>"
                    + groupie.slack.username +
                    "</p>");
                } else {
                    $("#" + group._id + " .onlynames").append("<li class='groupie'style='clear:both;' id='" + groupie._id + "''><i style='float:left;' class='fa fa-times deletegroupie' aria-hidden='true'></i><p style='float:left;'>"
                    + groupie.username +
                    "</p>");
                }
            });
             $("#" + group._id + " .onlynames").css({
                "max-height": "180px",
                "overflow-y": "auto",
             })

            $("#" + group._id).append("<br><hr><a href='/" + group._id + "' class='btn btn-default grouppage' >Show Group Page</a>");
            //console.log(group._id, typeof group._id);
            $("#" + group._id).css({
                "background-color": "rgba(243, 116, 53, 1)",
                "color": "rgba(41, 41, 41, 1)" ,
                "height": "350px",
                "min-width": "230px",
                "padding": "10px",
                "margin": "5px 5px",
                "-webkit-box-shadow": "0px 3px 11px 0px rgba(50, 50, 50, 0.52)",
                "-moz-box-shadow":    "0px 3px 11px 0px rgba(50, 50, 50, 0.52)",
                "box-shadow":         "0px 3px 11px 0px rgba(50, 50, 50, 0.52)"
            });
            $(".title").css({
                "font-size":"25px",
                "font-weight": "bold"
            });
            $("#" + group._id + " .title").css({
            })
            //console.log( $("#" + group._id).html());
        })
    }

    function getgroups(){
        $.ajax({
            type:"GET",
            url: "/getmygroups",
            success: function(groups) {
                creategroups(groups);
                groupcount = groups.length;
            },
            error: function(){
                console.log("error happened");
            }
        });
    }

    function updategroups(newgroups) {
        $.ajax({
            type:"GET",
            url: "/getmygroups",
            success: function(groups) {
                creategroups(groups);
                newgroups.forEach(function(newgroup){
                    updategroupclass(newgroup);
                });
            },
            error: function(){
                console.log("error happened");
            }
        });
    }

    $("#creategroup").submit(function(){
        if($("#groupname").val() !== "") {
            var name = $("#groupname").val();

            if(groupcount >= 13){
                alert("You cannot create more than 12 groups")
            } else {
                $.ajax({
                    type: "POST",
                    url: "/creategroup",
                    data: {groupname: name},
                    success: function(groups) {
                        if(groups){
                            getgroups();
                        } else {
                            alert("You already created a group with this name");
                        }
                    },
                    error: function() {
                        console.log("something went wrong");
                    }
                });

                return false;
            }
            
        } else {
            conosle.log("error");
        }
    });

    //delete friend from list
    $(".myfriendlist").on("click", "li i", function() {
        var friendid= $(this).parent().attr("class");
        //console.log("friendid: " + friendid);
        $.ajax({
            type: "DELETE",
            url: "/deletefriend", 
            data: {friendid: friendid},
            success: function(result){
                //console.log("newfriendlist:" + result.friends);
                var seperatedfriends = seperatefriends(result, globaluser);
                showfriendlist(seperatedfriends, globaluser);
            }
        })
        //location.reload();
        return false;
    });

    //delete group
    $("#groups").on("click", ".deletegroup", function() {
        var groupname= $(this).parent().parent().find(".title").html();
        //console.log("name : " , groupname);
        $.ajax({
            type: "DELETE",
            url: "/deletegroup", 
            data: {groupname: groupname},
            success: function(result){
                if(result) {
                    getgroups();
                    //console.log("deleted group!");
                }
                // console.log("not deleted group!");
                // window.location.href = "/"
            }
        })
        return false;
    });

    //delete groupie
    $("#groups").on("click", ".deletegroupie", function() {
        var groupieid = $(this).parent().attr("id");
        var groupname = $(this).parent().parent().parent().find(".title").html();
        //console.log( groupname, groupieid);
        $.ajax({
            type: "POST",
            url: "/deletegroupie", 
            data: {groupieid : groupieid , groupname: groupname},
            success: function(result){
                if(result) {
                    getgroups();
                    return console.log("deleted groupie!", result);
                }
            },
            error: function(err){
                console.log(err);
            }
        })
        return false;
    });

    //toggle selected item

    $("#groups").on("click", ".title", function(event) {
        var div = $(this).parent().parent();
        //console.log(div.html())
        if(div.hasClass("activated")) {
            div.css("background-color", "rgba(243, 116, 53, 1)");
        } else {
            div.css("background-color", "rgba(128, 208, 109, 1)");
        }
        div.toggleClass("activated");
    });

    //add friend to selected groups

    $(".friendlist").on("click", "li p", function(){
        var friendid = $(this).parent().attr("class");
        //console.log("fff", friendid);
        var friendname = $(this).html();
        var groupnames = [];
        $(".activated .title").each(function(){
            groupnames.push($(this).html());
        });
        var i = 0, j = 0, c = 0;
        $(".activated").each(function(){
            var groupies = $(this);
            i ++;
            groupies.find(".groupie p").each(function(){
                j ++
                if($(this).html() === friendname){
                    alert("Your friend " + friendname + " already exists in the group " + groupnames[i - 1]);
                    c ++;
                } else {
                    if(j > 11){
                        alert("The maximum allowed number of group members is currently 12.");
                        c ++;
                    }
                }
                //console.log($(this).html(), "groupie", i , j);
            });
            j = 0;
            //console.log(groupies);
            
        });

        //console.log("groupnames", groupnames, friendname, friendid);
        if(groupnames.length > 0 && c === 0) {
            $.ajax({
                type: "POST",
                url: "/addgroupie",
                data: {friendid: friendid, groupnames:groupnames},
                success: function(result){
                    updategroups(result);
                }
            });
        } else {
            return
        }
    });

    $(".inst").click(function(){
        
        var par = $(this).prev().hasClass("hidden");
        if(par){
            $(this).html("Hide Instructions");
            $(this).prev().toggleClass("hidden");
        } else {
            $(this).html("Show Instructions");
            $(this).prev().toggleClass("hidden");
        }


    })

    
});




