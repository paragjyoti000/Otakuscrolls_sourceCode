import { Link } from "react-router-dom";
import conf from "../../envConf/conf";
import { useSelector } from "react-redux";
import { Button, PermissionProvider, SearchBar } from "../";
import { useState } from "react";

function SideMenu({ toggleMenu, isMenuOpen, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);

    const adminStatus = useSelector((state) => state.auth.admin);

    const navItems = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "Feed",
            path: "/feed",
        },
        {
            name: "My Bookmarks",
            path: "/user/bookmarks",
        },
        {
            name: "Genres",
            subItems: conf.genreOptions,
        },
        {
            name: "Contact Us",
            path: "/contact-us",
        },
        {
            name: "About Us",
            path: "/about-us",
        },
        {
            name: "Privacy Policy",
            path: "/privacy-policy",
        },
    ];

    return (
        <nav
            className={`flex flex-col items-start top-12 pt-5 h-screen pl-5 bg-cyan-100 dark:bg-gray-900 dark:text-slate-50 shadow-xl backdrop-blur-sm delay-100 duration-100 ease-in-out ${className}`}
        >
            <ul className="scrollbar-css flex flex-col space-y-4 left-4 w-full">
                <PermissionProvider permission={["access_admin_panel"]}>
                    <li className="flex flex-col items-start justify-center">
                        <Link
                            to={"/admin"}
                            className=" hover:text-blue-500 mb-4"
                        >
                            Admin Panel
                        </Link>
                        <hr width="80%" className="border-slate-600" />
                    </li>
                </PermissionProvider>

                {navItems.map((item) => (
                    <li
                        key={item.name}
                        className="flex flex-col items-start justify-center"
                    >
                        {item.path ? (
                            <Link
                                to={item?.path}
                                className=" hover:text-blue-500 mb-4"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <p
                                className="mb-4 cursor-pointer hover:text-blue-500"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {item.name}
                            </p>
                        )}

                        {item.subItems && (
                            <div
                                className={`flex flex-wrap gap-1 max-w-50 shadow-inner delay-100 duration-200 ease-in-out scrollbar-css ${
                                    isOpen
                                        ? "h-56 w-[90%] overflow-auto mb-2"
                                        : "h-0 overflow-hidden"
                                } `}
                            >
                                {item.subItems?.map((subItem) => (
                                    <div
                                        key={subItem}
                                        className="hover:text-blue-500"
                                    >
                                        <Link
                                            to={`/search?q=${subItem}`}
                                            className="m-1 py-1 px-2 text-xs text-wrap rounded-md bg-slate-100 dark:bg-slate-800"
                                        >
                                            {subItem}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        <hr width="80%" className="border-slate-600" />
                    </li>
                ))}

                <PermissionProvider permission={["add_novel"]}>
                    <li>
                        <Link to={"/add-novel"}>
                            <Button className="mb-8 bg-green-600">
                                Add a Novel
                            </Button>
                        </Link>
                    </li>
                </PermissionProvider>
            </ul>
        </nav>
    );
}

export default SideMenu;
