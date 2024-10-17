const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const Novel = require("../models/novel.model.js");
const Chapter = require("../models/chapter.model.js");
const Rating = require("../models/rating.model.js");
const Bookmark = require("../models/bookmark.model.js");
const Comment = require("../models/comment.model.js");
const History = require("../models/history.model");
const mongoose = require("mongoose");
const fs = require("fs");

const addNovel = asyncHandler(async (req, res) => {
    const {
        title,
        author,
        description,
        glossaries,
        genres,
        status,
        langOfOrigin,
        isPublished,
        translatedBy,
    } = req.body;

    if (
        !title ||
        !author ||
        !description ||
        !status ||
        !langOfOrigin ||
        !translatedBy
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const coverImage = req.file?.path;

    if (!coverImage) {
        throw new ApiError(400, "Cover image is required");
    }

    const novel = await Novel.create({
        title,
        author,
        coverImage: `https://${req.get("host")}/` + coverImage,
        description,
        glossaries,
        genres,
        status,
        langOfOrigin,
        translatedBy,
        uploadedBy: req.user._id,
        isPublished,
    });

    if (!novel) {
        fs.unlinkSync(coverImage, (err) => {
            if (err) {
                new ApiError(500, "Failed to delete cover image");
            }

            console.log(
                "Cover image deleted successfully !!",
                existingNovel.coverImage
            );
            throw new ApiError(500, "Failed to create novel");
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "Novel created successfully", novel));
});

const updateNovel = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Novel ID is required");
    }

    const {
        title,
        author,
        description,
        glossaries,
        genres,
        status,
        langOfOrigin,
        isPublished,
        translatedBy,
    } = req.body;

    if (
        !title ||
        !author ||
        !description ||
        !status ||
        !langOfOrigin ||
        !translatedBy
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Delete cover image if it's not provided
    const existingNovel = await Novel.findById(id);

    if (!existingNovel) {
        throw new ApiError(404, "Novel not found");
    }
    const coverImage = req.file?.path;

    if (coverImage && coverImage !== undefined) {
        fs.unlinkSync(
            existingNovel.coverImage.replace(`https://${req.get("host")}/`, ""),
            (err) => {
                if (err) {
                    new ApiError(500, "Failed to delete cover image");
                }

                console.log(
                    "Cover image deleted successfully !! ",
                    existingNovel.coverImage
                );
            }
        );
    }

    const novel = await Novel.findByIdAndUpdate(
        id,
        {
            $set: {
                title,
                author,
                coverImage:
                    coverImage && coverImage !== undefined
                        ? `https://${req.get("host")}/` + coverImage
                        : existingNovel.coverImage,
                description,
                glossaries,
                genres,
                status,
                langOfOrigin,
                isPublished,
                translatedBy,
            },
        },
        {
            new: true,
        }
    );

    if (!novel) {
        throw new ApiError(404, "Novel not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novel updated successfully", novel));
});

const deleteNovel = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Novel ID is required");
    }

    const comments = await Comment.deleteMany({
        novel: id,
    });

    const chapters = await Chapter.find({
        novel: id,
    });

    let ChapterComments = [];
    let deletedChapters = [];

    chapters.forEach(async (chp) => {
        const comments = await Comment.deleteMany({
            chapter: chp._id,
        });

        ChapterComments.push(comments);

        const chapter = await Chapter.findByIdAndDelete(chp._id);
        deletedChapters.push(chapter);
    });

    const ratings = await Rating.deleteMany({
        novel: id,
    });

    const bookmarks = await Bookmark.deleteMany({
        novel: id,
    });

    const history = await History.deleteMany({
        novel: id,
    });

    const novel = await Novel.findByIdAndDelete(id);

    fs.unlinkSync(
        novel.coverImage.replace(`https://${req.get("host")}/`, ""),
        (err) => {
            if (err) {
                new ApiError(500, "Failed to delete cover image");
            }

            console.log(
                "Cover image deleted successfully !! ",
                novel.coverImage
            );
        }
    );

    if (!novel) {
        throw new ApiError(404, "Novel not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Novel with all chapters deleted successfully", {
            novel,
            comments,
            deletedChapters,
            ChapterComments,
            ratings,
            bookmarks,
            history,
        })
    );
});

