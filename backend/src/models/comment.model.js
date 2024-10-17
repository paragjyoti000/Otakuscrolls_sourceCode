const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        novel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Novel",
        },
        chapter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", commentSchema);
