const { Router } = require("express");
const {
    addChapter,
    updateChapter,
    deleteChapter,
    getChapter,
    getAllChaptersByNovel,
    getLatestChapters,
    updateChapterInfo,
    getNewFeeds,
} = require("../controllers/chapter.controller.js");
const {
    verifyJWT,
    permissionVerify,
} = require("../middlewares/auth.middleware.js");

const router = Router();

router
    .route("/add-chapter/:novelId")
    .post(verifyJWT, permissionVerify("add_chapter"), addChapter);
router
    .route("/update-chapter/:id")
    .patch(verifyJWT, permissionVerify("edit_chapter"), updateChapter);
router
    .route("/delete-chapter/:id")
    .delete(verifyJWT, permissionVerify("delete_chapter"), deleteChapter);
router.route("/get-chapter/:id").get(getChapter);
router.route("/get-all-chapters-by-novel/:novelId").get(getAllChaptersByNovel);
router.route("/get-latest-chapters").get(getLatestChapters);

router.route("/get-latest-feed").get(getNewFeeds);

router
    .route("/update-chapter-info/:id")
    .patch(verifyJWT, permissionVerify("edit_chapter"), updateChapterInfo);

module.exports = router;
