const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
    addOrRemoveBookmark,
    getBookmarks,
    isBookmarked,
    deleteBookmark,
} = require("../controllers/bookmark.controller.js");

const router = Router();

router
    .route("/add-or-remove-bookmark/:novelId")
    .post(verifyJWT, addOrRemoveBookmark);
router.route("/get-bookmarks").get(verifyJWT, getBookmarks);
router.route("/is-bookmarked-by-user/:novelId").get(verifyJWT, isBookmarked);
router
    .route("/delete-single-bookmark/:bookmarkId")
    .delete(verifyJWT, deleteBookmark);

module.exports = router;
