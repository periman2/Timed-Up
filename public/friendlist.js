$(document).ready(function(){
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
                console.log("friendlist:", slackfriends, user);
                if(user.slack !== undefined){
                    getnewslackfriends(slackfriends, user);
                } else {
                    var seperatedfriends = seperatefriends(list, user);
                    console.log(seperatedfriends,"here they are");
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
                console.log(slacklist.friends + "updatedlist");
                var seperatedfriends = seperatefriends(slacklist, user);
                showfriendlist(seperatedfriends, user);
                console.log(seperatedfriends,"here they are slack");
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
                console.log("sdffffff", user.slack.teamid, friends[i].slack.teamid)
                if(user.slack.teamid === friends[i].slack.teamid){
                    friendsfrommyslackteam.push(friends[i]);
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
                        $(".myfriendlist").append("<img height='30'' width='30' src='" + friend.slack.avatar + "'><li class=" + friend._id + "><p>" + friend.slack.username + "</p></li><br>");
                    });
                }
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack - other</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<img height='30'' width='30' src='" + friend.slack.avatar + "'><li class=" + friend._id + "><p>" + friend.slack.username + "</p><i class='fa fa-times' aria-hidden='true'></i></li><br>");
                    });
                }
                if(friends[2].length > 0){
                    $(".myfriendlist").append("<h4>Local friends</h4>");
                    friends[2].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><p>" + friend.username + "</p><i class='fa fa-times' aria-hidden='true'></i></li><br>");
                    });
                }
            } else {
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<img height='30'' width='30' src='" + friend.slack.avatar + "'><li class=" + friend._id + "><p>" + friend.slack.username + "</p><i class='fa fa-times' aria-hidden='true'></i></li><br>");
                    });
                }
                if(friends[2].length > 0){
                    friends[2].forEach(function(friend){
                        $(".myfriendlist").append("<li class=" + friend._id + "><p>" + friend.username + "</p><i class='fa fa-times' aria-hidden='true'></i></li><br>");
                    });
                }
            }
        }
        
        if($(".activenow").hasClass("slackfriends")){
            if(user.slack !== undefined){
                if(friends[1].length > 0){
                    $(".myfriendlist").append("<h4>Slack - " + user.slack.teamname + "</h4>");
                    friends[1].forEach(function(friend){
                        $(".myfriendlist").append("<img height='30'' width='30' src='" + friend.slack.avatar + "'><li class=" + friend._id + "><p>"  + friend.slack.username + "</p></li><br>");
                    });
                }
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack - other</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<img height='30'' width='30' src='" + friend.slack.avatar + "'><li class=" + friend._id + "></i><p>"  + friend.slack.username + "</p><i class='fa fa-times' aria-hidden='true'></li><br>");
                    });
                }
            } else {
                if(friends[0].length > 0){
                    $(".myfriendlist").append("<h4>Slack</h4>");
                    friends[0].forEach(function(friend){
                        $(".myfriendlist").append("<img height='30'' width='30' src='" + friend.slack.avatar + "'><li class=" + friend._id + "><p>" + friend.slack.username + "</p><i class='fa fa-times' aria-hidden='true'></i></li><br>");
                    });
                }
            }
        }
        if($(".activenow").hasClass("localfriends")){
            if(friends[2].length > 0){
                $(".myfriendlist").append("<h4>Local friends</h4>");
                friends[2].forEach(function(friend){
                    $(".myfriendlist").append("<li class=" + friend._id + "><p>" + friend.username + "</p><i class='fa fa-times' aria-hidden='true'></i></li><br>");
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
            "padding-left": "5px",
            "border-left": "4px solid rgba(125, 149, 176, 1)",
            "cursor": "pointer"
        });
        $(".myfriendlist li p").css({
            "display":"inline-block",
            "cursor": "pointer"
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

    
    //MAKE THIS RUN CONTINIOUSLY AND MAKE FRIENDLIST JQUERY BASED!!
    //getfriendlist()
    getuserdata();
    //============================
    //FRIENDLIST FUNCTIONALITY END
    //============================

    

});