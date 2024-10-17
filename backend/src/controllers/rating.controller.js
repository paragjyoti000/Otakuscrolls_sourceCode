const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const Rating = require("../models/rating.model.js");

const addRating = asyncHandler(async (req, res) => {
    const { novelId } = req.params;
    const { rating } = req.body;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    if (!rating) {
        throw new ApiError(400, "Rating is required");
    }

    const existingRating = await Rating.findOneAndUpdate(
        {
            novel: novelId,
            user: req.user._id,
        },
        {
            $set: { value: rating },
        },
        {
            new: true,
        }
    );

    if (existingRating) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Rating updated successfully",
                    existingRating
                )
            );
    }

    const newRating = await Rating.create({
        value: rating,
        novel: novelId,
        user: req.user._id,
    });

    if (!newRating) {
        throw new ApiError(500, "Failed to add rating");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Rating added successfully", newRating));
});

const getUserRating = asyncHandler(async (req, res) => {
    const { novelId } = req.params;

    if (!novelId) {
        throw new ApiError(400, "Novel ID is required");
    }

    const rating = await Rating.findOne({
        novel: novelId,
        user: req.user._id,
    });

    if (!rating) {
        throw new ApiError(404, "Rating not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "User Rating fetched successfully", rating));
});

module.exports = {
    addRating,
    getUserRating,
};
