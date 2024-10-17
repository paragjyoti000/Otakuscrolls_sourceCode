const { Router } = require("express");
const { verifyJWT, adminOnly } = require("../middlewares/auth.middleware.js");
const {
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
} = require("../controllers/user.controller.js");

const router = Router();

// public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password-email").post(forgotPasswordEmail);
router.route("/reset-password").post(resetPassword);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar-options").get(verifyJWT, getAllAvatarOptions);
router.route("/update-avatar").patch(verifyJWT, updateAvatar);
router.route("/profile/:username").get(getUserProfile);
router.route("/send-otp").post(verifyJWT, sendOtp);
router.route("/verify-otp").post(verifyJWT, verifyOtp);
router
    .route("/update-chapter-user-prefs")
    .patch(verifyJWT, updateChapterUserPrefs);

module.exports = router;
