const { Router } = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware.js");
const {
    getReadHistory,
    addHistory,
    deleteHistory,
} = require("../controllers/history.controller.js");

const router = Router();

router.route("/add-history/:novelId").post(verifyJWT, addHistory);
router.route("/get-read-history").get(verifyJWT, getReadHistory);
router
    .route("/delete-single-history/:historyId")
    .delete(verifyJWT, deleteHistory);

module.exports = router;
