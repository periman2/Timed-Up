
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");

router.post("/searchforfriend", function(req, res){
    var ids = req.body.ids;
    var currentvalue = req.body.value;
    console.log("the comming value is:" + currentvalue);
    User.find({$and: [{"_id": {$nin: ids}}, {$or: [{username: {$regex: currentvalue,$options:"$i"}},{"slack.username": {$regex: currentvalue,$options:"$i"}}]}]}).exec()
    .then(function(users){
        console.log("users are" + users);
        if(users.length > 10){
            users = users.slice(0, 11);
        }
        res.send(users);
    })
})

router.post("/addfriend", function(req, res){
    var friendid = req.body.friendid;
    console.log("friendid" + friendid);
    Friendlist.findOneAndUpdate({authid: req.user._id},{$push: {friends: friendid}} , function(err, list){
        console.log("made a newfriend");
        res.send("success");
    })
});

//GETUSERDATA ROUTE
router.get("/getuserdata", function(req, res){
    User.findById(req.user._id, function(err, user){
        // /console.log(user);
        res.send(user);
    });
});

router.get("/getfriendlist", function(req, res){
    //console.log("this is the user's id::" + req.user._id);
    Friendlist.find({authid: req.user._id}).populate("authid friends arrays groups").exec()
    .then(function(list){
        //console.log("this is the list:" + list);
        res.send(list[0]);
    }).catch(function(err){
        throw err;
    })
});

//NEW FRIENDS ROUTE 
router.post("/getnewslackfriends", function(req, res){
    var friendids = req.body.slackids;
    //console.log(friendids, typeof friendids);
    User.find({"slack.teamid": req.user.slack.teamid, "slack.id": {$nin: friendids}}).populate("authid friends arrays groups").exec()
    .then(function(users){
        if(users.length > 0 && users!== null){
            var ids = users.map(function(user){
                return user._id;
            });
            //console.log("these are the ids ajax " + ids);
            Friendlist.findOneAndUpdate({authid: req.user._id}, {"$push": {"friends": {"$each": ids}}}, {new: true}).populate("authid friends arrays groups").exec()
            .then(function(updatedlist){
                //console.log("this is the updated friendlist : " + updatedlist);
                res.send(updatedlist[0]);
            }).catch(function(err){
                throw err;
            });
        } else {
            Friendlist.find({authid: req.user._id}).populate("authid friends arrays groups").exec()
            .then(function(list){
                //console.log("oldlist" + list[0]);
                res.send(list[0]);
            }).catch(function(err){
                throw err;
            })
        }
    })
});

// remove from friend
router.delete("/deletefriend", isloggedin,function(req, res){
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        var newlist = list[0];
        var friendid = req.body.friendid;
        var index = newlist.friends.indexOf(friendid);
        newlist.friends.splice(index, 1);
        console.log("newlist: ", newlist, friendid, index);
        Friendlist.findByIdAndUpdate(list[0]._id, newlist, {new: true}).populate("authid friends arrays groups").exec()
        .then(function(updatedlist){
           res.send(updatedlist);
        }).catch(function(err){
            throw err;
        })
    }).catch(function(err){
        throw err;
    });
});

function isloggedin(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

module.exports = router;