import { GoogleAnalyticsDashboard } from "../../components/Admin";
import {
    FaCalendarAlt,
    FaUsers,
    FaUsersCog,
    FaUserSecret,
} from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";

import adminService from "../../api/admin";
import { useQueries } from "react-query";
import { FaEnvelope, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

const AdminHome = () => {
    const [{ data: dashboardData }, { data: latestUsers }, { data: admins }] =
        useQueries([
            {
                queryKey: "dashboardData",
                queryFn: async () =>
                    await adminService.getDashboardData().catch(() => {}),
            },
            {
                queryKey: "latestUsers",
                queryFn: async () =>
                    await adminService.getLatestUsers().catch(() => {}),
            },
            {
                queryKey: "admins",
                queryFn: async () =>
                    await adminService.getAdmins().catch(() => {}),
            },
        ]);

    const infoCards = [
        {
            title: "Total Admins",
            icon: <FaUserSecret />,
            value: dashboardData?.totalAdmins || 0,
        },
        {
            title: "Total Staffs",
            icon: <FaUsersCog />,
            value: dashboardData?.totalStaffs || 0,
        },
        {
            title: "Total Users",
            icon: <FaUsers />,
            value: dashboardData?.totalUsers || 0,
        },
        {
            title: "Total Novels",
            icon: <GiBookshelf />,
            value: dashboardData?.totalNovels || 0,
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 pl-5">Dashboard</h2>
            <div className="text-gray-200">
                {/* Info Cards */}
                <div className="mb-4 px-5 w-full flex justify-center items-center gap-5">
                    {infoCards.map((card, index) => (
                        <div
                            key={index}
                            className="flex-grow flex items-center gap-4 bg-gradient-to-br from-gray-700 to-transparent p-4 rounded-2xl shadow-sm"
                        >
                            <div className="text-2xl p-2 bg-[rgba(87,87,94,0.5)] rounded-lg">
                                {card.icon}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xs uppercase">
                                    {card.title}
                                </div>
                                <div className="text-bold text-xl">
                                    {card.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Google Analytics */}
                <GoogleAnalyticsDashboard />

                {/* Users */}
                <div className="my-5 px-5 w-full flex gap-5">
                    <div className="w-2/3">
                        <h3 className="text-xl font-bold mb-3">Latest Users</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {latestUsers?.map((user) => (
                                <div
                                    key={user._id}
                                    className="w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 border-2 border-dashed border-gray-300 dark:border-gray-600"
                                >
                                    <Link
                                        to={
                                            "/user/profile?user=" +
                                            user.username
                                        }
                                        className="flex items-center p-5"
                                    >
                                        <img
                                            className="h-20 w-20 rounded-full object-cover"
                                            src={
                                                user.avatar ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt={user.name}
                                        />
                                        <div className="flex-grow ml-3">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                                    {user.name}
                                                </h2>
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {user.role}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <FaUser className="mr-2" />{" "}
                                                {user.username}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <FaEnvelope className="mr-2" />{" "}
                                                {user.email}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                                                <FaCalendarAlt className="mr-2 text-sm" />{" "}
                                                {new Date(user.createdAt)
                                                    .toLocaleString("en-US", {
                                                        weekday: "short",
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: true,
                                                    })
                                                    .replace(/,/, ", ")
                                                    .replace(/(\d{4}),/, "$1,")}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p
                        className="border-l border-gray-600 mt-10"
                        aria-hidden="true"
                    />
                    <div className="w-1/3">
                        <h3 className="text-xl font-bold mb-3">Admins</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {admins?.map((user) => (
                                <div
                                    key={user._id}
                                    className="w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 border-2 border-dashed border-gray-300 dark:border-gray-600"
                                >
                                    <Link
                                        to={
                                            "/user/profile?user=" +
                                            user.username
                                        }
                                        className="flex items-center p-5"
                                    >
                                        <img
                                            className="h-20 w-20 rounded-full object-cover"
                                            src={
                                                user.avatar ||
                                                "https://via.placeholder.com/150"
                                            }
                                            alt={user.name}
                                        />
                                        <div className="flex-grow ml-3 text-wrap">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                                    {user.name}
                                                </h2>
                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                    {user.role}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <FaUser className="mr-2" />{" "}
                                                {user.username}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <FaEnvelope className="mr-2" />{" "}
                                                {user.email}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                                                <FaCalendarAlt className="mr-2 text-sm" />{" "}
                                                {new Date(user.createdAt)
                                                    .toLocaleString("en-US", {
                                                        weekday: "short",
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: true,
                                                    })
                                                    .replace(/,/, ", ")
                                                    .replace(/(\d{4}),/, "$1,")}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
