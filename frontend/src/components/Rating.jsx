import { Rate } from "antd";
import { useEffect, useState } from "react";
import apiService from "../api/service";
import { FaStar, FaRegStarHalfStroke, FaRegStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Rating({ novelId, avgRatings = 0, authStatus = false }) {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (novelId) {
            apiService
                .getUserRating(novelId)
                .then((res) => {
                    setRating(res.value);
                })
                .catch((err) => {
                    if (err.response.status === 404) {
                        null;
                    }
                });
        }
    }, [novelId, rating]);

    const handleNovelRating = async (value) => {
        setRating(value);

        await apiService
            .rateANovel(novelId, value)
            .then((res) => {
                setRating(res.value);
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    null;
                }
            });
    };

    return (
        <div className="flex flex-col items-start rounded-full">
            <div className="flex justify-between items-center pb-2">
                <p className="mr-2">Rating: </p>
                <p className="font-bold text-lg">
                    {avgRatings !== 0
                        ? avgRatings.toFixed(1).replace(/\.0$/, "")
                        : "NA"}
                    /5
                </p>
                {avgRatings !== 0 && (
                    <div className="ml-2 flex">
                        {[...new Array(5)].map((_, index) => {
                            let num = index + 0.5;

                            return (
                                <span key={index}>
                                    {avgRatings >= index + 1 ? (
                                        <FaStar color="#FFD700" />
                                    ) : avgRatings >= num ? (
                                        <FaRegStarHalfStroke color="#FFD700" />
                                    ) : (
                                        <FaRegStar color="#FFD700" />
                                    )}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center">
                {show ? (
                    authStatus ? (
                        <>
                            <Rate
                                className="stars dark:stars"
                                defaultValue={rating}
                                allowClear={false}
                                allowHalf
                                tooltips={[
                                    "Terrible",
                                    "Bad",
                                    "Good",
                                    "Very Good",
                                    "Excellent",
                                ]}
                                onChange={(value) => handleNovelRating(value)}
                            />

                            <div className="flex p-1">
                                {rating !== 0
                                    ? `You rated (${rating}) stars`
                                    : "You haven't rated yet"}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-start space-y-1">
                            <p>Please login to rate this novel</p>
                            <p
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </p>
                        </div>
                    )
                ) : (
                    <p
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={() => setShow(true)}
                    >
                        Rate this novel
                    </p>
                )}
            </div>
        </div>
    );
}

export default Rating;
