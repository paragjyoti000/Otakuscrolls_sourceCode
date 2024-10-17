import adminService from "../../api/admin";
import MySelect from "../MySelect";
import conf from "../../envConf/conf";
import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

function UpdateRole({ user, setUser = () => {}, setIsEditing = () => {} }) {
    const [role, setRole] = useState(user.role);

    const updateUserRole = async () => {
        await adminService
            .updateUserRole(user._id, role)
            .then((res) => {
                if (res) {
                    setUser({
                        ...user,
                        role: role,
                    });
                }
            })
            .finally(() => {
                setIsEditing({
                    editing: false,
                    element: null,
                });
            });
    };

    return (
        <div className="flex items-center ml-2">
            <div>
                <MySelect
                    className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Edit role"
                    options={conf.userRoles}
                    defaultValue={role}
                    onChange={(e) => setRole(e.target.value)}
                />
            </div>
            <div className="flex gap-1">
                <button
                    onClick={updateUserRole}
                    className="ml-2 p-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    aria-label="Save role"
                >
                    <FiCheck />
                </button>
                <button
                    onClick={() =>
                        setIsEditing({
                            editing: false,
                            element: null,
                        })
                    }
                    className="ml-2 p-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Cancel editing role"
                >
                    <FiX />
                </button>
            </div>
        </div>
    );
}

export default UpdateRole;
