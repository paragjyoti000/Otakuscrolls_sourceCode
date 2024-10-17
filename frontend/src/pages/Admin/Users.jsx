import { useState } from "react";
import {
    UpdateRole,
    UserSearch,
    ManageUserPermissions,
    UpdateLabels,
} from "../../components/Admin";
import { useRelativeTime } from "../../hooks";
import {
    FaUserCircle,
    FaEnvelope,
    FaCalendarAlt,
    FaClock,
    FaTag,
    FaEdit,
} from "react-icons/fa";
import { FaLock, FaCirclePlus, FaCircleXmark } from "react-icons/fa6";

function Users() {
    const [user, setUser] = useState(null);

    const [isEditing, setIsEditing] = useState({
        edit: false,
        element: null,
    });

    const date = useRelativeTime();

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <div className="mb-4">
                <UserSearch setUser={setUser} />
            </div>

            {user && (
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-slate-900 text-gray-800 dark:text-gray-200 shadow-lg rounded-xl p-6 max-w-5xl mx-auto my-8">
                    <div className="flex">
                        <div className="flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <h2 className="text-3xl font-bold mb-2">
                                        {user.name}
                                    </h2>
                                    <div className="flex items-center mb-2">
                                        <FaUserCircle className="mr-2" />
                                        <span className="text-slate-600 dark:text-gray-400 mb-0.5">
                                            @{user.username}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <FaEnvelope className="mr-2" />
                                            <span className="font-semibold">
                                                Email:
                                            </span>
                                            <span className="ml-2">
                                                {user.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaTag className="mr-2" />
                                            <span className="font-semibold">
                                                Role:
                                            </span>
                                            {isEditing.edit === true &&
                                            isEditing.element === "role" ? (
                                                <UpdateRole
                                                    user={user}
                                                    setUser={setUser}
                                                    setIsEditing={setIsEditing}
                                                />
                                            ) : (
                                                <div className="flex items-center">
                                                    <span className="ml-2 mr-2">
                                                        {user.role}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            setIsEditing({
                                                                edit: true,
                                                                element: "role",
                                                            })
                                                        }
                                                        className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="mr-2" />
                                            <span className="font-semibold">
                                                Join Date:
                                            </span>
                                            <span className="ml-2">
                                                {date(user.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaClock className="mr-2" />
                                            <span className="font-semibold">
                                                Last Update:
                                            </span>
                                            <span className="ml-2">
                                                {date(user.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <button
                                        onClick={() =>
                                            setIsEditing({
                                                edit: true,
                                                element: "permissions",
                                            })
                                        }
                                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
                                        aria-label="Manage Permissions"
                                    >
                                        <FaLock className="mr-2" />
                                        Manage Permissions
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                    Labels
                                    <button className="text-2xl text-blue-500 hover:text-blue-600 focus:outline-none transition-transform duration-300">
                                        {isEditing.edit === true &&
                                        isEditing.element === "labels" ? (
                                            <FaCircleXmark
                                                onClick={() =>
                                                    setIsEditing({
                                                        edit: false,
                                                        element: null,
                                                    })
                                                }
                                            />
                                        ) : (
                                            <FaCirclePlus
                                                onClick={() =>
                                                    setIsEditing({
                                                        edit: true,
                                                        element: "labels",
                                                    })
                                                }
                                            />
                                        )}
                                    </button>
                                </h3>
                                {isEditing.edit === true &&
                                isEditing.element === "labels" ? (
                                    <UpdateLabels
                                        user={user}
                                        setUser={setUser}
                                        setIsEditing={setIsEditing}
                                    />
                                ) : user.labels && user.labels.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {user.labels.map((label, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No labels associated with this user.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="pl-8 border-l border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Additional Information
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                This section is ready for future data fields. As
                                new profile information becomes available, it
                                can be seamlessly integrated here.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {isEditing.edit === true && isEditing.element === "permissions" && (
                <ManageUserPermissions
                    user={user}
                    setUser={setUser}
                    setIsEditing={setIsEditing}
                />
            )}
        </div>
    );
}

export default Users;
