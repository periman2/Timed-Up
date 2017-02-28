
$(document).ready(function(){

    var friendlist = $("#friendlist").html();
    var groupcount = 0;

    getgroups();

    function updategroupclass(group) {
        var thisgroup = $("#" + group._id);
        //console.log(thisgroup.html());
        thisgroup.addClass("activated");
        thisgroup.css("background-color", "rgba(69, 232, 85, 0.6)");
    }
    
    function creategroups(groups){
        $("#groups").html("");
        //here I need to create a new way of showing the groups!
        // groups.forEach(function(groups){
            
        // });
        $.each(groups, function(i, group){
            //console.log(group);
            
            $("#groups").append("<div class='col-md-3' id='" + group._id + "'></div>");
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
                $("#" + group._id + " .onlynames").append("<li class='groupie'style='clear:both;'><i style='float:left;' class='fa fa-times deletegroupie' aria-hidden='true'></i><p style='float:left;'>"
                + groupie.username +
                "</p>");
            });
             $("#" + group._id + " .onlynames").css({
                "max-height": "180px",
                "overflow-y": "scroll"
             })

            $("#" + group._id).append("<br><hr><a href='/" + group._id + "' class='btn btn-default grouppage' >Show Group Page</a>");
            //console.log(group._id, typeof group._id);
            $("#" + group._id).css({
                "background-color": "rgba(188, 197, 205, 1)",
                "color": "rgba(56, 56, 56, 1)" ,
                "min-height": "30px",
                "max-heigth": "200px",
                "min-width": "230px",
                "position": "relative",
                "padding": "10px",
                "margin": "5px 5px",
                "-webkit-box-shadow": "0px 4px 6px 2px rgba(50, 50, 50, 0.68",
                "-moz-box-shadow":    "0px 4px 6px 2px rgba(50, 50, 50, 0.68)",
                "box-shadow":         "0px 4px 6px 2px rgba(50, 50, 50, 0.68)"
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
    

    $("#addgroup").click(function(){
        if($("#groupname").val() !== "") {
            var name = $("#groupname");

            if(groupcount >= 13){
                alert("You cannot create more than 12 groups")
            } else {
                $.ajax({
                    type: "POST",
                    url: "/creategroup",
                    data: name,
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
    $(".deletelist").click(function() {
        var friendid= $(this).prev().html();
        console.log(friendid);
        console.log(friendid);
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

    //delete group
    $("#groups").on("click", ".deletegroup", function() {
        var groupname= $(this).parent().parent().find(".title").html();
        console.log("name : " , groupname);
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
        var groupiename = $(this).next().html();
        var groupname = $(this).parent().parent().parent().find(".title").html();
        console.log( groupname, groupiename);
        $.ajax({
            type: "POST",
            url: "/deletegroupie", 
            data: {groupiename : groupiename , groupname: groupname},
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
            div.css("background-color", "rgba(188, 197, 205, 1)");
        } else {
            div.css("background-color", "rgba(69, 232, 85, 0.6)");
        }
        div.toggleClass("activated");
    });

    //add friend to selected groups

    $(".friendname").click(function(event){
        var friendid = $(this).parent().parent().find(".friend").html();
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

        //console.log("groupnames", groupnames, friendname);
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




