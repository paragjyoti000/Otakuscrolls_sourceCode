const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
    {
        novel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Novel",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
