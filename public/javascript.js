
$(document).ready(function(){
    
    function creategroups(groups){
        $("#groups").html("");
        $.each(groups, function(i, group){
            console.log(group);
            $("#groups").append("<div id='" + group._id + "'></div>");
            $("#" + group._id).append(
                "<li><p class='title' style='float:left;'>"
                    + group.name + 
                    "</p></li><button style='float:right;display:table-cell' class='btn btn-danger deletegroup' >X</button><br><hr>"
                    );

            group.groupies.forEach(function(groupie){
                $("#" + group._id).append("<li class='groupie'style='clear:both;'><i style='float:left;' class='fa fa-times deletegroupie' aria-hidden='true'></i><p style='float:left;'>"
                + groupie.username +
                "</p>");
            });

            $("#" + group._id).append("<br><hr><a href='/" + group._id + "' class='btn btn-success grouppage' >Show Group Page</a>");
            console.log(group._id, typeof group._id);
            $("#" + group._id).css({
                "background-color": "rgba(184, 184, 184, 1)",
                "color": "rgba(56, 56, 56, 1)" ,
                "min-width": "27%", 
                "min-height": "30px",
                "float": "left",
                "border": "2px solid black",
                "border-radius":"15px",
                "position": "relative",
                "padding": "10px",
                "overflow": "auto",
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
        var friendid= $(this).next(".hidden").html();
        console.log(friendid);
        $.ajax({
            type: "DELETE",
            url: "/deletefriend", 
            data: {friendid: friendid},
            success: function(result){
                console.log("deleted!");
                window.location.href = "/"
            }
        })
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
                    return console.log("deleted groupie!");
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

    $("#groups").on("click", ".title", function() {
        var div = $(this).parent().parent();
        if(div.hasClass("activated")) {
            $(this).parent().parent().css("background-color", "rgba(184, 184, 184, 1)");
        } else {
            $(this).parent().parent().css("background-color", "rgba(186, 212, 165, 1)");
        }
        div.toggleClass("activated");
    });

    //add friend to selected groups

    $(".friendname").click(function(){
        var friendid = $(this).prev().html();
        var groupnames = [];
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
                    getgroups();
                }
            });
        } else {
            return
        }

    });

    //get included groups links
    $(".incgroups").on("click", ".inc", function() {
        var name = $(this).children(".firstone").html();
        var authid = $(this).children(".authorid").html();
        var groupid = $(this).children(".groupid").html();
        console.log(name, authid, groupid);
        var url = "/" + groupid;
        window.location.href = url;
        // $.ajax({
        //     type:"GET", 
        //     url: url,
        //     success: function(data){
        //         console.log(data);
        //     },
        //     error: function(err){
        //         console.log(err);
        //     }
        // })
        // return false;
    });


    
});




