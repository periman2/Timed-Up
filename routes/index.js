
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Friendlist = require("../models/friends");
var Groups = require("../models/groups")
var async = require("async");
var mongoose    = require("mongoose");
var request = require("request");
var SlackStrategy = require('passport-slack').Strategy;
var Team = require("../models/teams");
//===========================
//ROUTES FOR TIMED-UP BOT
//===========================
var websiteurl = "https://timedupchingu.herokuapp.com/";

router.get("/slack/botauth", function(req, res){
    var data = {form: {
        client_id: process.env.SLACK_CLIENT_ID_OFBOT,
        client_secret: process.env.SLACK_CLIENT_SECRET_OFBOT,
        code: req.query.code
    }};
    
    request.post('https://slack.com/api/oauth.access', data, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var token = JSON.parse(body).access_token;
            console.log("success with that" + JSON.parse(body));
            request.post('https://slack.com/api/team.info', {form: {token: token}}, function (error, response, body) {
                console.log("success with that too" + JSON.parse(body));
                if (!error && response.statusCode == 200) {
                    var teamid = JSON.parse(body).team.id;
                    var teamname = JSON.parse(body).team.name;
                    Team.find({name: teamname, id: teamid}, function(err, foundteam){
                        if(foundteam.length > 0 && foundtam){
                            return send("Another person from the team already added the app.");
                        }
                        Team.create({name: teamname, id: teamid, token: token}, function(err, newteam){
                            console.log("this is a new team " + newteam);
                            res.redirect("/");
                        });
                    })
                } else {
                    return send("error happend with the server")
                }
            });
        }
    });
});

router.post("/timedup-help", function(req, res){
    if(req.body.token === process.env.SLACK_BOT_TOKEN){
        let data = {
        text: "To use the app go to: <" + websiteurl + " > \nAvailable commands are: \n /timedup-makegroup - Creates a group using the name and the members of the channel that have at some point sign in to the Timed-UP app using slack.(works with channels of 150 members or less) \n /timedup-groupinfo - Gives you the information of the group you've created based on the channel you're currently in. This works only if you have first created a group. \n /timedup-help - Gives you this information window... no I'm not underestimating your intelligence it just seemed right to add this."};
        res.json(data);
    } else {
        res.json({text: "YOU ARE NOT VERIRFIED TO DO THAT. SIGN IN TO A TEAM AND THE TIMED-UP APP FIRST."});
    }
});

