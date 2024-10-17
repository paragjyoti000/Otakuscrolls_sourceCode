const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const Comment = require("../models/comment.model.js");
const mongoose = require("mongoose");

const addNovelComment = asyncHandler(async (req, res) => {
    const { novelId } = req.params;
    const { content, parentId } = req.body;

    if (!novelId || !content) {
        throw new ApiError(400, "Novel ID or content is required");
    }

    const comment = await Comment.create({
        novel: novelId,
        content,
        user: req.user._id,
        parentId: parentId || null,
    });

    if (!comment) {
        throw new ApiError(500, "Failed to create comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment created successfully", comment));
});

const addChapterComment = asyncHandler(async (req, res) => {
    const { chapterId } = req.params;
    const { content, parentId } = req.body;

    if (!chapterId || !content) {
        throw new ApiError(400, "Chapter ID or content is required");
    }

    const comment = await Comment.create({
        chapter: chapterId,
        content,
        user: req.user._id,
        parentId: parentId || null,
    });

    if (!comment) {
        throw new ApiError(500, "Failed to create comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment created successfully", comment));
});

const getComments = asyncHandler(async (req, res) => {
    const { commentFor } = req.params;

    if (!commentFor) {
        throw new ApiError(400, "Novel ID is required");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                $or: [
                    { novel: new mongoose.Types.ObjectId(commentFor) },
                    { chapter: new mongoose.Types.ObjectId(commentFor) },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            username: 1,
                            avatar: 1,
                            role: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                user: { $first: "$user" },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);

    if (!comments) {
        throw new ApiError(500, "Failed to get comments");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comments fetched successfully", comments));
});

const editComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content) {
        throw new ApiError(400, "Comment ID or content is required");
    }

    const comment = await Comment.findByIdAndUpdate(
        id,
        {
            $set: {
                content,
            },
        },
        {
            new: true,
        }
    );

    if (!comment) {
        throw new ApiError(500, "Failed to edit comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment edited successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Comment ID is required");
    }

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
        throw new ApiError(500, "Failed to delete comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment deleted successfully", comment));
});

module.exports = {
    addNovelComment,
    addChapterComment,
    getComments,
    editComment,
    deleteComment,
};
