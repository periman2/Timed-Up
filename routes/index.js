
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");
var mongoose    = require("mongoose");

router.get("/", isloggedin, function(req, res) {
    if(req.user !== undefined){
        Friendlist.find({authid: req.user._id}).populate("friends groups.authid groups.groupid").exec()
        .then(function(list){
            console.log(list[0].groups);
            res.render("landing", {list: list[0], user: req.user});
        }).catch(function(err){
            throw err;
        });
    } else {
        res.render("landing", {user: req.user});
    }
});

router.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

//go to sceduling page
router.get("/myscedule",isloggedin,  function(req, res){
    Friendlist.find({authid: req.user._id}).populate("friends groups.authid groups.groupid").exec()
    .then(function(list){
        res.render("scedule", {list: list[0], user: req.user, arrays: list[0].arrays});
    }).catch(function(err){
        throw err;
    })
});

//login logic

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/myscedule",
    failureRedirect: "/login"
}) ,function(req, res){
});

//logic route logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register",{"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            var newlist = {authid: req.user._id}
            Friendlist.create(newlist, function(err, list){
                if(err){
                    console.log(err);
                    return res.redirect("/register");
                }
                //console.log(list);
                req.flash("success", "Welcome to Timed-UP! Start with adding" + user.username);
                res.redirect("/myscedule");
            });
        });
    });
});

router.get("/register", function(req, res){
    res.render("register");
});



router.get("/:groupid", isloggedin,function(req, res){
    groupid = req.params.groupid;
    //console.log(groupid, typeof groupid);
    Groups.findById(groupid).populate("groupies").exec()
    .then(function(group){
        Friendlist.find({authid: req.user._id}).populate("friends groups.authid groups.groupid").exec()
        .then(function(list){
            //console.log(list, "this isth elist")
            res.render("group", {group: group, list: list[0]});
        }).catch(function(err){
            throw err;
        });
    }).catch(function(err){
        throw err;
    })
})

function isloggedin(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

module.exports = router;