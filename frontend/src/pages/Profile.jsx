import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import authService from "../api/auth";
import { GiCrossMark } from "react-icons/gi";
import { VscUnverified, VscVerifiedFilled } from "react-icons/vsc";
import { FaEdit } from "react-icons/fa";
import { Button, Loading, OtpForm } from "../components";
import { useCompactNumber } from "../hooks";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [avatars, setAvatars] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState(user.name);
    const [otpError, setOtpError] = useState(null);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [serverOTP, setServerOTP] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    const [isLoggedInUser, setIsLoogedInUser] = useState(false);

    const username = searchParams.get("user");

    const storeUser = useSelector((state) => state.auth.user);

    const compactNumber = useCompactNumber();

    useEffect(() => {
        setError(null);

        if (!username) {
            setSearchParams({ user: storeUser.username });
            return;
        }

        authService
            .getUserProfile(username)
            .then((data) => {
                setUser(data);
                setIsVerified(data.isVerified);
                setUserName(data.name);
            })
            .catch((err) => {
                setError({
                    statusText: err.response.statusText,
                    status: err.response.status,
                });
            });

        if (storeUser) {
            setIsLoogedInUser(storeUser._id === user._id);
        } else {
            setIsLoogedInUser(false);
        }
    }, [navigate, username, setSearchParams, storeUser, user._id]);

    const updateName = () => {
        if (userName === user.name && userName.trim() === "") {
            setIsEditing(false);
            return;
        }
        authService
            .updateUserAccountName(userName)
            .then((data) => {
                if (data) setUser(data);
            })
            .catch((err) => {
                setError({
                    statusText: err.response.statusText,
                    status: err.response.status,
                });
            });

        setIsEditing(false);
    };

    const getAvatars = () => {
        authService.getAllAvatarOptions().then((data) => {
            if (data) {
                setAvatars(data);
            }
        });
    };

    const updateAvater = (avatar) => {
        if (window.confirm("Are you sure you want to update your avatar?"))
            authService
                .updateAvatar(avatar)
                .then((data) => {
                    if (data) setUser(data);
                })
                .catch((err) => {
                    setError({
                        statusText: err.response.statusText,
                        status: err.response.status,
                    });
                });

        setShowProfileOptions(false);
    };

    const followToggler = () => {
        authService.followUnfollowUser(user._id).catch((err) => {
            setError({
                statusText: err.response.statusText,
                status: err.response.status,
            });
        });

        if (user.isFollowed) {
            setUser((prev) => ({
                ...prev,
                followersCount: prev.followersCount - 1,
                isFollowed: false,
            }));
        } else {
            setUser((prev) => ({
                ...prev,
                followersCount: prev.followersCount + 1,
                isFollowed: true,
            }));
        }
    };

    const sendVerificationEmail = () => {
        if (isLoggedInUser) {
            if (
                window.confirm(
                    "Are you sure to send an email to your email address.\nYou will get only 2 attempts daily.\nPlease check your spam folder as well."
                )
            ) {
                authService
                    .sendVerificationEmail()
                    .then((data) => {
                        setServerOTP(data);
                        setShowOtpForm(true);
                    })
                    .catch((err) => {
                        console.log(err);
                        if (err.response.status === 429) {
                            setOtpError(
                                "Your OTP request limit exceeded for today"
                            );
                        }
                    });
            }
        }
    };

    const verifyOTP = (otp) => {
        authService.verifyEmail(otp).catch((err) => {
            setOtpError(err.response.statusText);
        });

        setIsVerified(true);
        setShowOtpForm(false);
    };

    return !error ? (
        <>
            {showProfileOptions && (
                <div
                    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 flex justify-center md:items-center z-50 overflow-y-auto`}
                >
                    <div
                        className={`flex flex-wrap justify-center items-center text-white `}
                    >
                        <div
                            className={`md:p-7 rounded-md backdrop-blur-lg flex flex-col flex-wrap justify-center items-center `}
                        >
                            <h1 className="text-xl md:text-2xl font-bold text-orange-400 mb-4">
                                Select New Avatar
                            </h1>

                            <button
                                onClick={() => setShowProfileOptions(false)}
                                className="absolute top-0 right-0 md:top-8 md:right-2 p-2"
                            >
                                <GiCrossMark
                                    size={20}
                                    className=" text-white hover:text-red-500 hover:scale-125 duration-100 cursor-pointer"
                                />
                            </button>
                            <div
                                className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 `}
                            >
                                {avatars.map((avatar, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-full border-2 border-gray-400 hover:scale-105 duration-100 cursor-pointer`}
                                        onClick={() => updateAvater(avatar)}
                                    >
                                        <img
                                            className="w-20 h-20 rounded-full cursor-pointer"
                                            src={avatar}
                                            alt="avatar"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="overflow-hidden w-full flex flex-col justify-center items-center gap-5">
                <div className="relative w-full h-28 md:h-48 md:mb-20 mb-14 bg-gradient-to-t from-blue-400 via-blue-500 to-blue-600">
                    <div className="absolute md:top-2/4 top-2/4 left-1/2 -translate-x-1/2 w-[80%] flex justify-between items-end md:gap-10 lg:gap-60">
                        <div className="flex justify-center">
                            {/* Profile Image */}
                            <div
                                className={`rounded-full w-24 md:w-44 md:h-44 border-4 md:border-8 border-white dark:border-gray-900 overflow-hidden object-cover object-center text-center ${
                                    isLoggedInUser
                                        ? "hover:scale-110 duration-200 cursor-pointer"
                                        : ""
                                }`}
                                onClick={() => {
                                    if (isLoggedInUser) {
                                        getAvatars();
                                        setShowProfileOptions(
                                            !showProfileOptions
                                        );
                                    }
                                }}
                            >
                                <img
                                    className="w-full"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                            </div>
                        </div>

                        <div className="md:mb-4 flex justify-center">
                            {isLoggedInUser ? (
                                <div className="flex space-x-3">
                                    {/* Change Password Button */}
                                    <button
                                        className=" bg-blue-500 text-white font-semibold px-2 py-1 rounded-md text-sm"
                                        onClick={() =>
                                            navigate("/user/change-password")
                                        }
                                    >
                                        Change Password
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => followToggler()}
                                    className={`${
                                        user.isFollowed
                                            ? "bg-red-500 hover:bg-red-700"
                                            : "bg-blue-500 hover:bg-blue-700"
                                    } hover:bg-blue-700 text-white text-sm font-semibold py-1 px-2 rounded`}
                                >
                                    {user.isFollowed ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 w-[80%] flex flex-col md:flex-row gap-10">
                    {/* Profile Details */}
                    <div className="md:w-2/3 flex flex-col gap-2">
                        {/* Profile Name */}
                        <h1 className="text-2xl text-gray-800 dark:text-white">
                            {isEditing ? (
                                <>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={(e) =>
                                                setUserName(e.target.value)
                                            }
                                            className="text-2xl text-center pb-1 bg-transparent outline-none border-2 border-gray-500 rounded-md"
                                        />
                                        <div className="space-x-2">
                                            <Button
                                                className="bg-green-500"
                                                onClick={() => updateName()}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                className="bg-red-500"
                                                onClick={() =>
                                                    setIsEditing(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : isLoggedInUser ? (
                                <div className="flex items-center gap-4 text-2xl font-bold">
                                    <div className="">{user.name}</div>
                                    <div
                                        className={`cursor-pointer text-gray-400 hover:text-blue-500 hover:scale-110 duration-100`}
                                        onClick={() =>
                                            isLoggedInUser && setIsEditing(true)
                                        }
                                    >
                                        <FaEdit />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xl">
                                    Hello !! I am{" "}
                                    <span className={`font-bold text-2xl`}>
                                        {user.name}
                                    </span>
                                </div>
                            )}
                        </h1>

                        {/* Details */}
                        <div className="w-full text-center text-gray-600 dark:text-gray-400 flex flex-wrap gap-3">
                            <p className="">
                                <span className="">@</span>
                                {user.username}
                            </p>
                            |<p className=" ">{user.role}</p>|
                            <p className="">
                                <span className="">Joined </span>
                                {new Date(user.createdAt).toDateString()}
                            </p>
                            |
                            <p className="">
                                {isVerified ? (
                                    <VscVerifiedFilled
                                        size={25}
                                        className="text-blue-500 dark:text-blue-300 "
                                    />
                                ) : isLoggedInUser ? (
                                    <>
                                        <div
                                            className="flex items-center space-x-1 cursor-pointer hover:scale-105"
                                            onClick={() =>
                                                sendVerificationEmail()
                                            }
                                        >
                                            <VscUnverified
                                                size={25}
                                                className="text-red-700 dark:text-red-500 "
                                            />
                                            <p className="text-red-700 dark:text-red-500 ">
                                                Verify Now
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <VscUnverified
                                        size={25}
                                        className="text-red-700 dark:text-red-500 "
                                    />
                                )}
                            </p>
                        </div>
                        {/* Labels */}
                        {user.labels && user.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {user.labels.map((label, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-300 dark:bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* OTP Form */}
                        {showOtpForm && (
                            <div>
                                <Suspense fallback={<Loading />}>
                                    <OtpForm
                                        length={6}
                                        serverOTP={serverOTP}
                                        onSubmit={(otp) => verifyOTP(otp)}
                                    />
                                </Suspense>
                            </div>
                        )}
                        {otpError && <p>{otpError}</p>}
                    </div>

                    {/* Followers and Followings */}
                    <div className="md:w-1/3 px-4 py-1">
                        <div className="flex justify-center items-center gap-5">
                            <div className="flex-grow bg-[rgba(0,0,0,0.3)] rounded-lg px-4 py-2">
                                <p className="font-bold text-xl dark:text-blue-300 text-blue-500">
                                    {compactNumber(user.followersCount)}
                                </p>
                                <p className="text-sm dark:text-gray-300 text-gray-800">
                                    Followers
                                </p>
                            </div>
                            <div className="flex-grow bg-[rgba(0,0,0,0.3)] rounded-lg px-4 py-2">
                                <p className="font-bold text-xl dark:text-blue-300 text-blue-500">
                                    {compactNumber(user.followingsCount)}
                                </p>
                                <p className="text-sm dark:text-gray-300 text-gray-800">
                                    Followings
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="w-[80%]" />

                <div className="mb-10 w-[80%] flex flex-col md:flex-row gap-10 ">
                    <div className="w-2/3 border"></div>
                    <div className="w-1/3 border"></div>
                </div>
            </div>
        </>
    ) : (
        <>
            {/* Profile Error handling */}
            <div className="text-center py-10">
                <h1>Profile Not Found</h1>
                <h2 className="text-xl">username: {username}</h2>
                <p className="text-red-500">
                    {error.status} {error.statusText}
                </p>
            </div>
        </>
    );
}

export default Profile;
