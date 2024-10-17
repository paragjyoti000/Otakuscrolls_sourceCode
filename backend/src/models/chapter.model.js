const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
    {
        sequenceNumber: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        novel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Novel",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chapter", chapterSchema);
