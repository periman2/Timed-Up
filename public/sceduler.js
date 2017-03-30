

//==============================
//          SCEDULER
//==============================

$(document).ready(function() {
    
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

    //============================
    //scheduler functionality
    //============================
    var loaded = false;

    function init() {
        
		scheduler.config.xml_date="%Y-%m-%d %H:%i";
        scheduler.config.hour_size_px = 30;
        scheduler.xy.scale_width = 100;
        scheduler.xy.bar_height = 5;
        
        scheduler.config.icons_select = [
        "icon_delete"
        ];
        // scheduler.config.readonly = true;
        scheduler.config.edit_on_create = false;
        scheduler.config.readonly_form = true;
        scheduler.config.collision_limit = 1; 
        scheduler.templates.event_class = function(start, end, ev){
            return "eventclass";
        }

        scheduler.locale.labels.new_event = "Free Time!";
		scheduler.init('schedulerDiv',new Date(),"week");
	}
    init();
    scheduler.blockTime({
        start_date:new Date(0),
        end_date:new Date(),
        days:"fullday",
        css:   "gray"
    });
    
    scheduler.attachEvent("onDblClick", function(id,ev){
        return false;
    })
    // scheduler.attachEvent("onBeforeEventCreated", function(id,ev){
    //     ev.color = "#a1a1a1";
    //     return false
    // })
    scheduler.attachEvent("onEventAdded", function(id,ev){
        // console.log("this is the created event", ev.start_date.toISOString());
        if(loaded){
            var start = ev.start_date.toISOString();
            var end = ev.end_date.toISOString();
            ev.color = "black"
            console.log(start, end, "this is the start and the end");
            createarray(start, end);
        }
    });
    scheduler.attachEvent("onEventChanged", function(id,ev){
        // console.log("this is the edited event", ev);
        console.log(loaded, "this is loaded");
        if(loaded){
            var event = {};
            event.start = ev.start_date.toISOString();
            event.end = ev.end_date.toISOString();
            event.id = ev.id;
            console.log(event);
            $.ajax({
                type: "POST",
                url: "/editarray",
                data: {event: event},
                success: function(data){
                    console.log("data that came back: ", data);
                    loaded = false;
                    // getarrays();
                    getarrays();
                }
            });
        }
    });
    scheduler.attachEvent("onEventDeleted", function(id){
        console.log(id);
        if(loaded){
            loaded = false;
            deletearray(id);
        }
    });
    scheduler.attachEvent("onBeforeDrag",function(id,drag_mode){
    return !(drag_mode=="create" && this._mode == "month");
    });
    var ev = scheduler.getEvents();
            
    function reverse(num){
        return (-1) *  num;
    }

    $("#arrays").on("click", ".btn-danger", function(){
        var arrayid = $(this).next().html();
        loaded = false;
        deletearray(arrayid);
        
    });

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

    function deletearray(arrayid) {
        $.ajax({
            type: "POST",
            url: "/delarray",
            data: {arrayid: arrayid},
            success: function(data){
                //console.log("success");
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
                deletearray(array._id);
            } else {
                //console.log(dateofexp, length, hours, time);
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
            //console.log(moment(daydiff[0]).format('MMMM Do, YYYY h:mm A'));
            $("#arrays").append(
                "<div class='myarray'><h3>"
                 + moment(daydiff[0]).format('MMMM Do, YYYY h:mm A') + 
                 " for: <br>"
                 + Math.floor(daydiff[1]/24) + 
                 " Days, "
                 + Math.floor(24 * (daydiff[1]/24 - Math.floor(daydiff[1]/24)))
                 + " Hours and "
                 + Math.ceil(60 * (daydiff[1] - Math.floor(daydiff[1]))) +
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
                console.log("alldata: ", data);
                buildarrays(newdata);
                updatescheduler(newdata);
                // console.log(newdata)
            },
            error: function(err){
                console.log(err);
            }
        });
        return false;
    }

    getarrays();

    function updatescheduler(newdata){
        // scheduler.clearAll();
        newdata.forEach(function(time){
            var thestart = moment(time[0]).format("DD/MM/YYYY HH:mm").toString();
            var theend = moment(time[0]).add(time[1], "hours").format("DD-MM-YYYY HH:mm").toString();
            // console.log(thestart, theend,  typeof thestart, typeof theend);
            var newitem = {id:time[2], start_date: thestart, end_date:theend, text:"Free time!"};
            // console.log("newitem : ", newitem);
            scheduler.addEvent(newitem);
        });
        loaded = true;
    }
    
    
    $("#submit").click(function(){
        var array = makearray(hoursfromnow1,hoursfromnow2);
        //var now = moment(mdy, 'MMMM Do, YYYY h:mm A').add(1,"minutes").toISOString()
        var now = moment(mdy, 'MMMM Do, YYYY h:mm A').toISOString();
        // console.log("the right 'now'", now, array);
        // $.ajax({
        //     type:"POST",
        //     url:"/addarray",
        //     data:{value: array, time: now},
        //     success: function(data){
        //         //console.log("done it!");
        //         getarrays();
        //     },
        //     error: function(err){
        //         console.log("something went wrong");
        //     }
        // })
        // return false;
    }); 

    function createarray(start, end) {
        loaded = false;
        var hoursfromnow1 = reverse(moment().diff(start,"hours", true));
        var hoursfromnow2 = reverse(moment().diff(end,"hours", true));
        var now = moment().toISOString();
        var array = [hoursfromnow1, hoursfromnow2];
        // console.log(array, now);
        $.ajax({
            type:"POST",
            url:"/addarray",
            data:{value: array, time: now},
            success: function(data){
                //console.log("done it!");
                getarrays();
            },
            error: function(err){
                console.log("something went wrong");
            }
        })
        return false;
    }

});  
