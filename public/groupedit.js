$(document).ready(function(){

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
        })
        return false;
    });

    $(".friendname").click(function(event){
        var friendname = $(this).html();
        var friendid = $(this).parent().parent().find(".friend").html();
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
})