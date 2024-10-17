import Logo from "./Logo";
import {
    FaPatreon,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaDiscord,
    FaReddit,
} from "react-icons/fa6";
import BMC from "../assets/BMC.png";
import { useNavigate } from "react-router-dom";
// import jsonPackage from "../../package.json";

const socialLinks = [
    {
        id: 1,
        icon: <FaPatreon />,
        url: "https://patreon.com/OtakuScrolls",
        name: "Patreon",
    },
    {
        id: 2,
        icon: <FaDiscord />,
        url: "https://discord.gg/v2cQhmJxKt",
        name: "Discord",
    },
    {
        id: 3,
        icon: <FaTwitter />,
        url: "https://twitter.com/OtakuScrolls",
        name: "Twitter",
    },
    {
        id: 4,
        icon: <FaReddit />,
        url: "/",
        name: "Reddit",
    },
    {
        id: 5,
        icon: <FaInstagram />,
        url: "https://www.instagram.com/otakuscrolls_official",
        name: "Instagram",
    },
    {
        id: 6,
        icon: <FaFacebook />,
        url: "https://www.facebook.com/people/OtakuScrolls-Official/61557895451084/",
        name: "Facebook",
    },
];

const pageLinks = [
    {
        id: 1,
        name: "Home",
        link: "/",
    },
    {
        id: 2,
        name: "About",
        link: "/about",
    },

    {
        id: 3,
        name: "Privacy Policy",
        link: "/privacy-policy",
    },
];

function Footer() {
    const navigate = useNavigate();
    return (
        <footer
            className={`mt-auto object-cover bg-slate-100 dark:bg-gray-950 pt-5 px-3 pb-5 rounded-t-md`}
        >
            <div className="container md:h-40 mb-4 mx-auto flex flex-col md:flex-row justify-between gap-5">
                <div className="w-full md:w-2/4 flex flex-col md:flex-row justify-between gap-5 md:gap-2">
                    {/* Logo, Copy and social */}
                    <div className="flex-grow flex flex-col items-start space-x-1 space-y-2">
                        <div className=" max-w-40">
                            <Logo />
                        </div>
                        <div>
                            {/* <p className="text-xs">Version {jsonPackage.version}</p> */}
                            <p className="text-xs">By「0taKu」</p>
                            <p className="text-xs">
                                <b>© 2024 OtakuScrolls</b>
                            </p>
                        </div>

                        <ul className="flex flex-wrap justify-end space-x-3 space-y-2">
                            {socialLinks?.map((link) => (
                                <li
                                    key={link.id}
                                    className="flex justify-center items-center"
                                >
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {link.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* BMC */}
                    <div className="flex-grow flex flex-col justify-start items-start">
                        <p className="text-sm mb-1 font-semibold">
                            Support Us on
                        </p>
                        <a
                            href="https://buymeacoffee.com/otakuscrolls"
                            target="_blank"
                            rel="noreferrer"
                            className="max-w-40 px-2 py-1 bg-white rounded hover:bg-slate-100 hover:border-2 hover:scale-95"
                        >
                            <img src={BMC} alt="BY ME A COFFEE" className="" />
                        </a>
                    </div>
                </div>

                {/* Links */}
                <div className="w-full md:w-2/4 flex justify-between items-start space-x-1">
                    {/* Social Links */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                            Social Links
                        </h1>
                        <ul className="text-sm text-gray-900 dark:text-gray-300 space-y-0.5">
                            {socialLinks?.map((link) => (
                                <li key={link.id} className="f">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center"
                                    >
                                        {link.icon} &nbsp; {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Page Links */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                            Site Links
                        </h1>
                        <ul className="text-sm text-gray-900 dark:text-gray-300 space-y-0.5">
                            {pageLinks?.map((page) => (
                                <li
                                    key={page.id}
                                    onClick={() => navigate(page.link)}
                                    className="cursor-pointer pl-1"
                                >
                                    {page.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Need help */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                            Need Help
                        </h1>
                        <ul className="text-sm text-gray-900 dark:text-gray-300 space-y-0.5">
                            <li
                                onClick={() => navigate("/contact-us")}
                                className="cursor-pointer pl-1"
                            >
                                Contact Us
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center">
                You can request Light Novels on{" "}
                <span
                    className="cursor-pointer text-blue-500"
                    onClick={() => navigate("/contact-us")}
                >
                    Contact Us
                </span>{" "}
                page.
            </div>

            <hr className="m-2" />

            <p className="text-sm font-bold text-center py-3 font-mono">
                Made with ❤️ by「0taKu」|「おたく」
            </p>
        </footer>
    );
}

export default Footer;
