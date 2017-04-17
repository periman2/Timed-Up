

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash        = require("connect-flash"),
    methodOverride = require("method-override");
    passport    = require("passport"),
    SlackStrategy = require('passport-slack').Strategy,
    User        = require("./models/user"),
    LocalStrategy = require("passport-local"),
    Friendlist = require("./models/friends");


var cookieParser = require('cookie-parser');
app.use(cookieParser());
var indexRoutes = require("./routes/index");
var groupRoutes = require("./routes/groups");
var friendRoutes = require("./routes/friends");
var arrayRoutes = require("./routes/arrays");
    

mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/plugins"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(require("express-session")({
    secret: "eisai upervolika agrioteros malakas",
    resave: false,
    saveUninitialized: false
}));


passport.use(new LocalStrategy(User.authenticate()));

passport.use(new SlackStrategy({
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
    // SAVE USER IN DB
    //console.log("userid and name " + profile.user.name+ " " + profile.user.id + " " + profile.team.id + profile.team.name);
    process.nextTick(function() {
        User.findOne({"slack.id": profile.user.id}, function(err, user){
            if(err){
                return done(err);
            }
            if(user){
                console.log("found you hehe :" + user);
                return done(null, user);
            } else {
                var newUser = new User();
                newUser.slack.id = profile.user.id;
                newUser.slack.username = profile.user.name;
                newUser.slack.teamname = profile.team.name;
                newUser.slack.teamid = profile.team.id;
                newUser.slack.email = profile.user.email;
                newUser.slack.avatar = profile.user.image_72;
                newUser.slack.token = accessToken;
                User.create(newUser, function(err, createduser){
                    if(err){
                        throw err;
                    }
                    //console.log("user isssss:" + createduser);
                    var newlist = {authid: createduser._id}
                    Friendlist.create(newlist, function(err, list){
                        if(err){
                            console.log(err);
                            throw err;
                        }
                        //console.log(list);
                        User.find({"slack.teamid": createduser.slack.teamid}).exec()
                        .then(function(users){
                            if(err){
                                return done(null, newUser);
                            }
                            //console.log("all users from the same team: " + users);
                            var ids = users.map(function(user){
                                return user._id
                            });
                            console.log("these are the ids" + ids);
                            Friendlist.findOneAndUpdate({authid: createduser._id}, {"$push": {"friends": {"$each": ids}}}, {new: true}).exec()
                            .then(function(updatedlist){
                                //console.log("this is the updated friendlist : " + updatedlist);
                                return done(null, newUser);
                            }).catch(function(err){
                                throw err;
                            })
                            //Friendlist.findByIdAndUpdate(list[0]._id, friends)
                        }).catch(function(err){
                            throw err;
                        });
                    });
                });
            }
        });
    });
    //done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.friend = req.friend;
    res.locals.list = req.list;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(friendRoutes);
app.use(groupRoutes);
app.use(arrayRoutes);
app.use(indexRoutes);

var URL = process.env.DATABASEURL || "mongodb://localhost/timedup2";
mongoose.connect(URL);
var PORT = process.env.PORT || 3000;

// app.get("/data/:", function(req, res){
//     res.sendStatus(204);
// });

app.get("*", function(req, res){
    res.sendStatus(204);
})

app.listen(PORT, function() {
    console.log("The Timed Up server has started");
});



