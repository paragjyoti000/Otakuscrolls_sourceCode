import axios from "axios";

export default function useDiscord() {
    const sendToDiscord = (
        url,
        { content = "", title = "", message = "", thumbnail = "", image = "" }
    ) => {
        const options = {
            method: "POST",
            url: url,

            data: {
                content: content || "",
                embeds: [
                    {
                        title: `**${title || "Contect form"}**`,
                        description: message && message,
                        thumbnail: {
                            // url:attachment://data.thumbnail && data.thumbnail,
                            url:
                                thumbnail ||
                                "https://backend.otakuscrolls.com/public/assets/otakuscrolls_dark.png",
                        },
                        image: {
                            url: image || "",
                        },
                    },
                ],
            },
        };
        try {
            axios.request(options);
        } catch (error) {
            console.error(error);
        }
    };

    return sendToDiscord;
}
