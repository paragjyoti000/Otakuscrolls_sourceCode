import { useForm } from "react-hook-form";
import { Input } from "../components";
import useDiscord from "../hooks/useDiscord";
import conf from "../envConf/conf";

const ContactForm = () => {
    const { register, handleSubmit, reset } = useForm();

    const discord = useDiscord();

    const onSubmit = async ({ username, discordUsername, email, message }) => {
        discord(conf.discordMailboxUrl, {
            content: new Date().toLocaleString(),
            title: `Contact Us`,
            message: `## <@&1226853391926431745> - New Message\n\n***From - ***\n**Username:** \`${username}\`\n**Discord Username:** \`${discordUsername}\`\n**Email:** \`${email}\`\n\n**Message:** \`${message}\``,
        });

        reset();
    };

    return (
        <>
            <div className="container mx-auto py-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-8">
                        <h1 className="text-xl font-bold text-center mb-4">
                            Contact Us
                        </h1>
                        <div className="mb-4">
                            <Input
                                className=""
                                label="Username"
                                type="text"
                                placeholder="Username"
                                {...register("username", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div className="mb-4">
                            <Input
                                className=""
                                label="Discord Username (if available)"
                                type="text"
                                placeholder="Discord Username"
                                {...register("discordUsername", {
                                    required: true,
                                })}
                            />
                            <div className="text-[10px] dark:text-gray-400 -mt-2">
                                This is optional. But if you have a discord and
                                have already joined our discord server, you can
                                enter your discord username here. This may
                                quickly get you in contact with us.
                            </div>
                        </div>
                        <div className="mb-4">
                            <Input
                                className=""
                                label="Email"
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-gray-700 dark:text-gray-300 text-sm mb-2"
                                htmlFor="message"
                            >
                                Message
                            </label>
                            <textarea
                                className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 dark:bg-gray-800 mb-3 leading-tight outline-none focus:shadow-outline"
                                id="message"
                                placeholder="Message"
                                rows="5"
                                {...register("message", {
                                    required: true,
                                })}
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ContactForm;
