import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import React from "react";
import { Carousel } from "antd";
import apiService from "../../api/service";
import parse from "html-react-parser";
import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import BlurImage from "../BlurImage";
import { useQueries } from "react-query";
import Loading from "../Loading";

const CustomCarousel = () => {
    const navigate = useNavigate();

    const getCarousel = async () => {
        return await apiService.getNovelForCarousel().catch(() => {
            return [];
        });
    };

    const [{ data: carousel, isLoading, refetch }] = useQueries([
        { queryKey: "carousel", queryFn: getCarousel },
    ]);

    const carouselRef = React.createRef();

    const goToNextSlide = () => {
        carouselRef.current.next();
    };

    const goToPrevSlide = () => {
        carouselRef.current.prev();
    };

    return isLoading ? (
        <div className="h-full w-full">
            <div className="group w-full h-52 sm:h-80 dark:text-gray-200 rounded-t-md overflow-hidden relative">
                <div className="w-full h-full text-black dark:text-white p-5 backdrop-blur-sm absolute top-0 bg-gradient-to-l from-slate-200 via-slate-100 dark:from-zinc-950 dark:via-gray-900 to-transparent">
                    <div className="sm:m-3 sm:mx-10 flex justify-start ">
                        <div className="relative w-1/3 lg:w-1/5 flex justify-center hover:scale-105 duration-300 animate-pulse">
                            <div className="group book absolute inset-0 sm:w-44 h-36 sm:h-64 sm:max-h-72 object-cover ">
                                <div
                                    //image
                                    className="sm:w-44 h-36 sm:h-64 sm:max-h-72 bg-gray-300 dark:bg-gray-500 rounded-md flex justify-center items-center lg:rounded-none drop-shadow-2xl shadow-xl shadow-indigo-500/40 group-hover:shadow-indigo-500 duration-300 transition-shadow ease-in-out"
                                >
                                    Loading...
                                </div>
                            </div>
                        </div>

                        <div className="w-2/3 lg:w-3/5 ml-2 sm:ml-5 space-y-2 sm:space-y-3">
                            <h1 className="sm:text-2xl lg:text-3xl font-bold sm:mt-2 uppercase p-text">
                                <div className="w-[60%] h-6 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                            </h1>
                            <h2 className="sm:text-xl text-xs text-gray-800 dark:text-gray-300">
                                <div className="w-[20%] h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                            </h2>
                            <span className="text-xs sm:mb-3 flex justify-between">
                                <div className="rounded-sm">
                                    <div className="w-4 h-5 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                </div>
                            </span>
                            <div className="space-y-1">
                                <p className="mt-6 w-[80%] h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                <p className="w-[80%] h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                <p className="w-[60%] h-3 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : carousel && carousel.length > 0 ? (
        <div className="relative">
            <div className="absolute inset-0 flex items-end md:items-center justify-between p-4">
                <button
                    onClick={goToPrevSlide}
                    className="z-40 text-3xl rounded-full hover:scale-110 duration-300"
                >
                    <IoIosArrowDropleft />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="z-40 text-3xl rounded-full hover:scale-110 duration-300"
                >
                    <IoIosArrowDropright />
                </button>
            </div>
            <Carousel ref={carouselRef} autoplay autoplaySpeed={4000}>
                {carousel.map((novel) => (
                    <div
                        key={novel._id}
                        className="h-full w-full cursor-pointer"
                        onClick={() => {
                            navigate(`/novel/${novel._id}`);
                        }}
                    >
                        <div className="group w-full h-52 sm:h-80 dark:text-gray-200 rounded-t-md overflow-hidden relative">
                            <img
                                src={novel.coverImage}
                                alt=""
                                className="w-3/5 object-cover -translate-y-28"
                            />
                            <div className="w-full h-full text-black dark:text-white p-5 backdrop-blur-sm absolute top-0 bg-gradient-to-l from-slate-200 via-slate-100 dark:from-zinc-950 dark:via-gray-900 to-transparent">
                                <div className="sm:m-3 sm:mx-10 flex justify-start ">
                                    <div className="relative w-1/3 lg:w-1/5 flex justify-center hover:scale-105 duration-300">
                                        <div className="group book absolute inset-0 sm:w-44 h-36 sm:h-64 sm:max-h-72 object-cover ">
                                            <BlurImage
                                                img={
                                                    <img
                                                        src={novel.coverImage}
                                                        alt=""
                                                        className="rounded-md lg:rounded-none drop-shadow-2xl shadow-xl shadow-indigo-500/40 group-hover:shadow-indigo-500 duration-300 transition-shadow ease-in-out"
                                                    />
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="w-2/3 lg:w-3/5 ml-2 sm:ml-5 sm:space-y-1 ">
                                        <h1 className="sm:text-2xl lg:text-3xl font-bold sm:mt-2 uppercase p-text">
                                            {novel.title}
                                        </h1>
                                        <h2 className="sm:text-xl text-xs text-gray-800 dark:text-gray-300">
                                            By {novel.author}
                                        </h2>
                                        <span className="text-xs sm:mb-3 flex justify-between">
                                            <div className="px-1 pb-0.5 rounded-sm bg-blue-600 text-white">
                                                {novel.chaptersCount}
                                            </div>
                                        </span>
                                        {novel.avgRating && (
                                            <div className="text-xs mt-0.5 flex items-center justify-start gap-1">
                                                <div className="font-bold rounded-full pb-0.5 px-1.5 bg-orange-500">
                                                    {novel.avgRating
                                                        ?.toFixed(1)
                                                        .replace(/\.0$/, "")}
                                                </div>
                                                {novel.avgRating !== 0 && (
                                                    <div className="flex items-center">
                                                        {[...new Array(5)].map(
                                                            (_, index) => {
                                                                let num =
                                                                    index + 0.5;
                                                                return (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        {novel.avgRating >=
                                                                        index +
                                                                            1 ? (
                                                                            <FaStar color="yellow" />
                                                                        ) : novel.avgRating >=
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
                                            </div>
                                        )}

                                        <h3 className="">{novel.genre}</h3>
                                        <div
                                            className="text-xs sm:text-sm p-text"
                                            style={{ "--line-no": 3 }}
                                        >
                                            {parse(`${novel.description}`)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    ) : (
        <div className="w-full h-52 sm:h-80 flex justify-center items-center">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-lg hover:scale-110 duration-300"
                onClick={() => refetch()}
            >
                Re-Load
            </button>
        </div>
    );
};

export default CustomCarousel;
