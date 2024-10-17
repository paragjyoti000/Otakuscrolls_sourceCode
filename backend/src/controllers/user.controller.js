const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const User = require("../models/user.model.js");
const Novel = require("../models/novel.model.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const sendEmail = require("../utils/sendEmail.js");
const secretGenerator = require("../utils/secretGenerator.js");

const options = {
    httpOnly: true,
    secure: true,
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// Controllers
const registerUser = asyncHandler(async (req, res) => {
    // get user data from the frontend
    // validate the user data
    // checking if the user already exists
    // create a new user object - create a new user in the database
    // remove password and refresh token from the response
    // check for user creation error
    // send response

    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const defaultAvatarPath = `https://${req.get("host")}/public/avatars/0.png`;

    const newUser = await User.create({
        username: username,
        name: username,
        email: email,
        password: password,
        avatar: defaultAvatarPath,
    });

    const user = await User.findById(newUser._id).select(
        "-password -refreshToken -otpDetails -passwordResetToken"
    );

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, "User created successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
    // get user data from the frontend
    // validate the user data
    // check if the user exists
    // check if the password is correct
    // create a new access token and refresh token
    // send cookies with access token and refresh token
    // send response

    const { usernameOrEmail, password } = req.body;

    if ([usernameOrEmail, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
        throw new ApiError(404, "User not Registered");
    }

    if (!(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -otpDetails -passwordResetToken"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, "Logged in Successful", {
                accessToken,
                refreshToken,
                user: loggedInUser,
            })
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    // remove cookies
    // send response

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 },
        },
        {
            new: true,
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // get refresh token from cookies
    // check if the refresh token is valid
    // create a new access token
    // send cookies with access token
    // send response

    try {
        const bodyRefreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (!bodyRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            bodyRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const user = await User.findById(decodedToken?._id).select(
            "-password -otpDetails -passwordResetToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (bodyRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200, "Access token refreshed successfully", {
                    accessToken,
                    refreshToken,
                })
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});

const changeCurrentUserPassword = asyncHandler(async (req, res) => {
    // get user data from the frontend
    // validate the user data
    // check if the user exists
    // check if the password is correct
    // update the password
    // send response

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!(await user.isPasswordCorrect(oldPassword))) {
        throw new ApiError(401, "Invalid credentials");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, "Success", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken -otpDetails -passwordResetToken");

    return res
        .status(200)
        .json(new ApiResponse(200, "Name Updated Successfully", user));
});

const getAllAvatarOptions = asyncHandler(async (req, res) => {
    const avatarFiles = fs.readdirSync("./public/avatars");
    const avatars = avatarFiles.map(
        (file) => `https://${req.get("host")}/public/avatars/${file}`
    );

    return res.status(200).json(new ApiResponse(200, "Success", avatars));
});

const updateAvatar = asyncHandler(async (req, res) => {
    const { avatar } = req.body;

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar,
            },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken -otpDetails -passwordResetToken");

    return res
        .status(200)
        .json(new ApiResponse(200, "Avatar Updated Successfully", user));
});

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const user = await User.aggregate([
        {
            $match: {
                username,
            },
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "follower",
                as: "followings",
            },
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "following",
                as: "followers",
            },
        },
        {
            $addFields: {
                followersCount: {
                    $size: "$followers",
                },
                followingsCount: {
                    $size: "$followings",
                },
                isFollowed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$followers.follower"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $project: {
                name: 1,
                username: 1,
                avatar: 1,
                role: 1,
                labels: 1,
                isVerified: 1,
                userPrefs: 1,
                followersCount: 1,
                followingsCount: 1,
                isFollowed: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!user?.length) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "User profile fetched successfully", user[0])
        );
});

