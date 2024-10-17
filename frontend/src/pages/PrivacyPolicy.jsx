import { Link } from "react-router-dom";
import {
    FaShieldAlt,
    FaHandshake,
    FaCookie,
    FaLock,
    FaEdit,
    FaEnvelope,
    FaThumbsUp,
} from "react-icons/fa";

function PrivacyPolicy() {
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
                    Privacy Policy
                </h1>

                <div className="text-right mb-8">
                    <p className="text-sm text-gray-400">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
                <nav className="">
                    <ul className="flex flex-wrap justify-center gap-4">
                        {[
                            {
                                id: "collection",
                                text: "Information Collection",
                            },
                            { id: "sharing", text: "Information Sharing" },
                            { id: "cookies", text: "Cookies" },
                            { id: "security", text: "Security" },
                            { id: "changes", text: "Changes" },
                            { id: "contact", text: "Contact Us" },
                        ].map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => scrollToSection(item.id)}
                                    className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                >
                                    {item.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <section id="collection" className="pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center">
                        <FaShieldAlt className="mr-2" /> Information Collection
                        and Use
                    </h2>
                    <p className="text-lg leading-relaxed">
                        We collect personal information that you voluntarily
                        provide to us when you use our services. This may
                        include your name, email address, and any other
                        information you choose to provide. We use this
                        information to provide and improve our services,
                        communicate with you, and ensure the security of our
                        platform.
                    </p>
                </section>

                <section id="sharing" className="pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center">
                        <FaHandshake className="mr-2" /> Information Sharing and
                        Disclosure
                    </h2>
                    <p className="text-lg leading-relaxed">
                        We do not sell, trade, or rent your personal information
                        to third parties. We may share your information with
                        trusted service providers who assist us in operating our
                        website and conducting our business, as long as they
                        agree to keep this information confidential.
                    </p>
                </section>

                <section id="cookies" className="pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center">
                        <FaCookie className="mr-2" /> Cookies
                    </h2>
                    <p className="text-lg leading-relaxed">
                        We use cookies to enhance your experience on our
                        website. These small data files are placed on your
                        device to remember your preferences and provide
                        personalized content. You can choose to disable cookies
                        through your browser settings, but this may affect the
                        functionality of our website.
                    </p>
                </section>

                <section id="security" className="pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center">
                        <FaLock className="mr-2" /> Security
                    </h2>
                    <p className="text-lg leading-relaxed">
                        We implement a variety of security measures to maintain
                        the safety of your personal information. However, no
                        method of transmission over the Internet or electronic
                        storage is 100% secure, and we cannot guarantee absolute
                        security.
                    </p>
                </section>

                <section id="changes" className="pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center">
                        <FaEdit className="mr-2" /> Changes to this Privacy
                        Policy
                    </h2>
                    <p className="text-lg leading-relaxed">
                        We may update our Privacy Policy from time to time. We
                        will notify you of any changes by posting the new
                        Privacy Policy on this page and updating the "last
                        updated" date at the top of this Privacy Policy.
                    </p>
                </section>

                <section id="contact" className="pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center">
                        <FaEnvelope className="mr-2" /> Contact Us
                    </h2>
                    <p className="text-lg leading-relaxed">
                        If you have any questions about this Privacy Policy,
                        please contact us at{" "}
                        <Link
                            to="/contact-us"
                            className="text-blue-500 hover:underline"
                        >
                            this page
                        </Link>
                        . Or you can also contact us on our discord server.{" "}
                        <a
                            href="https://discord.com/invite/v2cQhmJxKt"
                            className="text-blue-500 hover:underline"
                        >
                            Join Now.
                        </a>
                    </p>
                </section>

                <section id="thank-you" className="text-center pt-16">
                    <h2 className="text-3xl font-semibold mb-4 flex items-center justify-center">
                        <FaThumbsUp className="mr-2" /> Thank You
                    </h2>
                    <p className="text-lg leading-relaxed">
                        Thank you for taking the time to read our Privacy
                        Policy. We value your trust and are committed to
                        protecting your privacy.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
