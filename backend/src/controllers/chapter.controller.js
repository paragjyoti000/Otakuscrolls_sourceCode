const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const Chapter = require("../models/chapter.model.js");
const mongoose = require("mongoose");

const addChapter = asyncHandler(async (req, res) => {
    const { novelId } = req.params;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    const { sequenceNumber, title, content, isPublished } = req.body;

    if (!sequenceNumber || !title || !content) {
        throw new ApiError(400, "All fields are required");
    }

    const chapter = await Chapter.create({
        sequenceNumber,
        title,
        content,
        novel: novelId,
        isPublished,
    });

    if (!chapter) {
        throw new ApiError(500, "Failed to create chapter");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Chapter created successfully", chapter));
});

const updateChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Chapter ID is required");
    }

    const { sequenceNumber, title, content, isPublished } = req.body;

    if (!sequenceNumber || !title || !content) {
        throw new ApiError(400, "All fields are required");
    }

    const chapter = await Chapter.findByIdAndUpdate(
        id,
        {
            $set: {
                sequenceNumber,
                title,
                content,
                isPublished,
            },
        },
        {
            new: true,
        }
    );

    if (!chapter) {
        throw new ApiError(404, "Chapter not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chapter updated successfully", chapter));
});

const deleteChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Chapter ID is required");
    }

    const chapter = await Chapter.findByIdAndDelete(id);

    if (!chapter) {
        throw new ApiError(404, "Chapter not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chapter deleted successfully", chapter));
});

const getChapter = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Chapter ID is required");
    }

    const chapter = await Chapter.aggregate([
        {
            $match: {
                _id: {
                    $eq: new mongoose.Types.ObjectId(id),
                },
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
                        $lookup: {
                            from: "users",
                            localField: "translatedBy",
                            foreignField: "username",
                            as: "translatedBy",
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
                            translatedBy: {
                                $first: "$translatedBy",
                            },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            coverImage: 1,
                            genre: 1,
                            uploadedBy: 1,
                            translatedBy: 1,
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
    ]);

    if (!chapter.length) {
        throw new ApiError(404, "Chapter not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chapter fetched successfully", chapter[0]));
});

const getAllChaptersByNovel = asyncHandler(async (req, res) => {
    const { novelId } = req.params;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    const chapters = await Chapter.aggregate([
        {
            $match: {
                novel: new mongoose.Types.ObjectId(novelId),
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
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            coverImage: 1,
                            genre: 1,
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
                sequenceNumber: 1,
            },
        },
    ]);

    if (!chapters.length) {
        throw new ApiError(404, "Chapters not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chapters fetched successfully", chapters));
});

const getLatestChapters = asyncHandler(async (req, res) => {
    const chapters = await Chapter.aggregate([
        {
            $match: {
                isPublished: true,
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
                        $project: {
                            title: 1, // Only project the novel title
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                chapterTitle: "$title",
                title: {
                    $first: "$novel.title",
                },
                novelId: {
                    $first: "$novel._id",
                },
            },
        },
        {
            $sort: {
                updatedAt: -1,
            },
        },
        {
            $group: {
                _id: "$novelId",
                chapters: {
                    $push: "$$ROOT",
                },
            },
        },
        {
            $addFields: {
                chapters: {
                    $slice: ["$chapters", 2], // Limit to 2 chapters per novel
                },
            },
        },
        {
            $unwind: "$chapters",
        },
        {
            $replaceRoot: {
                newRoot: "$chapters",
            },
        },
        {
            $sort: {
                updatedAt: -1,
            },
        },
        {
            $limit: 10,
        },
        {
            $project: {
                novelId: 1,
                sequenceNumber: 1,
                title: 1,
                chapterTitle: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!chapters.length) {
        throw new ApiError(404, "Chapters not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chapters fetched successfully", chapters));
});

const updateChapterInfo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Chapter ID is required");
    }

    const { title, sequenceNumber, isPublished } = req.body;

    if (!title || !sequenceNumber) {
        throw new ApiError(400, "All fields are required");
    }

    const chapter = await Chapter.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                sequenceNumber,
                isPublished,
            },
        },
        {
            new: true,
        }
    );

    if (!chapter) {
        throw new ApiError(404, "Chapter not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Chapter updated successfully", chapter));
});

const getNewFeeds = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;

    const chapters = await Chapter.aggregate([
        {
            $lookup: {
                from: "novels",
                localField: "novel",
                foreignField: "_id",
                as: "novel",
                pipeline: [
                    {
                        $lookup: {
                            from: "ratings",
                            localField: "_id",
                            foreignField: "novel",
                            as: "avgRatings",
                            pipeline: [
                                {
                                    $group: {
                                        _id: null,
                                        avgRatings: {
                                            $avg: "$value",
                                        },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            avgRatings: {
                                $arrayElemAt: ["$avgRatings.avgRatings", 0],
                            },
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            coverImage: 1,
                            author: 1,
                            genres: 1,
                            status: 1,
                            avgRatings: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                novel: { $first: "$novel" }, // Flattening the novel array
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $group: {
                _id: "$novel._id", // Grouping by novel._id instead of novelId
                chapters: {
                    $push: "$$ROOT",
                },
            },
        },
        {
            $addFields: {
                chapters: {
                    $slice: ["$chapters", 2], // Limit to 2 chapters per novel
                },
            },
        },
        {
            $unwind: "$chapters",
        },
        {
            $replaceRoot: {
                newRoot: "$chapters",
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $facet: {
                metadata: [
                    { $count: "total" },
                    { $addFields: { page: +page, limit: +limit } },
                ],
                data: [
                    { $skip: +skip },
                    { $limit: +limit },
                    {
                        $project: {
                            novel: 1,
                            sequenceNumber: 1,
                            title: 1,
                            content: 1,
                            isPublished: 1,
                            createdAt: 1,
                            updatedAt: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                metadata: { $first: "$metadata" },
            },
        },
    ]);

    if (!chapters.length) {
        throw new ApiError(404, "Chapters not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Chapters fetched successfully", chapters[0])
        );
});

module.exports = {
    addChapter,
    updateChapter,
    deleteChapter,
    getChapter,
    getAllChaptersByNovel,
    getLatestChapters,
    updateChapterInfo,
    getNewFeeds,
};
