import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { Button, PermissionProvider } from "../index";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../api/auth";

function Sidebar({ isOpen, setIsOpen, authStatus }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        });

        navigate("/");
    };

    const authItems = [
        {
            name: "Login",
            path: "/login",
            active: !authStatus,
        },
        {
            name: "Sign Up",
            path: "/signup",
            active: !authStatus,
        },
        {
            name: "My Profile",
            path: "/user/profile",
            active: authStatus,
        },
        {
            name: "Bookmarks",
            path: "/user/bookmarks",
            active: authStatus,
        },
        {
            name: "History",
            path: "/user/history",
            active: authStatus,
        },
        {
            name: "Settings",
            path: "/settings",
            active: authStatus,
        },
    ];

    return (
        <>
            <div
                className={`absolute h-auto w-60 top-14 bg-slate-400 dark:bg-slate-800 opacity-95 shadow-2xl rounded-lg transition-all duration-300 ease-in-out transform p-4 z-50 ${
                    isOpen
                        ? "right-6 translate-x-0"
                        : "right-0 translate-x-full"
                }`}
            >
                <div className="flex flex-col justify-between bg-inherit opacity-100">
                    <ul className="flex flex-col my-2 ">
                        {authStatus && (
                            <PermissionProvider
                                permission={["add_novel", "update_novel"]}
                            >
                                <li>
                                    <Link
                                        to={"/draft-novels"}
                                        className="block my-1 px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out bg-indigo-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white dark:text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Draft Novels
                                    </Link>
                                </li>
                            </PermissionProvider>
                        )}

                        {authItems.map(
                            (item) =>
                                item.active && (
                                    <li key={item.name} className="">
                                        <Link
                                            to={item.path}
                                            className="block my-1 px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out bg-indigo-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white dark:text-white"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                )
                        )}
                    </ul>
                    <div className="flex justify-between items-center m-1">
                        {authStatus && (
                            <Button
                                className="shadow-sm"
                                onClick={logoutHandler}
                            >
                                Logout▶️
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`absolute top-0 right-0 z-10 w-full h-screen ${
                    isOpen ? "block" : "hidden"
                }`}
                onClick={() => setIsOpen(false)}
            ></div>
        </>
    );
}

export default Sidebar;
