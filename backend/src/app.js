const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const allowList = process.env.CORS_ORIGIN;

const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if (allowList.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false }; // disable CORS for this request
    }

    callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use("/public", express.static("public"));
app.use(cookieParser());

// api key validation
app.use("/api/v1", (req, res, next) => {
    const apiKey = req.headers["api-key"];

    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).send("Unauthorized Request!!! Invalid API Key");
    }
});

// routes imports
const userRoute = require("./routes/user.route.js");
const novelRoute = require("./routes/novel.route.js");
const chapterRoute = require("./routes/chapter.route.js");
const followRoute = require("./routes/follow.route.js");
const ratingRoute = require("./routes/rating.route.js");
const bookmarkRoute = require("./routes/bookmark.route.js");
const commentRoute = require("./routes/comment.route.js");
const historyRoute = require("./routes/history.route.js");
const adminRoute = require("./routes/admin.route.js");

// routes declaration
app.use("/api/v1/users", userRoute);
app.use("/api/v1/novels", novelRoute);
app.use("/api/v1/chapters", chapterRoute);
app.use("/api/v1/follow", followRoute);
app.use("/api/v1/rating", ratingRoute);
app.use("/api/v1/bookmark", bookmarkRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/history", historyRoute);
app.use("/api/v1/admin", adminRoute);

// backend home page
app.get("/", (req, res) => {
    res.send(`<div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; text-align: center;">
    <h2 style="color: #333;">Welcome to the OtakuScrolls Backend API Homepage</h2>
    <p style="font-style: italic; color: #666;">This API is version 1.0.0</p>
    <p style="font-style: italic; color: #666;">For documentation, visit <a href="/api/docs/v1">docs</a></p>
    <p style="font-style: italic; color: #666;">For more information, visit <a href="https://otakuscrolls.com">otakuscrolls.com</a></p>
</div>`);
});

app.get("/api/docs/v1", (req, res) => {
    res.send(`<div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; text-align: center;">
    <h2 style="color: #333;">Welcome to the OtakuScrolls Backend API Homepage</h2>
    <p style="font-style: italic; color: #666;">This API is version 1.0.0</p>
    <p style="font-style: italic; color: #666;">For more information, visit <a href="https://otakuscrolls.com">otakuscrolls.com</a></p>
</div>
<br />
<div style="background-color: #f0f0f0; padding: 20px; border-radius: 10px; text-align: center;">
    <h2 style="color: #333;">Documentation</h2>
    <p style="font-style: italic; color: #666;">If you are Admin or moderator, visit <a href="otakuscrolls.com/admin">docs</a></p>
</div>`);
});

module.exports = app;
