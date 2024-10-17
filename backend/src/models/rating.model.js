const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    value: {
        type: Number,
        enum: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        required: true,
    },
    novel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Rating", ratingSchema);
