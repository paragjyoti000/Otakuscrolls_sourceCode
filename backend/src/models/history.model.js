const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        novel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Novel",
        },
        chapters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Chapter",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("History", historySchema);
