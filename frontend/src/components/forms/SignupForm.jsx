import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { login as storeLogin } from "../../store/authSlice";
import { Button, Input } from "..";
import authService from "../../api/auth";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError(null);
        try {
            const session = await authService.createAccount(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) dispatch(storeLogin({ userData }));
                navigate(-1);
            }
        } catch (err) {
            if (err.response.status === 409) setError("User already exists");
            else {
                if (err.response.status >= 500) {
                    setError("Internal server error");
                } else setError(err.response.statusText);
            }
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl text-center font-semibold text-gray-800 dark:text-white mb-4">
                        Sign Up
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className=" space-y-4">
                            {/* Username */}
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="username"
                                    {...register("username", {
                                        required: true,
                                        validate: {
                                            matchPattern: (value) => {
                                                const pattern =
                                                    /^[a-z0-9_]{5,}$/;
                                                return (
                                                    pattern.test(value) ||
                                                    "Username must be at least 5 characters long and can only contain letters, numbers, and underscores"
                                                );
                                            },
                                        },
                                    })}
                                />
                                <div className="text-[10px] dark:text-gray-400 -mt-2">
                                    Username must be at least 5 characters long
                                    and can only contain letters in lowercase [
                                    a-z ], numbers [ 0-9 ], and underscores [ _
                                    ]
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email", {
                                        required: true,
                                        validate: {
                                            matchPattern: (value) => {
                                                const pattern =
                                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                                                return (
                                                    pattern.test(value) ||
                                                    "Please enter a valid email address"
                                                );
                                            },
                                        },
                                    })}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    {...register("password", {
                                        required: true,
                                        validate: {
                                            matchPattern: (value) => {
                                                const pattern = /^.{8,}$/;
                                                return (
                                                    pattern.test(value) ||
                                                    "Password must be at least 8 characters long and can contain any character (except newline)"
                                                );
                                            },
                                        },
                                    })}
                                />
                                <div className="text-[10px] dark:text-gray-400 -mt-2">
                                    Password must be at least 8 characters long
                                    and can contain any character {"("}except
                                    newline{")"}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Confirm password"
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
                                    <div>{error}</div>
                                </div>
                            )}

                            {/* Remember Me */}
                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 dark:text-gray-300 mb-2"
                                    htmlFor="rememberMe-346986"
                                >
                                    <input
                                        className=""
                                        id="rememberMe-346986"
                                        type="checkbox"
                                        {...register("rememberMe", {})}
                                    />{" "}
                                    Remember me
                                </label>
                            </div>

                            {/* Sign Up Button */}
                            <Button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Sign Up
                            </Button>
                            <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-500 hover:underline"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;
