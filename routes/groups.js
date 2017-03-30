
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");
var mongoose    = require("mongoose");

//delete group
router.delete("/deletegroup", isloggedin,function(req, res){
    Groups.find({name: req.body.groupname, authid: req.user._id}).populate("groupies").exec()
    .then(function(group){
        if(group[0].groupies.length > 0){
            async.forEachOf(group[0].groupies, function(groupie, key, callback){
                Friendlist.find({authid: groupie._id}).exec()
                .then(function(list){
                    newlist = list[0];
                    console.log("friendlist before loop", newlist)
                    for(var j = newlist.groups.length - 1; j >= 0; j --) {
                        if(newlist.groups[j].groupid.equals(group[0]._id)) {
                            newlist.groups.splice(j, 1);
                        }
                    }
                    console.log("friendlist after loop", newlist)
                    Friendlist.findByIdAndUpdate(newlist._id, newlist, {new: true}).exec()
                    .then(function(updatedlist){
                        console.log("friendlist after removal", updatedlist)
                        callback();
                    }).catch(function(err){
                        throw err;
                    })
                }).catch(function(err){
                    throw err;
                });
            }, function(err){
                if(err){
                    console.log(err);
                } else {
                    Groups.findByIdAndRemove(group[0]._id).exec()
                    .then(function(err){
                        res.send("done it finaly ");
                    }).catch(function(err){
                        throw err;
                    });
                }
            });
        } else {
            Groups.findByIdAndRemove(group[0]._id).exec()
            .then(function(err){
                res.send("done it finaly ");
            }).catch(function(err){
                throw err;
            });
        }
    });
});

//addgroupie

router.post("/addgroupie", isloggedin,function(req, res){
    Groups.find({authid: req.user._id, name:{$in: req.body.groupnames}}).populate("groupies").exec()
    .then(function(groups){
        async.forEachOf(groups, function(group, keys, callback){
            Groups.update({authid: req.user._id, name:group.name}, {$push: {groupies: req.body.friendid}}).exec()
            .then(function(updatedgroup){
                Friendlist.findOneAndUpdate({authid: req.body.friendid}, {$push: {groups: {authid: group.authid, groupid: group._id}}}).exec()
                .then(function(updatedlist){
                    //console.log("updatedlist: ", updatedlist);
                    callback();
                }).catch(function(err){
                    throw err;
                });
            }).catch(function(err){
                throw err;
            });
        }, function(err){
            if(err){
                console.log(err);
            } else {
                res.send(groups);
            }
        });
        
    }).catch(function(err){
        throw err;
    })
});

//delete groupie
router.post("/deletegroupie", isloggedin,function(req, res){
   var groupieid = req.body.groupieid;
   var groupname = req.body.groupname;
   console.log(groupieid);
   Groups.find({name: groupname, authid: req.user._id}).populate("groupies").exec()
   .then(function(group){
       newgroup = group[0];
        for(var i = newgroup.groupies.length - 1; i >= 0; i --){
            if(newgroup.groupies[i]._id.equals(groupieid)) {
                newgroup.groupies.splice(i, 1);
            }
        }
        Groups.findByIdAndUpdate(newgroup._id, newgroup, {new: true}).exec()
        .then(function(updatedGroup){
            Friendlist.find({authid: groupieid}).exec()
            .then(function(list){
                newlist = list[0];
                for(var j = newlist.groups.length - 1; j >= 0; j --) {
                    if(newlist.groups[j].groupid.equals(updatedGroup._id)) {
                        newlist.groups.splice(j, 1);
                    }
                }
                Friendlist.findByIdAndUpdate(newlist._id, newlist, {new: true}).exec()
                .then(function(updatedlist){
                    //console.log("finallist", updatedlist);
                    res.send("done it finaly ");
                }).catch(function(err){
                    throw err;
                })
            }).catch(function(err){
                throw err;
            });

        }).catch(function(err){
            throw err;
        });
   })
});

//ajax routes api

//creates a group for the user

router.post("/creategroup", isloggedin,function(req, res){
    var name = req.body.groupname;
    console.log("this is the group;s name"+name);
    var authid = req.user._id;
    var groupies = [req.user._id];
    var newgroup = {name: name, authid: authid, groupies:groupies}; 
    Groups.find({name: name, authid: authid}).exec()
    .then(function(groups){
        if(groups.length > 0){
            //req.flash("error", "You already created a group with this name");
            return res.send(false);
        } else {
            Groups.create(newgroup, function(err, group){
                if(err){
                    console.log(err);
                    return res.send("error with your group creations", err);
                }
                Groups.find({authid: req.user._id}).exec()
                .then(function(groups){
                    console.log(groups);
                    res.send(groups);
                }).catch(function(err){
                    throw err;
                })
            })
        }
    })
    
});

//get's all the groups that the user created

router.get("/getmygroups", isloggedin,function(req, res){
    Groups.find({authid: req.user._id}).populate("groupies").exec()
    .then(function(groups){
        console.log(groups);
        res.send(groups);
    }).catch(function(err){
        throw err;
    });
});

router.post("/getgroupmembers", isloggedin,function(req, res){
    //var groupname = req.body.groupname;
    var groupid = req.body.groupid;
    Groups.findById(groupid).populate("groupies").exec()
    .then(function(group){
        res.send(group);
    })
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