router.post("/timedup-groupinfo", function(req, res){
    if(req.body.token === process.env.SLACK_BOT_TOKEN){
        if(req.body.channel_name !== "directmessage"){
            if(req.body.channel_name !== "privategroup") {
                User.find({"slack.id":req.body.user_id, "slack.teamid":req.body.team_id}, function(err, slackuser){
                    //console.log("this is the body", req.body, slackuser[0]);
                    if(slackuser[0]){
                        Team.find({id: req.body.team_id}).exec()
                        .then(function(team){
                            request.post('https://slack.com/api/channels.info', {form: {token: team[0].token, channel: req.body.channel_id}}, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    Groups.find({type: "Slack", name: req.body.channel_name, authid: slackuser[0]._id}).populate("groupies").exec()
                                    .then(function(groupfound){
                                        if(groupfound !== undefined && groupfound.length > 0){
                                            //console.log(groupfound[0] + "thisis the groupfound");
                                            var usernames = groupfound[0].groupies.map(function(el){return el.slack.username});
                                            res.json({
                                                text: "Group information:\n Name: " + groupfound[0].name + "\n members: " + usernames + "\n group page: <" + websiteurl + groupfound[0]._id + ">" 
                                            });
                                        } else {
                                            let data = {
                                            text: "You haven't created a group using this channel.\n You can do that by typing the command: /timedup-makegroup. \nIf you want to learn more about the bot's functionality type /timedup-help.\n You can find the Timed-UP web app here: <" + websiteurl +">"};
                                            res.json(data);
                                        }
                                    }).catch(function(err){
                                        throw err;
                                    })
                                } else {
                                    res.json({text: "failed big time!"});
                                }
                            });
                        }).catch(function(err){
                            throw err;
                        });
                    } else {
                        let data = {
                        text: "In order to use this bot you need to first sign in to the Timed-UP application using slack. \nYou can find it here: <" + websiteurl +">"};
                        res.json(data);
                    }
                });
            } else {
                User.find({"slack.id":req.body.user_id, "slack.teamid":req.body.team_id}, function(err, slackuser){
                    console.log("this is the body", req.body);
                    if(slackuser[0]){
                        Team.find({id: req.body.team_id}).exec()
                        .then(function(team){
                            request.post('https://slack.com/api/groups.info', {form: {token: team[0].token, channel: req.body.channel_id}}, function (error, response, body) {
                                console.log(response.statusCode, JSON.parse(body) + "this is inside the groups now" + process.env.SLACK_OAUTH_TOKEN);
                                if (!error && response.statusCode == 200 && JSON.parse(body).ok) {
                                    console.log("haha " + JSON.parse(body));
                                    let channelmembers = JSON.parse(body).group.members;
                                    let channelname = JSON.parse(body).group.name;
                                    //console.log("members are: " + channelmembers);
                                    if(channelmembers.length < 150){
                                        // res.json({text: "Cool!"});
                                        Groups.find({type: "Slack", name: channelname, authid: slackuser[0]._id}).exec()
                                        .then(function(groupfound){
                                            console.log("groupfound" + groupfound);
                                            if(groupfound !== undefined && groupfound.length > 0){
                                                //console.log("groupfound: " + groupfound);
                                                var usernames = groupfound[0].groupies.map(function(el){return el.slack.username});
                                                res.json({
                                                    text: "Group information:\n Name: " + groupfound[0].name + "\n members: " + usernames + "\n group page: <" + websiteurl + groupfound[0]._id + ">" 
                                                });
                                            } else {
                                                let data = {
                                                text: "You haven't created a group using this channel.\n You can do that by typing the command: /timedup-makegroup. \nIf you want to learn more about the bot's functionality type /timedup-help.\n You can find the Timed-UP web app here: <" + websiteurl +">"};
                                                res.json(data);
                                            }
                                        }).catch(function(er){
                                            throw er;
                                        })
                                    } else {
                                        res.json({text: "Only channels with 150 or less members can create groups automatically."});
                                    }
                                    //res.json({text: "found them thank you for your info"});
                                } else {
                                    res.json({text: "Something went wrong with you request. Make sure this channel is public."});
                                }
                            });
                        });
                    } else {
                        let data = {
                        text: "In order to use this bot you need to first sign in to the Timed-UP application using slack.\n You can find it here: <" + websiteurl +">"};
                        res.json(data);
                    }
                });
            }
        } else {
            res.json({text: "This command won't work for direct messages. You'll have to be in a public or privet channel."});
        }
    } else {
        res.json({text: "YOU ARE NOT VERIRFIED TO DO THAT. SIGN IN TO A TEAM AND THE TIMED-UP APP FIRST."});
    }
});