const sendOtp = asyncHandler(async (req, res) => {
    const email = req.user.email;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const { otp, expireIn, limit, timeLimit } = secretGenerator.getOtp(
        6,
        5,
        2,
        24
    );

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "User already verified");
    }

    if (
        user.otpDetails &&
        user.otpDetails.timeLimit > new Date().getTime() &&
        user.otpDetails.limit === 0
    ) {
        throw new ApiError(429, "OTP limit exceeded for today");
    }

    if (
        user.otpDetails &&
        user.otpDetails.timeLimit > new Date().getTime() &&
        user.otpDetails.limit > 0
    ) {
        user.otpDetails = {
            otp,
            expireIn,
            limit: user.otpDetails.limit - 1,
            timeLimit: user.otpDetails.timeLimit,
        };
        await user.save({ validateBeforeSave: false });
    } else {
        user.otpDetails = {
            otp,
            expireIn,
            limit: limit - 1,
            timeLimit,
        };
        await user.save({ validateBeforeSave: false });
    }

    await sendEmail({
        to: email,
        subject: `OTP for Email verification`,
        message: `<div id="message" style="padding-left: 20px">
        <h2>OTP verification</h2>
        <p>Dear ${user.name},</p>
        <h4>username: ${user.username}</h4>
        <p>Your OTP (One Time Password) for verification is:</p>
        <h2>${user.otpDetails.otp}</h2>
        <p>Valid for 5 minutes only.</p>
        <p>
            You have <b>${user.otpDetails.limit}</b> attempts
            left for Today.<br />Until
            <b
                >${new Date(user.otpDetails.timeLimit).toLocaleString()}</b
            >
        </p>
        <p>
            Please use this OTP within the specified time period
            to complete your verification process.
        </p>
        <p>
            If you didn't request this OTP, please disregard
            this email and ensure the security of your account.
        </p>
        <p>Thank you for using our services.</p>
        <p>Best regards,<br />Team OtakuScrolls</p>
    </div>`,
    }).catch((err) => new ApiError(500, err.message));

    return res
        .status(200)
        .json(new ApiResponse(200, "OTP sent successfully", user.otpDetails));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email } = req.user;
    const { otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (
        user.otpDetails.otp !== otp &&
        user.otpDetails.expiresIn < Date.now().getTime()
    ) {
        throw new ApiError(400, "Invalid OTP or OTP expired");
    }

    await User.findOneAndUpdate(
        { email },
        {
            $set: {
                otpDetails: null,
                isVerified: true,
            },
        },
        { new: true }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, "OTP verified successfully"));
});

const forgotPasswordEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const { secret, expireIn, limit, timeLimit } = secretGenerator.getSecret(
        30,
        10,
        2,
        24
    );

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (
        user.passwordResetToken &&
        user.passwordResetToken.timeLimit > new Date().getTime() &&
        user.passwordResetToken.limit === 0
    ) {
        throw new ApiError(429, "Password recovery limit exceeded for today");
    }

    if (
        user.passwordResetToken &&
        user.passwordResetToken.timeLimit > new Date().getTime() &&
        user.passwordResetToken.limit > 0
    ) {
        user.passwordResetToken = {
            secret,
            expireIn,
            limit: user.passwordResetToken.limit - 1,
            timeLimit: user.passwordResetToken.timeLimit,
        };
        await user.save({ validateBeforeSave: false });
    } else {
        user.passwordResetToken = {
            secret,
            expireIn,
            limit: limit - 1,
            timeLimit,
        };
        await user.save({ validateBeforeSave: false });
    }

    await sendEmail({
        to: email,
        subject: `Password recovery`,
        message: `<div id="message" style="padding-left: 20px">
        <h2>Password recovery</h2>
        <p>Dear ${user.name},</p>
        <h4>username: ${user.username}</h4>
        <p>
            We've received a request to reset your password. To
            proceed, please click the following link to reset
            your password:
        </p>
        <a
            href="${process.env.CORS_ORIGIN}/password-recovery?userId=${
            user._id
        }&secret=${user.passwordResetToken.secret}"
            target="_blank"
            rel="noopener noreferrer"
            ><button
                style="
                    background-color: rgb(32, 72, 72);
                    padding: 10px;
                    border-radius: 10px;
                    color: #ebdfdf;
                "
            >
                Reset Your Password
            </button></a
        >
        <br />
        <p>Valid for 10 minutes only.</p>
        <p>
            You have
            <b>${user.passwordResetToken.limit}</b> attempts
            left for Today.<br />Until <b>${new Date(
                user.passwordResetToken.timeLimit
            ).toLocaleString()}</b>
        </p>
        <p>
            If you didn't request this change, you can safely
            ignore this email. Your account security is
            important to us.
        </p>
        <p>Thank you for using our services.</p>
        <p>Best regards,<br />Team OtakuScrolls</p>
    </div>`,
    }).catch((err) => new ApiError(500, err.message));

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Password recovery email sent successfully",
                user.passwordResetToken
            )
        );
});

const resetPassword = asyncHandler(async (req, res) => {
    const { userId, secret, password } = req.body;

    if (!userId || !secret || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (
        user.passwordResetToken.secret !== secret &&
        user.passwordResetToken.expiresIn < Date.now().getTime()
    ) {
        throw new ApiError(400, "Invalid secret or secret expired");
    }

    user.password = password;
    user.passwordResetToken = {
        secret: null,
        expiresIn: null,
    };
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, "Password reset successfully"));
});

const updateChapterUserPrefs = asyncHandler(async (req, res) => {
    const { prefs } = req.body;
    if (!prefs) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.userPrefs.chapter = prefs;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "User preferences updated successfully",
                user.userPrefs
            )
        );
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    getAllAvatarOptions,
    updateAvatar,
    getUserProfile,
    sendOtp,
    verifyOtp,
    forgotPasswordEmail,
    resetPassword,
    updateChapterUserPrefs,
};
