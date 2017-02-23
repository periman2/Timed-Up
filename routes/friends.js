
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");


router.put("/search", isloggedin, function(req, res){
    User.find({username: req.body.nfriend.friendname}).exec()
    .then( function(friend){
        if(friend.length > 0){
            Friendlist.find({authid: req.user._id}).exec()
            .then( function(list){
                if (list[0].friends.indexOf(friend[0]._id) === -1) {
                    var newlist = list;
                    newlist[0].friends.push(friend[0]._id);
                    Friendlist.findByIdAndUpdate(list[0]._id, newlist[0], {new: true}).exec()
                    .then(function(updatedlist){
                        console.log("updated list " + updatedlist);
                        req.flash("success",req.body.nfriend.friendname + " is added to your friendlist!");
                        res.redirect(req.get('referer'));
                    }).catch(function(err){
                        throw err;
                    })
                } else {
                    req.flash("error", "You already added tha person to your friendlist");
                    res.redirect(req.get('referer'));
                }
            })
            .catch(function(error){
                throw error;
            });
        } else {
            req.flash("error", "Username isn't available");
            res.redirect(req.get('referer'));
        }
    });
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
        Friendlist.findByIdAndUpdate(list[0]._id, newlist, {new: true}).exec()
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