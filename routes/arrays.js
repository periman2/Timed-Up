
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");

//add arrays to friendlist

router.post("/addarray", function(req, res){
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

router.get("/getarrays", function(req, res){
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        res.send(list[0].arrays);
    }).catch(function(err){
        throw err;
    });
});

//get group's arrays

router.get("/:groupid/getgrouparrays", function(req, res){
    groupid = req.params.groupid;
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
router.post("/delarray", function(req, res){
    var arrayid = req.body.arrayid;
    Friendlist.find({authid: req.user._id}).exec()
    .then(function(list){
        newlist = list[0];
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



module.exports = router;