const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
        readHistory: {
            type: [String],
            default: [],
        },
        labels: {
            type: [String],
            default: [],
        },
        userPrefs: {
            type: Object,
            default: {},
        },
        role: {
            type: String,
            default: "Member",
            enum: ["Admin", "Staff", "Member"],
        },
        permissions: {
            type: [String],
            default: [],
            enum: [
                "add_novel",
                "update_novel",
                "delete_novel",
                "add_chapter",
                "edit_chapter",
                "delete_chapter",
                "publish_novel",
                "view_unpublished_chapter",
                "view_only_staff_content",
                "manage_users",
                "assign_labels",
                "view_analytics",
                "access_admin_panel",
            ],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otpDetails: {
            type: Object,
            default: null,
        },
        passwordResetToken: {
            type: Object,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

module.exports = mongoose.model("User", userSchema);
