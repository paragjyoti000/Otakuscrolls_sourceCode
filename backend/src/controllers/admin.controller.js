const { asyncHandler } = require("../utils/asyncHandler");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const User = require("../models/user.model.js");
const Novel = require("../models/novel.model.js");

const updateUserDetailsByAdmin = asyncHandler(async (req, res) => {
    const { name, username, email, labels, userPrefs, role, isVerified } =
        req.body;

    if (!name || !username || !email || !labels || !userPrefs || !role) {
        throw new ApiError(400, "All fields is required");
    }

    const user = await User.findByIdAndUpdate(
        req.params?.id,
        {
            $set: {
                name,
                username,
                email,
                labels,
                userPrefs,
                role,
                isVerified,
            },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "User Details Updated Successfully", user));
});

const adminSearchUsers = asyncHandler(async (req, res) => {
    const { query } = req.params;

    const users = await User.find(
        {
            $or: [
                { name: { $regex: query, $options: "i" } },
                { username: { $regex: query, $options: "i" } },
                // { email: { $regex: query, $options: "i" } },
            ],
        },
        {
            password: 0,
            passwordResetToken: 0,
            otpDetails: 0,
            refreshToken: 0,
        }
    ).find({ _id: { $ne: req.user._id } }, { username: { $ne: "admin" } });

    if (!users) {
        throw new ApiError(404, `No users found for ${query}`);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Users fetched successfully", users));
});

const getDashboardCardData = asyncHandler(async (req, res) => {
    const data = {
        totalUsers: await User.countDocuments(),
        totalAdmins: await User.countDocuments({ role: "Admin" }),
        totalStaffs: await User.countDocuments({ role: "Staff" }),
        totalNovels: await Novel.countDocuments(),
    };

    return res.status(200).json(new ApiResponse(200, "Success", data));
});

const getCityWiseAnalytics = asyncHandler(async (req, res) => {
    const result = req.googleAnalytics
        .map((row) => {
            return {
                city: row.dimensionValues[0].value,
                country: row.dimensionValues[1].value,
                activeUsers: row.metricValues[0].value,
                sessions: row.metricValues[1].value,
                sessionsPerUser: row.metricValues[2].value,
                screenPageViews: row.metricValues[3].value,
                screenPageViewsPerSession: row.metricValues[4].value,
            };
        })
        .sort((a, b) => b.sessions - a.sessions);

    return res.status(200).json(new ApiResponse(200, "Success", result));
});

const getGraphAnalysis = asyncHandler(async (req, res) => {
    const data = req.googleAnalytics;

    return res.status(200).json(new ApiResponse(200, "Success", data));
});

const adminUpdateRole = asyncHandler(async (req, res) => {
    const { userId, role } = req.body;

    if (!userId || !role) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                role,
            },
        },
        {
            new: true,
        }
    );

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    return res.status(200).json(new ApiResponse(200, "Success", user));
});

const adminManageUsersPermissions = asyncHandler(async (req, res) => {
    const { userId, permissions } = req.body;

    if (!userId || !permissions) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                permissions,
            },
        },
        {
            new: true,
        }
    );

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    return res.status(200).json(new ApiResponse(200, "Success", user));
});

const adminUpdateLabels = asyncHandler(async (req, res) => {
    const { userId, labels } = req.body;

    if (!userId || !labels) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                labels,
            },
        },
        {
            new: true,
        }
    );

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Labels Successfully updated", user));
});

const getLatestUsers = asyncHandler(async (req, res) => {
    const users = await User.aggregate([
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $limit: 4,
        },
        {
            $project: {
                name: 1,
                username: 1,
                email: 1,
                role: 1,
                avatar: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!users) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(new ApiResponse(200, "Success", users));
});

const adminGetAdmins = asyncHandler(async (req, res) => {
    const admins = await User.find({ role: "Admin" }).select(
        "name username email role avatar createdAt updatedAt"
    );

    if (!admins) {
        throw new ApiError(404, "No admins found");
    }

    return res.status(200).json(new ApiResponse(200, "Success", admins));
});

module.exports = {
    updateUserDetailsByAdmin,
    adminSearchUsers,
    getDashboardCardData,
    getCityWiseAnalytics,
    adminUpdateRole,
    adminManageUsersPermissions,
    adminUpdateLabels,
    getLatestUsers,
    adminGetAdmins,
    getGraphAnalysis,
};
