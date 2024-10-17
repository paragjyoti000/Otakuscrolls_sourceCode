import { useState } from "react";
import { login as storeLogin } from "../../store/authSlice";
import { Button, Input } from "..";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../../api/auth";

function ChangePasswordForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError(null);
        try {
            const success = await authService.changePassword(data);

            if (success) {
                navigate("/user/profile");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        Change Password
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 text-center">
                            <div className="mb-4">
                                <Input
                                    className=""
                                    type="password"
                                    placeholder="Old Password"
                                    {...register("oldPassword", {
                                        required: true,
                                    })}
                                />
                            </div>
                            <div className="mb-6">
                                <Input
                                    className=""
                                    type="password"
                                    placeholder="New Password"
                                    {...register("newPassword", {
                                        required: true,
                                    })}
                                />
                            </div>
                            <div className="mb-6">
                                <Input
                                    className=""
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register("confirmPassword", {
                                        required: true,
                                    })}
                                />
                            </div>
                            {error && (
                                <div
                                    className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 rounded-sm"
                                    role="alert"
                                >
                                    <svg
                                        className="fill-current w-4 h-4 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                                    </svg>
                                    <p>{error}</p>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Change Password
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ChangePasswordForm;
