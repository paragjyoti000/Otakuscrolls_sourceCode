const { Router } = require("express");
const {
    verifyJWT,
    adminOnly,
    permissionVerify,
} = require("../middlewares/auth.middleware.js");
const {
    getGoogleAnalytics,
} = require("../middlewares/googleAnalytics.middleware.js");
const {
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
} = require("../controllers/admin.controller.js");

const router = Router();

router
    .route("/update-user-details/:id")
    .patch(verifyJWT, adminOnly, updateUserDetailsByAdmin);

router
    .route("/user-search/:query")
    .get(verifyJWT, permissionVerify("manage_users"), adminSearchUsers);

router
    .route("/user-role-update")
    .patch(verifyJWT, permissionVerify("manage_users"), adminUpdateRole);

router.route("/user-labels-update").patch(verifyJWT, adminUpdateLabels);

router
    .route("/user-permissions-update")
    .patch(
        verifyJWT,
        permissionVerify("manage_users"),
        adminManageUsersPermissions
    );

router
    .route("/dashboard-card-data")
    .get(verifyJWT, permissionVerify("view_analytics"), getDashboardCardData);

router
    .route("/get-city-wise-analytics")
    .get(
        verifyJWT,
        permissionVerify("view_analytics"),
        getGoogleAnalytics(
            ["city", "country"],
            [
                "activeUsers",
                "sessions",
                "sessionsPerUser",
                "screenPageViews",
                "screenPageViewsPerSession",
            ]
        ),
        getCityWiseAnalytics
    );

router
    .route("/get-graph-analytics")
    .get(
        verifyJWT,
        permissionVerify("view_analytics"),
        getGoogleAnalytics(["date"], ["sessions"]),
        getGraphAnalysis
    );

router.route("/get-latest-users").get(verifyJWT, getLatestUsers);
router.route("/get-admins").get(verifyJWT, adminGetAdmins);

module.exports = router;
