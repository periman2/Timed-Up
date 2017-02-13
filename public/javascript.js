
$(document).ready(function(){

    function updategroupclass(group) {
        var thisgroup = $("#" + group._id);
        //console.log(thisgroup.html());
        thisgroup.addClass("activated");
        thisgroup.css("background-color", "rgba(69, 232, 85, 0.6)");
    }
    
    function creategroups(groups){
        $("#groups").html("");
        $.each(groups, function(i, group){
            //console.log(group);
            
            $("#groups").append("<div class='col-md-3' id='" + group._id + "'></div>");
            $("#" + group._id).append(
                "<li><p class='title' style='float:left;'>"
                    + group.name + 
                    "</p></li><button style='float:right;display:inline' class='btn btn-danger deletegroup' >X</button><br><hr>"
                    );

            group.groupies.forEach(function(groupie){
                $("#" + group._id).append("<li class='groupie'style='clear:both;'><i style='float:left;' class='fa fa-times deletegroupie' aria-hidden='true'></i><p style='float:left;'>"
                + groupie.username +
                "</p>");
            });

            $("#" + group._id).append("<br><hr><a href='/" + group._id + "' class='btn btn-default grouppage' >Show Group Page</a>");
            //console.log(group._id, typeof group._id);
            $("#" + group._id).css({
                "background-color": "rgba(117, 150, 240, 0.4)",
                "color": "rgba(56, 56, 56, 1)" ,
                "min-width": "27%", 
                "min-height": "30px",
                "max-heigth": "200px",
                "border": "1px solid rgba(20, 20, 20, 0.3)",
                "border-radius":"5px",
                "position": "relative",
                "padding": "10px",
                "white-space": "nowrap"
            });
            $(".title").css({
                "font-size":"25px",
                "font-weight": "bold"
            });
            $("#" + group._id + " .title").css({
                "display": "table-cell"
            })
        })
    }
    function getgroups(){
        $.ajax({
            type:"GET",
            url: "/getmygroups",
            success: function(groups) {
                creategroups(groups);
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

    var friendlist = $("#friendlist").html();

    getgroups();
    

    $("#addgroup").click(function(){
        if($("#groupname").val() !== "") {
            var name = $("#groupname");

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
        } else {
            conosle.log("error");
        }
    });

    //delete friend from list
    $(".deletelist").click(function() {
        var friendid= $(this).parent().parent().children().html();
        console.log(friendid);
        $.ajax({
            type: "DELETE",
            url: "/deletefriend", 
            data: {friendid: friendid},
            success: function(result){
                console.log("deleted!");
                
            }
        })
        location.reload();
        return false;
    });

    //delete group
    $("#groups").on("click", ".deletegroup", function() {
        var groupname= $(this).prev().children("p").html();
        console.log("name : " , groupname);
        $.ajax({
            type: "DELETE",
            url: "/deletegroup", 
            data: {groupname: groupname},
            success: function(result){
                if(result) {
                    getgroups();
                    return console.log("deleted group!");
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
        var groupname = $(this).parent().parent().children(":first-child").children(":last-child").html();
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
                //console.log("not deleted group!");
                //window.location.href = "/"
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
            div.css("background-color", "rgba(117, 150, 240, 0.4)");
        } else {
            div.css("background-color", "rgba(69, 232, 85, 0.6)");
        }
        div.toggleClass("activated");
    });

    //add friend to selected groups

    $(".friendname").click(function(event){
        var friendid = $(this).parent().parent().children().html();
        var groupnames = [];
        var groupiesnames = [];
        $(".activated .title").each(function(i, element){
            groupnames.push($(this).html());
        });
        console.log("groupnames", groupnames);
        if(groupnames.length > 0) {
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


    
});




