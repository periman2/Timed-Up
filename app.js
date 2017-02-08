

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash        = require("connect-flash"),
    methodOverride = require("method-override");
    passport    = require("passport"),
    User        = require("./models/user"),
    LocalStrategy = require("passport-local");

var cookieParser = require('cookie-parser');
app.use(cookieParser());
indexRoutes = require("./routes/index");
groupRoutes = require("./routes/groups");
friendRoutes = require("./routes/friends");
arrayRoutes = require("./routes/arrays");
    

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/coordinator19");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// User.remove();
app.use(require("express-session")({
    secret: "eisai upervolika agrioteros malakas",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("*", function(req, res){
    res.send("<h1>Sorry, no page here for you, you sneaky person!</h1>")
})

app.listen(3000, function() {
    console.log("The Time Coordinator server has started");
});



