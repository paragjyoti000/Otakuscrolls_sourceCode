const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./src/db/index.js");
const app = require("./src/app.js");
const sendEmail = require("./src/utils/sendEmail.js");

const port = process.env.PORT || 3000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`🌐 Server listening on port: ${port}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection FAILED !!", err);
    });
