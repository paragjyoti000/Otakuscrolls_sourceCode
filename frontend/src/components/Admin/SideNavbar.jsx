import { Link, useLocation } from "react-router-dom";
import {
    RiDashboardFill,
    RiUserSettingsFill,
    RiSettings5Fill,
} from "react-icons/ri";

const SideNavbar = () => {
    const location = useLocation();

    const navigations = [
        { name: "Dashboard", path: "/admin", icon: <RiDashboardFill /> },
        { name: "Users", path: "/admin/users", icon: <RiUserSettingsFill /> },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <RiSettings5Fill />,
        },
    ];

    return (
        <nav className="dark:bg-[rgba(21,29,48,0.8)] backdrop-blur-md min-h-screen w-64 pl-4 py-4">
            <h1 className="text-2xl font-bold pl-4 mb-4">Admin Panel</h1>
            <ul>
                {navigations.map((nav, index) => (
                    <li
                        key={index}
                        className={`pl-4 py-2 mb-2 rounded-l-md cursor-pointer hover:bg-gray-700
                            ${
                                location.pathname === nav.path
                                    ? "dark:bg-gray-700 bg-slate-100 border-r-2 border-blue-700"
                                    : ""
                            }`}
                    >
                        <Link to={nav.path} className="flex items-center gap-2">
                            {nav.icon}
                            {nav.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SideNavbar;
