const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const User = require("../models/user.model.js");

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized user ");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded?._id).select(
            "-password -refreshToken -otpDetails -passwordResetToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
});

const adminOnly = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next();
    } else {
        throw new ApiError(403, "Unauthorized request !!\n--Admin only--");
    }
});

const permissionVerify = (permissions) =>
    asyncHandler(async (req, res, next) => {
        if (
            req.user &&
            (req.user.isAdmin || req.user.permissions.includes(permissions))
        ) {
            next();
        } else {
            throw new ApiError(403, "Unauthorized request !!\n--Admin only--");
        }
    });

module.exports = { verifyJWT, adminOnly, permissionVerify };
