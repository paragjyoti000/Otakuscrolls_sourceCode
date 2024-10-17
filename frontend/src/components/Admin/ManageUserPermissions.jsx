import { useState } from "react";
import {
    FaBook,
    FaPen,
    FaTrash,
    FaEye,
    FaUpload,
    FaUnlock,
    FaTag,
    FaChartBar,
    FaUsersCog,
    FaEdit,
    FaBookOpen,
    FaTrashAlt,
    FaCogs,
    FaGlasses,
    FaRegCheckSquare,
    FaRegSquare,
} from "react-icons/fa";
import conf from "../../envConf/conf";
import adminService from "../../api/admin";

const permissionIcons = {
    add_novel: <FaBook />,
    update_novel: <FaPen />,
    delete_novel: <FaTrash />,
    add_chapter: <FaBookOpen />,
    edit_chapter: <FaEdit />,
    delete_chapter: <FaTrashAlt />,
    publish_novel: <FaUpload />,
    view_unpublished_chapter: <FaEye />,
    view_only_staff_content: <FaGlasses />,
    manage_users: <FaUsersCog />,
    assign_labels: <FaTag />,
    view_analytics: <FaChartBar />,
    access_admin_panel: <FaUnlock />,
};

const ManageUserPermissions = ({
    user,
    setUser = () => {},
    setIsEditing = () => {},
}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const permissions = conf.allAvailableUserPermissions.map((permission) => ({
        name: permission.name,
        id: permission.id,
        icon: permissionIcons[permission.id] || <FaCogs />,
    }));

    const [selectedPermissions, setSelectedPermissions] = useState(
        user?.permissions || []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTogglePermission = (permissionId) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSavePermissions = () => {
        setIsLoading(true);
        setError(null);
        if (user) {
            adminService
                .updateUsersPermissions(user._id, selectedPermissions)
                .then(() => {
                    setUser({
                        ...user,
                        permissions: selectedPermissions,
                    });
                })
                .catch((error) => {
                    setError({
                        status: error.response.status,
                        message: error.response.statusText,
                    });
                })
                .finally(() => {
                    setShowConfirmation(true);
                    setIsLoading(false);
                });
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        setIsEditing({
            edit: false,
            element: null,
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-gray-700 bg-opacity-50 overflow-y-auto h-full w-full p-4">
                <div className="relative top-20 bg-slate-100 dark:bg-slate-900 rounded-lg shadow-xl w-full mx-auto p-8 transition-all duration-300 ease-in-out">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                        Manage User Permissions
                    </h2>
                    <div className="mb-6">
                        <p className="text-gray-600 dark:text-gray-300">
                            User:{" "}
                            <span className="font-semibold">{user?.name}</span>
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 shadow-md rounded-lg p-6 mb-6 duration-200 ease-in-out">
                        <h2 className="text-xl font-semibold mb-4">
                            Available Permissions
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {permissions.map(({ id, name, icon }) => (
                                <div key={id} className="flex items-center">
                                    <button
                                        onClick={() =>
                                            handleTogglePermission(id)
                                        }
                                        className="mr-3 focus:outline-none"
                                        aria-label={`Toggle ${name}`}
                                    >
                                        {selectedPermissions.includes(id) ? (
                                            <FaRegCheckSquare className="text-blue-500 text-2xl" />
                                        ) : (
                                            <FaRegSquare className="text-gray-400 text-2xl" />
                                        )}
                                    </button>
                                    <span className="flex gap-2 items-center">
                                        {icon}
                                        {name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            onClick={() =>
                                setIsEditing({
                                    edit: false,
                                    element: null,
                                })
                            }
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={handleSavePermissions}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Permissions"}
                        </button>
                    </div>

                    {showConfirmation && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
                                {error ? (
                                    <>
                                        <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
                                            Error {error.status}
                                        </h3>
                                        <p className="text-smtext-red-500 dark:text-red-300 mb-4">
                                            {error.message}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            Error updating user permissions.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                                            Permissions Updated
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                                            User permissions have been
                                            successfully updated.
                                        </p>
                                    </>
                                )}
                                <button
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    onClick={handleCloseConfirmation}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ManageUserPermissions;
