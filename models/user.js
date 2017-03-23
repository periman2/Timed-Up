var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    slack: {
        username: String,
        teamid: String,
        token: String,
        id: String,
        email: String,
        teamname: String,
        avatar: String
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);