router.post("/timedup-makegroup", function(req, res){
    //console.log("THIS IS WHAT CAME TO ME" + req.body.token +"   " +process.env.SLACK_BOT_TOKEN);
    if(req.body.token === process.env.SLACK_BOT_TOKEN){
        if(req.body.channel_name !== "directmessage"){
            if(req.body.channel_name !== "privategroup") {
                User.find({"slack.id":req.body.user_id, "slack.teamid":req.body.team_id}, function(err, slackuser){
                    console.log("this is the body", req.body);
                    if(slackuser[0]){
                        Team.find({id: req.body.team_id}).exec()
                        .then(function(team){
                            console.log("this is the team : " + team + "and this is the token " + team[0].token);
                            request.post('https://slack.com/api/channels.info', {form: {token: team[0].token, channel: req.body.channel_id}}, function (error, response, body) {
                                console.log(response.statusCode, JSON.parse(body) + "inside channel now" + process.env.SLACK_OAUTH_TOKEN);
                                if (!error && response.statusCode == 200 && JSON.parse(body).ok) {
                                    console.log("haha " + JSON.parse(body));
                                    let channelmembers = JSON.parse(body).channel.members;
                                    //console.log("members are: " + channelmembers);
                                    if(channelmembers.length < 150){
                                        // res.json({text: "Cool!"});
                                        Groups.find({type: "Slack", name: req.body.channel_name, authid: slackuser[0]._id}).exec()
                                        .then(function(groupfound){
                                            if(groupfound !== undefined && groupfound.length > 0){
                                                //console.log("groupfound: " + groupfound);
                                                res.json({text: "You already created a Timed-UP group for this channel in your account.\n To get the group information use the /timedup-groupinfo command.\n This is your group's page: <"+ websiteurl + groupfound[0]._id + ">"});
                                            } else {
                                                var newgroup = {type: "Slack", name: req.body.channel_name, authid: slackuser[0]._id, groupies: []}
                                                Groups.create(newgroup, function(err, group){
                                                    User.find({"slack.teamid": req.body.team_id, "slack.id":{$in: channelmembers}}).exec()
                                                    .then(function(foundusers){
                                                        // res.json({text: "Cool!"});
                                                        if(foundusers.length > 0){
                                                            //console.log("these are the found users", foundusers);
                                                            var ids = foundusers.map(function(el){return el._id});
                                                            Groups.findByIdAndUpdate(group._id, {$push: {groupies: { $each: ids}}}, {new: true}).exec()
                                                            .then(function(editedgroup){
                                                                async.forEachOf(foundusers, function(thisuser, key, callback){
                                                                    var newgroup = {authid: slackuser[0]._id, groupid: editedgroup._id};
                                                                    Friendlist.findOneAndUpdate({authid: thisuser._id}, {$push: {groups: newgroup}}, {new: true}).exec()
                                                                    .then(function(list){
                                                                        //console.log("list is now :" + list);
                                                                        callback();
                                                                    }).catch(function(err){
                                                                        throw err;
                                                                    })
                                                                }, function(err){
                                                                    if(err){
                                                                        return console.log(err);
                                                                    }
                                                                    console.log(editedgroup);
                                                                    var usernames = foundusers.map(function(el){return el.slack.username + " "})
                                                                    res.json({
                                                                        text: "A group was successfully created in the " + slackuser[0].slack.username 
                                                                        + "'s timed up account containing those members: \n" 
                                                                        + usernames +  ".\n You can view and edit it here: <" + websiteurl
                                                                        + editedgroup._id + ">"
                                                                    });
                                                                })
                                                                
                                                            }).catch(function(err){
                                                                throw err;
                                                            })
                                                        } else {
                                                            console.log("something bad happened");
                                                            res.json({text: "Something went wrong please try again and make sure this channel has less than 150 members."});
                                                        }
                                                    }).catch(function(err){
                                                        throw err;
                                                    })
                                                });
                                            }
                                        })
                                        
                                    } else {
                                        res.json({text: "Only channels with 150 or less members can create groups automatically."});
                                    }
                                    //res.json({text: "found them thank you for your info"});
                                } else {
                                    res.json({text: "Something went wrong with you request."});
                                }
                            });
                        });
                    } else {
                        let data = {
                        text: "In order to use this bot you need to first sign in to the Timed-UP application using slack.\n You can find it here: <" + websiteurl +">"};
                        res.json(data);
                    }
                });
            } else {
                User.find({"slack.id":req.body.user_id, "slack.teamid":req.body.team_id}, function(err, slackuser){
                    console.log("this is the body", req.body);
                    if(slackuser[0]){
                        Team.find({id: req.body.team_id}).exec()
                        .then(function(team){
                            request.post('https://slack.com/api/groups.info', {form: {token: team[0].token, channel: req.body.channel_id}}, function (error, response, body) {
                                console.log(response.statusCode, JSON.parse(body) + "this is inside the groups now" + process.env.SLACK_OAUTH_TOKEN);
                                if (!error && response.statusCode == 200 && JSON.parse(body).ok) {
                                    console.log("haha " + JSON.parse(body));
                                    let channelmembers = JSON.parse(body).group.members;
                                    let channelname = JSON.parse(body).group.name;
                                    //console.log("members are: " + channelmembers);
                                    if(channelmembers.length < 150){
                                        // res.json({text: "Cool!"});
                                        Groups.find({type: "Slack", name: channelname, authid: slackuser[0]._id}).exec()
                                        .then(function(groupfound){
                                            if(groupfound !== undefined && groupfound.length > 0){
                                                //console.log("groupfound: " + groupfound);
                                                res.json({text: "You already created a Timed-UP group for this channel in your account.\n To get the group information use the /timedup-groupinfo command.\n This is your group's page: <"+ websiteurl + groupfound[0]._id + ">"});
                                            } else {
                                                var newgroup = {type: "Slack", name: channelname, authid: slackuser[0]._id, groupies: []}
                                                Groups.create(newgroup, function(err, group){
                                                    User.find({"slack.teamid": req.body.team_id, "slack.id":{$in: channelmembers}}).exec()
                                                    .then(function(foundusers){
                                                        // res.json({text: "Cool!"});
                                                        if(foundusers.length > 0){
                                                            //console.log("these are the found users", foundusers);
                                                            var ids = foundusers.map(function(el){return el._id});
                                                            Groups.findByIdAndUpdate(group._id, {$push: {groupies: { $each: ids}}}, {new: true}).exec()
                                                            .then(function(editedgroup){
                                                                async.forEachOf(foundusers, function(thisuser, key, callback){
                                                                    var newgroup = {authid: slackuser[0]._id, groupid: editedgroup._id};
                                                                    Friendlist.findOneAndUpdate({authid: thisuser._id}, {$push: {groups: newgroup}}, {new: true}).exec()
                                                                    .then(function(list){
                                                                        //console.log("list is now :" + list);
                                                                        callback();
                                                                    }).catch(function(err){
                                                                        throw err;
                                                                    })
                                                                }, function(err){
                                                                    if(err){
                                                                        return console.log(err);
                                                                    }
                                                                    console.log(editedgroup);
                                                                    var usernames = foundusers.map(function(el){return el.slack.username + " "})
                                                                    res.json({
                                                                        text: "A group was successfully created in the " + slackuser[0].slack.username 
                                                                        + "'s timed up account containing those members: \n" 
                                                                        + usernames +  ".\n You can view and edit it here: <" + websiteurl
                                                                        + editedgroup._id + ">"
                                                                    });
                                                                })
                                                                
                                                            }).catch(function(err){
                                                                throw err;
                                                            })
                                                        } else {
                                                            console.log("something bad happened");
                                                            res.json({text: "Something went wrong please try again and make sure this channel has less than 150 members."});
                                                        }
                                                    }).catch(function(err){
                                                        throw err;
                                                    })
                                                });
                                            }
                                        })
                                        
                                    } else {
                                        res.json({text: "Only channels with 150 or less members can create groups automatically."});
                                    }
                                    //res.json({text: "found them thank you for your info"});
                                } else {
                                    res.json({text: "Something went wrong with you request. Make sure this channel is public."});
                                }
                            });
                        });
                    } else {
                        let data = {
                        text: "In order to use this bot you need to first sign in to the Timed-UP application using slack.\n You can find it here: <" + websiteurl +">"};
                        res.json(data);
                    }
                });
            }
        } else {
            res.json({text: "This command won't work for direct messages. You'll have to be in a public or privet channel."});
        }
    } else {
        res.json({text: "YOU ARE NOT VERIRFIED TO DO THAT. \nSIGN IN TO A TEAM AND THE TIMED-UP APP FIRST."});
    }
});

