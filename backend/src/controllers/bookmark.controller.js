const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const Bookmark = require("../models/bookmark.model.js");
const mongoose = require("mongoose");

const addOrRemoveBookmark = asyncHandler(async (req, res) => {
    const { novelId } = req.params;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    const existingBookmark = await Bookmark.findOne({
        novel: novelId,
        user: req.user._id,
    });

    if (existingBookmark) {
        const deleteBookmark = await Bookmark.findByIdAndDelete(
            existingBookmark._id
        );

        if (!deleteBookmark) {
            throw new ApiError(500, "Failed to delete bookmark");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Bookmark deleted successfully",
                    deleteBookmark
                )
            );
    }

    const bookmark = await Bookmark.create({
        novel: novelId,
        user: req.user._id,
    });

    if (!bookmark) {
        throw new ApiError(500, "Failed to add bookmark");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Bookmark added successfully", bookmark));
});

const getBookmarks = asyncHandler(async (req, res) => {
    const bookmarks = await Bookmark.aggregate([
        {
            $match: {
                user: { $eq: new mongoose.Types.ObjectId(req.user._id) },
            },
        },
        {
            $lookup: {
                from: "novels",
                localField: "novel",
                foreignField: "_id",
                as: "novel",
                pipeline: [
                    {
                        $lookup: {
                            from: "chapters",
                            localField: "_id",
                            foreignField: "novel",
                            as: "chaptersCount",
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "uploadedBy",
                            foreignField: "_id",
                            as: "uploadedBy",
                            pipeline: [
                                {
                                    $project: {
                                        name: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            uploadedBy: {
                                $first: "$uploadedBy",
                            },
                            chaptersCount: {
                                $size: "$chaptersCount",
                            },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            coverImage: 1,
                            chaptersCount: 1,
                            uploadedBy: 1,
                            createdAt: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                novel: {
                    $first: "$novel",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);
    return res.status(200).json(new ApiResponse(200, "Success", bookmarks));
});

const isBookmarked = asyncHandler(async (req, res) => {
    const { novelId } = req.params;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    const bookmark = await Bookmark.findOne({
        novel: novelId,
        user: req.user?._id,
    });

    if (!bookmark) {
        return res.status(200).json(
            new ApiResponse(200, "Bookmark found successfully", {
                isBookmarked: false,
            })
        );
    }

    return res.status(200).json(
        new ApiResponse(200, "Bookmark found successfully", {
            isBookmarked: true,
        })
    );
});

const deleteBookmark = asyncHandler(async (req, res) => {
    const { bookmarkId } = req.params;
    if (!bookmarkId) {
        throw new ApiError(400, "Bookmark ID is required");
    }

    const bookmark = await Bookmark.findByIdAndDelete(bookmarkId);

    if (!bookmark) {
        throw new ApiError(404, "Bookmark not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Bookmark deleted successfully", bookmark));
});

module.exports = {
    addOrRemoveBookmark,
    getBookmarks,
    isBookmarked,
    deleteBookmark,
};
