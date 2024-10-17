const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId, //one who follows
            ref: "User",
        },
        following: {
            type: mongoose.Schema.Types.ObjectId, //one who is followed
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Follow", followSchema);