const getNovel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const skip = (page - 1) * limit;

    if (!id) {
        throw new ApiError(400, "Novel ID is required");
    }

    const novel = await Novel.aggregate([
        {
            $match: {
                _id: {
                    $eq: new mongoose.Types.ObjectId(id),
                },
            },
        },
        {
            $lookup: {
                from: "chapters",
                localField: "_id",
                foreignField: "novel",
                as: "chapters",
                pipeline: [
                    {
                        $sort: {
                            sequenceNumber: 1,
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
                                        title: 1,
                                        sequenceNumber: 1,
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
                ],
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
            $lookup: {
                from: "histories",
                localField: "_id",
                foreignField: "novel",
                as: "userHistory",
                pipeline: [
                    {
                        $match: {
                            user: {
                                $eq: new mongoose.Types.ObjectId(req.user?._id),
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },
                translatedBy: { $first: "$translatedBy" },
                userHistory: { $first: "$userHistory" },
                chapters: {
                    $first: "$chapters",
                },
                avgRatings: {
                    $arrayElemAt: ["$avgRatings.avgRatings", 0],
                },
            },
        },
    ]);

    if (!novel.length) {
        throw new ApiError(404, "Novel not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novel fetched successfully", novel[0]));
});

const getDraftNovels = asyncHandler(async (req, res) => {
    const novels = await Novel.aggregate([
        {
            $match: {
                isPublished: false,
            },
        },
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
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            averageRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },
                chaptersCount: {
                    $size: "$chaptersCount",
                },
                avgRatings: {
                    $arrayElemAt: ["$ratings.averageRating", 0],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 10,
        },
        {
            $project: {
                title: 1,
                coverImage: 1,
                avgRatings: 1,
                uploadedBy: 1,
                translatedBy: 1,
                chaptersCount: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!novels.length) {
        throw new ApiError(404, "Novels not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const getAllNovelsByUser = asyncHandler(async (req, res) => {
    const novels = await Novel.aggregate([
        {
            $match: {
                uploadedBy: req.user._id,
            },
        },
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
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            averageRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                chaptersCount: {
                    $size: "$chaptersCount",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                title: 1,
                author: 1,
                coverImage: 1,
                genre: 1,
                chaptersCount: 1,
                createdAt: 1,
                translatedBy: 1,
            },
        },
    ]);

    if (!novels) {
        throw new ApiError(404, "Novels not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const getAllNovelsByTranslator = asyncHandler(async (req, res) => {
    const username = req.params;

    const novels = await Novel.aggregate([
        {
            $match: {
                translatedBy: username,
            },
        },
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
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            averageRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                chaptersCount: {
                    $size: "$chaptersCount",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                title: 1,
                author: 1,
                coverImage: 1,
                genre: 1,
                chaptersCount: 1,
                createdAt: 1,
                // uploadedBy: 1,
                translatedBy: 1,
            },
        },
    ]);

    if (!novels) {
        throw new ApiError(404, "Novels not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const searchNovels = asyncHandler(async (req, res) => {
    const { query } = req.params;

    if (!query) {
        throw new ApiError(400, "Query is required");
    }

    const novels = await Novel.aggregate([
        {
            $search: {
                index: "novel_search",
                text: {
                    query,
                    path: {
                        wildcard: "*",
                    },
                },
            },
        },
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
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            averageRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },

                chaptersCount: {
                    $size: "$chaptersCount",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 5,
        },
        {
            $project: {
                title: 1,
                author: 1,
                coverImage: 1,
                genre: 1,
                description: 1,
                uploadedBy: 1,
                translatedBy: 1,
                chaptersCount: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!novels.length) {
        throw new ApiError(404, `No novels found for ${query}`);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const getNewNovels = asyncHandler(async (req, res) => {
    const novels = await Novel.aggregate([
        {
            $match: {
                isPublished: true,
            },
        },
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
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            averageRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },
                chaptersCount: {
                    $size: "$chaptersCount",
                },
                avgRatings: {
                    $arrayElemAt: ["$ratings.averageRating", 0],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 10,
        },
        {
            $project: {
                title: 1,
                coverImage: 1,
                avgRatings: 1,
                uploadedBy: 1,
                translatedBy: 1,
                chaptersCount: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!novels.length) {
        throw new ApiError(404, "Novels not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const getCompletedNovels = asyncHandler(async (req, res) => {
    const novels = await Novel.aggregate([
        {
            $match: {
                $and: [
                    {
                        isPublished: true,
                    },
                    {
                        status: "Completed",
                    },
                ],
            },
        },
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
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$value" },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },
                chaptersCount: {
                    $size: "$chaptersCount",
                },
                avgRatings: {
                    $arrayElemAt: ["$ratings.avgRating", 0],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 10,
        },
        {
            $project: {
                title: 1,
                coverImage: 1,
                avgRatings: 1,
                uploadedBy: 1,
                translatedBy: 1,
                chaptersCount: 1,
                createdAt: 1,
            },
        },
    ]);

    if (novels.length === 0) {
        throw new ApiError(404, "Novels not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const getCarouselNovels = asyncHandler(async (req, res) => {
    const novels = await Novel.aggregate([
        {
            $match: {
                isPublished: true,
            },
        },
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
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            avgRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },

                chaptersCount: {
                    $size: "$chaptersCount",
                },

                avgRating: {
                    $arrayElemAt: ["$ratings.avgRating", 0],
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 10,
        },
        {
            $project: {
                title: 1,
                author: 1,
                coverImage: 1,
                genre: 1,
                description: 1,
                uploadedBy: 1,
                translatedBy: 1,
                chaptersCount: 1,
                avgRating: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!novels.length) {
        throw new ApiError(404, "Novels not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Novels fetched successfully", novels));
});

const getTopFiveNovels = asyncHandler(async (req, res) => {
    const notAllowed = [
        "add-novel",
        "update-novel",
        "edit-novel",
        "chapter",
        "add-chapter",
        "update-chapter",
        "edit-chapter",
    ];

    const allowed = ["novel"];

    const result = req.googleAnalytics.map((row) => {
        if (
            row.dimensionValues[0].value
                .split("/")
                .filter((x) => x)
                .some((item) => allowed.includes(item) && item !== null)
        )
            if (
                !row.dimensionValues[0].value
                    .split("/")
                    .filter((x) => x)
                    .some((item) => notAllowed.includes(item) && item !== null)
            ) {
                if (
                    row.dimensionValues[0].value !== "/" &&
                    row.dimensionValues[0].value.slice(7, 31).length === 24
                ) {
                    return {
                        id: row.dimensionValues[0].value.slice(7, 31),
                        visit: row.metricValues[0].value,
                    };
                }
            }
    });

    const topFive = result.filter((x) => x).splice(0, 4);

    const novels = await Novel.aggregate([
        {
            $match: {
                _id: {
                    $in: topFive.map((x) => new mongoose.Types.ObjectId(x.id)),
                },
            },
        },
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
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "novel",
                as: "ratings",
                pipeline: [
                    {
                        $group: {
                            _id: null,
                            averageRating: {
                                $avg: "$value",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                uploadedBy: { $first: "$uploadedBy" },
                chaptersCount: {
                    $size: "$chaptersCount",
                },
                avgRatings: {
                    $arrayElemAt: ["$ratings.averageRating", 0],
                },
            },
        },
        {
            $project: {
                title: 1,
                author: 1,
                coverImage: 1,
                avgRatings: 1,
                uploadedBy: 1,
                translatedBy: 1,
                chaptersCount: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!novels.length) {
        throw new ApiError(404, "Novels not found");
    }

    const topFiveNovels = novels
        .map((novel) => {
            topFive.map((x) => {
                if (novel._id.toString() === x.id) {
                    novel.views = x.visit;
                    return;
                }
            });

            return novel;
        })
        .sort((a, b) => b.views - a.views);

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Novels fetched successfully", topFiveNovels)
        );
});

module.exports = {
    addNovel,
    getNovel,
    updateNovel,
    deleteNovel,
    getDraftNovels,
    getAllNovelsByUser,
    searchNovels,
    getNewNovels,
    getCompletedNovels,
    getCarouselNovels,
    getTopFiveNovels,
};
