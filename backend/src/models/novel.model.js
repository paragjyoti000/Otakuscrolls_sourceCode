const mongoose = require("mongoose");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const novelSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
        },
        author: {
            type: String,
            required: true,
            index: true,
        },
        coverImage: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        glossaries: {
            type: String,
        },
        genres: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["Ongoing", "Completed", "Abandoned"],
            default: "Ongoing",
        },
        langOfOrigin: {
            type: String,
            enum: ["Japanese", "Korean", "Chinese", "English"],
            index: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        translatedBy: {
            type: mongoose.Schema.Types.String,
            ref: "User",
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

novelSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("Novel", novelSchema);
