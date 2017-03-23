
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");
var moment = require('moment');
moment().format();

//add arrays to friendlist

router.post("/addarray", isloggedin,function(req, res){
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        var newlist = list[0];
        var newarray = {time: req.body.time, value: req.body.value}
        newlist.arrays.push(newarray);
        console.log(newlist);
        Friendlist.findByIdAndUpdate(newlist._id, newlist, {new: true}).exec()
        .then(function(updatedlist){
            console.log(updatedlist);
            res.send("something");
        }).catch(function(err){
            throw err;
        });
    }).catch(function(err){
        throw err;
    });
});

//get my arrays

router.get("/getarrays", isloggedin,function(req, res){
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        res.send(list[0].arrays);
    }).catch(function(err){
        throw err;
    });
});

//get group's arrays

router.get("/:groupid/getgrouparrays", isloggedin,  function(req, res){
    var groupid = req.params.groupid;
    Groups.findById(groupid).populate("groupies").exec()
    .then(function(group){
        console.log("the groupies is:",group.groupies);
        var arrays = [];
        async.forEachOf(group.groupies, function(groupie, key ,callback){
            Friendlist.find({authid: groupie._id}).exec()
            .then(function(list){
                arrays.push([list[0].arrays, groupie]);
                return callback();
            })
        }, function(err){
            if(err){
                return console.log(err);
            } else {
                console.log(arrays);
                res.send(arrays);
            }
        });
    });
});

// delete arrays
router.post("/delarray", isloggedin,function(req, res){
    var arrayid = req.body.arrayid;
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        var newlist = list[0];
        for(var i = newlist.arrays.length - 1; i >= 0; i--){
            if(newlist.arrays[i]._id.equals(arrayid)){
                newlist.arrays.splice(i, 1);
                break;
            }
        }
        Friendlist.findByIdAndUpdate(newlist._id, newlist, {new: true}).exec()
        .then(function(updatedlist){
            console.log(newlist);
            res.send("anything");
        }).catch(function(err){
            throw err;
        });
    }).catch(function(err){
        throw err;
    })
});

router.post("/editarray", isloggedin, function(req,res){
    var arrayid = req.body.event.id;
    var array = req.body.event;
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        var newlist = list[0];
        for(var i = newlist.arrays.length - 1; i >= 0; i--){
            if(newlist.arrays[i]._id.equals(arrayid)){
                //     hoursfromnow1 = reverse(moment().diff(value,"hours", true));
                var newvalue1 = (-1) * moment(newlist.arrays[i].time).diff(array.start, "hours", true);
                var newvalue2 = (-1) * moment(newlist.arrays[i].time).diff(array.end, "hours", true);
                newlist.arrays[i].value = [newvalue1, newvalue2];
                console.log(newlist.arrays[i].value, [newvalue1, newvalue2]);
                break;
            }
        }
        Friendlist.findByIdAndUpdate(newlist._id, newlist, {new: true}).exec()
        .then(function(updatedlist){
            console.log("been here too");
            
            res.send(updatedlist.arrays);
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