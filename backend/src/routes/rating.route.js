const { Router } = require("express");
const {
    addRating,
    getUserRating,
} = require("../controllers/rating.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/add-rating/:novelId").post(verifyJWT, addRating);

router.route("/get-user-rating/:novelId").get(verifyJWT, getUserRating);

module.exports = router;
