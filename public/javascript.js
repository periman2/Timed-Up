
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

            $("#" + group._id).append("<br><hr><a href='/" + group._id + "' class='btn btn-success grouppage' >Show Group Page</a>")
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
            url: "http://localhost:3000/getmygroups",
            success: function(groups) {
                creategroups(groups);
            },
            error: function(){
                console.log("error happened");
            }
        });
    }

    var friendlist = $("#friendlist").html();
    
    if($(location).attr("href") === "http://localhost:3000/" && friendlist !== undefined) {
        getgroups();
    }
    

    $("#addgroup").click(function(){
        if($("#groupname").val() !== "") {
            var name = $("#groupname");

            $.ajax({
                type: "POST",
                url: "http://localhost:3000/creategroup",
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
            url: "http://localhost:3000/deletefriend", 
            data: {friendid: friendid},
            success: function(result){
                console.log("deleted!");
                window.location.href = "http://localhost:3000/"
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
            url: "http://localhost:3000/deletegroup", 
            data: {groupname: groupname},
            success: function(result){
                if(result) {
                    getgroups();
                    return console.log("deleted group!");
                }
                // console.log("not deleted group!");
                // window.location.href = "http://localhost:3000/"
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
            url: "http://localhost:3000/deletegroupie", 
            data: {groupiename : groupiename , groupname: groupname},
            success: function(result){
                if(result) {
                    getgroups();
                    return console.log("deleted groupie!");
                }
                //console.log("not deleted group!");
                //window.location.href = "http://localhost:3000/"
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
        console.log(groupnames);
        if(groupnames.length > 0) {
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/addgroupie",
                data: {friendid: friendid, groupnames:groupnames},
                success: function(result){
                    getgroups();
                }
            });
        } else {
            return
        }

    });


    
});




