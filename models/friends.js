var mongoose = require("mongoose");

var FriendlistSchema = new mongoose.Schema({
    authid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    arrays: [
        {
            value: [],
            time: String
        }
    ],
    groups: [
        {
            groupid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Group"
            },
            authid:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }

        }
    ]   
});

module.exports = mongoose.model("Friendlist", FriendlistSchema);