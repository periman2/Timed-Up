var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var GroupSchema = new mongoose.Schema({
    name: String,
    authid: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
    },
    groupies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});

module.exports = mongoose.model("Group", GroupSchema);