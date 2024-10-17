import { useCallback, useEffect, useState } from "react";
import apiService from "../../api/service";
import { BlurImage, Loading } from "..";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { useCompactNumber } from "../../hooks";
import { useQueries } from "react-query";

function Trendings() {
    // const [novelsTrending, setNovelsTrending] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState("yesterday");

    const navigate = useNavigate();

    const compactNumber = useCompactNumber();

    const fetchData = async () => {
        return await apiService.getTrendingNovels(from).catch(() => {
            return [];
        });
    };

    const [{ data: novelsTrending, isLoading }] = useQueries([
        {
            queryKey: ["novelsTrending", { from }],
            queryFn: fetchData,
        },
    ]);

    const trandingTimes = [
        {
            title: "Today",
            from: "yesterday",
        },
        {
            title: "This Week",
            from: "7daysAgo",
        },
        {
            title: "This Month",
            from: "30daysAgo",
        },
    ];

    return (
        <>
            <h1 className="text-2xl font-bold mb-2">Trending Novels</h1>
            <div>
                <div className="mb-2 flex gap-2 border-b-2 border-slate-500">
                    {trandingTimes.map((time, index) => (
                        <div
                            key={index}
                            className={`px-2 py-1.5 cursor-pointer rounded-t-md ${
                                from === time.from &&
                                "bg-slate-500 text-slate-200"
                            }`}
                            onClick={() => setFrom(time.from)}
                        >
                            {time.title}
                        </div>
                    ))}
                </div>
                <div className="mb-2 md:shadow-inner md:shadow-black md:p-4">
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 gap-5">
                            {new Array(4).fill(
                                <div className="flex justify-start bg-slate-300 dark:bg-slate-950 rounded-md hover:scale-105 duration-300">
                                    <div className="w-1/5 h-full">
                                        <div className="w-full h-full bg-gray-300 dark:bg-gray-500 animate-pulse object-cover rounded-l-md" />
                                    </div>
                                    <div className="w-4/5 py-1 xl:py-3 px-2 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            {/* Title */}
                                            <div className="md:text-lg font-semibold mb-1 md:mb-2">
                                                <div className="w-[80%] h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                            </div>

                                            {/* Author */}
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <div className="w-[40%] h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                            </div>

                                            {/* Ratings and Total views */}
                                            <div className="text-sm flex justify-between">
                                                {/* Ratings */}
                                                <div className="text-xs flex items-center justify-start gap-2">
                                                    <div className="w-4 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                                </div>
                                                {/* Total views */}
                                                <div className="text-xs py-0.5 px-1 rounded-sm">
                                                    <div className="w-10 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                                </div>
                                            </div>

                                            {/* Total Chapters */}
                                            <div className="text-sm text-blue-700 dark:text-blue-300">
                                                <div className="w-[50%] h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : novelsTrending.length === 0 ? (
                        <p className="text-center md:text-lg">
                            There is no Trending novels found for{" "}
                            {from === "yesterday"
                                ? "Today"
                                : from === "7daysAgo"
                                ? "This Week"
                                : "This Month"}
                        </p>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 gap-5">
                                {novelsTrending.map((novel) => (
                                    <div
                                        key={novel._id}
                                        className="flex justify-start bg-slate-300 dark:bg-slate-950 rounded-md hover:scale-105 duration-300 cursor-pointer"
                                        onClick={() =>
                                            navigate(`/novel/${novel._id}`)
                                        }
                                    >
                                        <div className="w-1/5 h-full">
                                            <BlurImage
                                                img={
                                                    <img
                                                        src={novel.coverImage}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-l-md"
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="w-4/5 py-1 xl:py-3 px-2 flex flex-col justify-between">
                                            <div>
                                                {/* Title */}
                                                <div
                                                    className="md:text-lg font-semibold mb-1 md:mb-2 p-text"
                                                    style={{ lineHeight: 1 }}
                                                >
                                                    {novel.title}
                                                </div>

                                                {/* Author */}
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    By {novel.author}
                                                </div>

                                                {/* Ratings and Total views */}
                                                <div className="text-sm px-2 flex justify-between">
                                                    {/* Ratings */}
                                                    <div className="text-xs flex items-center justify-start gap-2">
                                                        {novel.avgRatings !==
                                                            0 && (
                                                            <div className="flex items-center">
                                                                {[
                                                                    ...new Array(
                                                                        5
                                                                    ),
                                                                ].map(
                                                                    (
                                                                        _,
                                                                        index
                                                                    ) => {
                                                                        let num =
                                                                            index +
                                                                            0.5;
                                                                        return (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                {novel.avgRatings >=
                                                                                index +
                                                                                    1 ? (
                                                                                    <FaStar color="yellow" />
                                                                                ) : novel.avgRatings >=
                                                                                  num ? (
                                                                                    <FaRegStarHalfStroke color="yellow" />
                                                                                ) : (
                                                                                    <FaRegStar color="yellow" />
                                                                                )}
                                                                            </span>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        )}
                                                        {novel.avgRatings?.toFixed(
                                                            1
                                                        ) || 0}
                                                    </div>
                                                    {/* Total views */}
                                                    <div className="text-xs py-0.5 px-1 bg-blue-600 text-white rounded-sm">
                                                        {compactNumber(
                                                            +novel.views *
                                                                novel.chaptersCount ||
                                                                novel.views
                                                        )}{" "}
                                                        views
                                                    </div>
                                                </div>

                                                {/* Total Chapters */}
                                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                                    Total Chapter:{" "}
                                                    {novel.chaptersCount}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default Trendings;
