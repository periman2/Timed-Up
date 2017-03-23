var mongoose = require("mongoose");

var GroupSchema = new mongoose.Schema({
    name: String,
    type: String,
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