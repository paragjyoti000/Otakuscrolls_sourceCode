import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaUser, FaStar, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import apiService from "../api/service";
import parse from "html-react-parser";

const FeedPage = () => {
    const [feeds, setFeeds] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;
    const [error, setError] = useState(null);

    const fetchFeeds = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Simulating API call
            await apiService.getLatestFeed(page, limit).then((res) => {
                setMetadata(res.data.metadata);
                setFeeds((prevFeeds) => [...prevFeeds, ...res.data]);
            });
        } catch (error) {
            setError({
                message: `Failed to fetch feeds\nError: ${error.response.statusText}`,
                status: error.response.status,
            });
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchFeeds();
    }, [fetchFeeds]);

    return (
        <>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                    Feeds
                </h1>
                <div className="max-w-6xl mx-auto">
                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                        >
                            <span className="block sm:inline">
                                {error.message}
                            </span>
                        </div>
                    )}
                    {feeds.map((feed, index) => (
                        <div
                            key={index}
                            className="mb-8 bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 from-slate-300 to-slate-100 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl"
                        >
                            <div className="relative p-6">
                                <div
                                    className={`absolute top-6 right-6 px-2 py-1 rounded-full text-xs font-semibold ${
                                        feed.novel.status === "Ongoing"
                                            ? "bg-green-500"
                                            : feed.novel.status === "Completed"
                                            ? "bg-blue-500"
                                            : "bg-red-500"
                                    }`}
                                >
                                    {feed.novel.status || "Unknown"}
                                </div>
                                <div className="flex flex-col sm:flex-row items-start mb-4">
                                    <img
                                        src={feed.novel.coverImage}
                                        alt={feed.novel.title}
                                        className="w-24 h-36 aspect-[2/3] object-cover rounded-md mb-1 sm:mb-0 sm:mr-4"
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {feed.novel.title}
                                        </h2>
                                        <div className="flex items-center mt-1">
                                            <FaUser className="text-gray-500 dark:text-gray-400 mr-1" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {feed.novel.author}
                                            </p>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <FaStar className="text-yellow-400 mr-1" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {feed.novel.avgRatings?.toFixed(
                                                    1
                                                ) || "NA"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 my-2">
                                            {feed.novel.genres.map(
                                                (genre, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-gray-800 dark:text-gray-200 text-xs bg-slate-400 dark:bg-slate-600 rounded-full px-2 py-1"
                                                    >
                                                        {genre}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    {feed.title}
                                </h3>
                                <div className="flex items-center mb-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Chapter {feed.sequenceNumber}
                                    </p>
                                </div>

                                <div
                                    className="p-text text-gray-600 dark:text-gray-300 mb-4"
                                    style={{ "--line-no": 3 }}
                                >
                                    {parse(`${feed.content}`)}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col sm:flex-row items-start text-gray-400">
                                        <div className="flex items-center">
                                            <FaBookOpen className="mr-2" />
                                            <span>
                                                {feed.isPublished
                                                    ? "Published"
                                                    : "Pre-Released"}
                                            </span>
                                        </div>
                                        <span className="mx-2 hidden sm:block">
                                            |
                                        </span>
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="mr-2" />
                                            <span>
                                                {new Date(feed.createdAt)
                                                    .toDateString("en-US", {
                                                        weekday: "short",
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    .replace(/,/, ", ")}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-sm sm:text-base bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading ? (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Loading...
                            </p>
                        </div>
                    ) : (
                        (metadata?.total || 0) > page * limit && (
                            <div className="text-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => setPage(page + 1)}
                                >
                                    Load More
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default FeedPage;
