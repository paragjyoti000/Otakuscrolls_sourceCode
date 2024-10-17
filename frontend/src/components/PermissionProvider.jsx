import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function PermissionProvider({
    permission = [],
    allPermissionRequired = false,
    messageRequired = false,
    message = "",
    autoRedirect = false,
    children,
}) {
    const userPermissions = useSelector((state) => state.auth.permissions);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const [isPermitted, setIsPermitted] = useState(false);

    useEffect(() => {
        if (allPermissionRequired) {
            setIsPermitted(
                permission.length > 0 &&
                    permission.every((p) => userPermissions.includes(p))
            );
        } else {
            setIsPermitted(
                permission.length > 0 &&
                    permission.some((p) => userPermissions.includes(p))
            );
        }
    }, [permission, userPermissions, allPermissionRequired]);

    const navigate = useNavigate();

    return isAdmin || isPermitted ? (
        children
    ) : messageRequired ? (
        message.length > 0 ? (
            <div className="bg-red-500 rounded px-4 py-2 font-semibold font-mono text-center m-1">
                {message}
            </div>
        ) : (
            <div className="flex flex-col justify-center items-center h-[80vh]">
                <h1 className="text-center text-lg text-cyan-500 ">
                    You don't have permission for this Request. Contact the
                    ADMIN for more info.
                </h1>
                <div className="flex justify-center items-center gap-2 mt-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    ) : autoRedirect ? (
        navigate(-1)
    ) : null;
}

export default PermissionProvider;
