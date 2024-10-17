const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const History = require("../models/history.model");
const mongoose = require("mongoose");

const addHistory = asyncHandler(async (req, res) => {
    const { novelId } = req.params;
    const { chapterId } = req.body;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    existingNovelHistory = await History.findOne({
        novel: novelId,
        user: req.user._id,
    });

    if (existingNovelHistory) {
        if (existingNovelHistory.chapters.includes(chapterId)) {
            return new ApiResponse(200, "Chapter already in history", null);
        }
        existingNovelHistory.chapters.push(chapterId);
        await existingNovelHistory.save({ validateBeforeSave: false });
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Novel history updated successfully",
                    existingNovelHistory
                )
            );
    } else {
        const history = await History.create({
            novel: novelId,
            user: req.user._id,
        });
        history.chapters.push(chapterId);
        await history.save({ validateBeforeSave: false });
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Novel history created successfully",
                    history
                )
            );
    }
});

const getReadHistory = asyncHandler(async (req, res) => {
    const history = await History.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "chapters",
                localField: "chapters",
                foreignField: "_id",
                as: "chapters",
                pipeline: [
                    {
                        $project: {
                            sequenceNumber: 1,
                        },
                    },
                ],
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
                            from: "chapters",
                            localField: "_id",
                            foreignField: "novel",
                            as: "chaptersCount",
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
                ],
            },
        },
        {
            $addFields: {
                novel: { $first: "$novel" },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);

    if (!history) {
        throw new ApiError(404, "No history found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Read history fetched successfully", history)
        );
});

const deleteHistory = asyncHandler(async (req, res) => {
    const { historyId } = req.params;

    if (!historyId) {
        throw new ApiError(400, "Novel ID is required");
    }

    const history = await History.findByIdAndDelete(historyId);

    if (!history) {
        throw new ApiError(404, "History not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "History deleted successfully", history));
});

module.exports = {
    addHistory,
    getReadHistory,
    deleteHistory,
};
