const { Router } = require("express");
const {
    addNovelComment,
    addChapterComment,
    getComments,
    editComment,
    deleteComment,
} = require("../controllers/comment.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/add-novel-comment/:novelId").post(verifyJWT, addNovelComment);
router
    .route("/add-chapter-comment/:chapterId")
    .post(verifyJWT, addChapterComment);
router.route("/get-comments/:commentFor").get(getComments);
router.route("/edit-comment/:id").patch(verifyJWT, editComment);
router.route("/delete-comment/:id").delete(verifyJWT, deleteComment);

module.exports = router;
