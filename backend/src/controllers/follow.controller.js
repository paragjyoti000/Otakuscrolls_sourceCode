const Follow = require("../models/follow.model.js");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");

const followUserToggler = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "UserId is required");
    }

    if (userId === req.user._id) {
        throw new ApiError(400, "Cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({
        follower: req.user._id,
        following: userId,
    });

    if (existingFollow) {
        const unfollow = await Follow.findByIdAndDelete(existingFollow._id);

        if (!unfollow) {
            throw new ApiError(500, "Failed to unfollow user");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, "User unfollowed successfully", unfollow)
            );
    } else {
        const follow = await Follow.create({
            follower: req.user._id,
            following: userId,
        });

        if (!follow) {
            throw new ApiError(500, "Failed to follow user");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "User followed successfully", follow));
    }
});

module.exports = {
    followUserToggler,
};
