const { Router } = require("express");
const { followUserToggler } = require("../controllers/follow.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();

router.route("/:userId").post(verifyJWT, followUserToggler);

module.exports = router;

/*
const { Router } = require("express");
const router = Router();
module.exports = router;
*/
