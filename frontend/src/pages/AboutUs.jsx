import { FaUserFriends, FaShieldAlt, FaBookmark } from "react-icons/fa";
import { FaDiscord, FaPatreon } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

const AboutUs = () => {
    const features = [
        {
            icon: <FaBookmark className="text-3xl text-yellow-400" />,
            title: "User-Friendly Experience",
            description:
                "Enjoy our intuitive bookmark system and track your reading history with ease.",
        },
        {
            icon: <FaUserFriends className="text-3xl text-blue-400" />,
            title: "Community Interaction",
            description:
                "Connect with fellow readers through our following system and engage in user discussions.",
        },
        {
            icon: <FaShieldAlt className="text-3xl text-green-400" />,
            title: "Privacy Assurance",
            description:
                "Your data is safe with us. We have a strict no-leak policy to protect your privacy.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-slate-900 text-gray-800 dark:text-gray-200">
            <div className="container mx-auto px-4 py-16">
                <section className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
                        Welcome to OtakuScrolls
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
                        Your ultimate destination for light novels, captivating
                        stories, and immersive entertainment! 📚✨
                    </p>
                </section>

                <section className="mb-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-3xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
                        Our Mission
                    </h2>
                    <p className="text-lg">
                        At OtakuScrolls, we're dedicated to bringing you the
                        finest translated light novels using cutting-edge
                        Machine Translation (MTL) technology. Our goal is to
                        break language barriers and open up a world of
                        captivating stories for readers worldwide.
                    </p>
                </section>

                <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="mb-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
                        Get in Touch
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to="/contact-us"
                            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors duration-300"
                        >
                            <MdEmail className="mr-2 text-xl" /> Contact Us
                        </Link>
                        <a
                            href="https://discord.com/invite/v2cQhmJxKt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-full transition-colors duration-300"
                        >
                            <FaDiscord className="mr-2 text-xl" /> Join Our
                            Discord
                        </a>
                        <a
                            href="https://patreon.com/OtakuScrolls"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors duration-300"
                        >
                            <FaPatreon className="mr-2 text-lg" /> Support on
                            Patreon
                        </a>
                    </div>
                </section>

                <section className="text-center animate-fade-in">
                    <h2 className="text-3xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
                        Join the Adventure!
                    </h2>
                    <p className="text-xl mb-8">
                        Dive into our collection and lose yourself in the magic
                        of storytelling.
                    </p>
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full inline-block transition-all duration-300 transform hover:scale-105"
                    >
                        Explore Our Novels
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
