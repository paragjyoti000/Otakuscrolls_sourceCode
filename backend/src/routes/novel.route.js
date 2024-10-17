const { Router } = require("express");
const {
    addNovel,
    getNovel,
    deleteNovel,
    getAllNovelsByUser,
    updateNovel,
    searchNovels,
    getNewNovels,
    getCompletedNovels,
    getCarouselNovels,
    getTopFiveNovels,
    getDraftNovels,
} = require("../controllers/novel.controller.js");
const {
    verifyJWT,
    adminOnly,
    permissionVerify,
} = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/multer.middleware.js");
const {
    getGoogleAnalytics,
} = require("../middlewares/googleAnalytics.middleware.js");

const router = Router();

router
    .route("/add-novel")
    .post(
        verifyJWT,
        permissionVerify("add_novel"),
        upload.single("coverImage"),
        addNovel
    );
router.route("/get-novel/:id").get(getNovel);
router.route("/get-novel-with-history/:id").get(verifyJWT, getNovel);
router
    .route("/update-novel/:id")
    .patch(
        verifyJWT,
        permissionVerify("update_novel"),
        upload.single("coverImage"),
        updateNovel
    );
router
    .route("/delete-novel/:id")
    .delete(verifyJWT, permissionVerify("delete_novel"), deleteNovel);
router.route("/get-novels").get(getNewNovels);
router.route("/all-novels-by-user").get(verifyJWT, getAllNovelsByUser);
router
    .route("/get-draft-novels")
    .get(
        verifyJWT,
        permissionVerify("view_only_staff_content"),
        getDraftNovels
    );
router.route("/get-completed-novels").get(getCompletedNovels);
router.route("/get-carousal-novels").get(getCarouselNovels);
router.route("/get-top-five-novel").get(getGoogleAnalytics(), getTopFiveNovels);
router.route("/search/:query").get(searchNovels);

module.exports = router;