//===========================
//ROUTES FOR TIMED-UP BOT END
//===========================
router.get('/auth/slack/',
  passport.authenticate('slack', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("I'm hereeeeeee");
    res.redirect('/myschedule');
});

router.get("/", isloggedin, function(req, res) {
    if(req.user !== undefined){
        Friendlist.find({authid: req.user._id}).populate("friends groups.authid groups.groupid").exec()
        .then(function(list){
            //console.log(list[0].groups);
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
router.get("/myschedule",isloggedin,  function(req, res){
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
    successRedirect: "/myschedule",
    failureRedirect: "/login"
}) ,function(req, res){
});

//logic route logout
router.get("/logout", isloggedin,function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

router.get("/logoutuser", function(req, res){
    var user = req.user;
    console.log(user);
    res.send("okay I'm done");
})

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register",{"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            var newlist = {authid: req.user._id, friends: [user._id]}
            Friendlist.create(newlist, function(err, list){
                if(err){
                    console.log(err);
                    return res.redirect("/login");
                }
                //console.log(list);
                req.flash("success", "Welcome to Timed-UP " + user.username);
                res.redirect("/myschedule");
            });
        });
    });
});

router.post("/registerslack", function(req, res){
    var newUser = {username: req.body.username};
    User.create(newUser, function(err, user){
        console.log(user);
        res.render("scedule",{currentUser: user});
    })
})

router.get("/:groupid", isloggedin,function(req, res){
    groupid = req.params.groupid;
    //console.log(groupid, typeof groupid);
    Groups.findById(groupid).populate("authid").exec()
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