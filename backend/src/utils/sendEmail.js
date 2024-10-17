const nodeMailer = require("nodemailer");

const sendEmail = async ({ to, subject, message }) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: true, // Use SSL
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_APP_PASS,
        },
        authMethod: "LOGIN",
    });

    const mailOptions = {
        from: `OtakuScrolls <${process.env.SMTP_MAIL}>`,
        to: to,
        subject: subject,
        html: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            #body {
                border: #ebdfdf 1px solid;
                font-family: Poppins, sans-serif;
                text-decoration: none;
            }

            #header,
            #footer {
                display: flex;
                align-items: center;
                justify-content: space-around;
                background-color: #111827;
                width: 100%;
            }

            #tagline,
            #redirect {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                text-align: center;
                color: lightblue;
                background-color: #1c3567;
            }

            ##tagline {
                padding: 10px 0px;
            }

            #redirect {
                padding-top: 10px;
                padding-bottom: 10px;
            }

            #main {
                display: flex;
                align-items: center;
                justify-content: center;
                padding-top: 20px;
                padding-bottom: 20px;
                width: 100%;
            }

            #social {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px;
                width: 25%;
                max-width: 200px;
            }

            #icon {
                width: 1em;
                height: 1em;
                vertical-align: -0.125em;
                fill: lavender;
            }
        </style>
    </head>
    <body>
        <div id="body">
            <div id="header">
                <a
                    href="https://otakuscrolls.com"
                    id="logo"
                    style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 10px;
                        width: 25%;
                        max-width: 200px;
                        margin: 10px auto;
                    "
                    ><img
                        width="100%"
                        src="https://backend.otakuscrolls.com/public/assets/otakuscrolls_dark.png"
                        alt="OtakuScrolls"
                /></a>
            </div>
            <div id="tagline">
                <div>
                    <h4 style="padding: 0; margin: 0; margin-bottom: 5px">
                        Together with us
                    </h4>
                    <h6 style="padding: 0; margin: 0">
                        Unleash the thrill of Light Novels
                    </h6>
                </div>
            </div>
            <div id="main">${message}</div>
            <div id="redirect">
                <div>
                    <a
                        href="https://otakuscrolls.com"
                        style="color: aliceblue; font-size: small"
                        >Visit OtakuScrolls</a
                    >
                    <span>|</span>
                    <a
                        href="https://otakuscrolls.com/about-us"
                        style="color: aliceblue; font-size: small"
                        >About Us</a
                    >
                    <span>|</span>
                    <a
                        href="https://otakuscrolls.com/contact-us"
                        style="color: aliceblue; font-size: small"
                        >Contact Us</a
                    >
                    <span>|</span>
                    <a
                        href="https://otakuscrolls.com/privacy-policy"
                        style="color: aliceblue; font-size: small"
                        >Privacy Policy</a
                    >
                </div>
            </div>
            <div id="footer">
                <div id="social">
                    <a
                        href="https://patreon.com/OtakuScrolls"
                        style="margin: 5px"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="icon"
                        >
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M489.7 153.8c-.1-65.4-51-119-110.7-138.3C304.8-8.5 207-5 136.1 28.4C50.3 68.9 23.3 157.7 22.3 246.2C21.5 319 28.7 510.6 136.9 512c80.3 1 92.3-102.5 129.5-152.3c26.4-35.5 60.5-45.5 102.4-55.9c72-17.8 121.1-74.7 121-150z"
                            />
                        </svg>
                    </a>
                    <a href="https://discord.gg/v2cQhmJxKt" style="margin: 5px">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 512"
                            class="icon"
                        >
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
                            />
                        </svg>
                    </a>
                    <a
                        href="https://twitter.com/OtakuScrolls"
                        style="margin: 5px"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="icon"
                        >
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                            />
                        </svg>
                    </a>
                    <a href="" style="margin: 5px">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="icon"
                        >
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256L37.1 512c-13.7 0-20.5-16.5-10.9-26.2L75 437C28.7 390.7 0 326.7 0 256zM349.6 153.6c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7c-20.6 0-37.8 14.6-41.8 34c-34.5 3.7-61.4 33-61.4 68.4l0 .2c-37.5 1.6-71.8 12.3-99 29.1c-10.1-7.8-22.8-12.5-36.5-12.5c-33 0-59.8 26.8-59.8 59.8c0 24 14.1 44.6 34.4 54.1c2 69.4 77.6 125.2 170.6 125.2s168.7-55.9 170.6-125.3c20.2-9.6 34.1-30.2 34.1-54c0-33-26.8-59.8-59.8-59.8c-13.7 0-26.3 4.6-36.4 12.4c-27.4-17-62.1-27.7-100-29.1l0-.2c0-25.4 18.9-46.5 43.4-49.9l0 0c4.4 18.8 21.3 32.8 41.5 32.8zM177.1 246.9c16.7 0 29.5 17.6 28.5 39.3s-13.5 29.6-30.3 29.6s-31.4-8.8-30.4-30.5s15.4-38.3 32.1-38.3zm190.1 38.3c1 21.7-13.7 30.5-30.4 30.5s-29.3-7.9-30.3-29.6c-1-21.7 11.8-39.3 28.5-39.3s31.2 16.6 32.1 38.3zm-48.1 56.7c-10.3 24.6-34.6 41.9-63 41.9s-52.7-17.3-63-41.9c-1.2-2.9 .8-6.2 3.9-6.5c18.4-1.9 38.3-2.9 59.1-2.9s40.7 1 59.1 2.9c3.1 .3 5.1 3.6 3.9 6.5z"
                            />
                        </svg>
                    </a>
                    <a
                        href="https://www.instagram.com/otakuscrolls_official"
                        style="margin: 5px"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            class="icon"
                        >
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                            />
                        </svg>
                    </a>
                    <a
                        href="https://facebook.com/otakuscrolls"
                        style="margin: 5px"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            class="icon"
                        >
                            <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path
                                d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </body>
</html>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
