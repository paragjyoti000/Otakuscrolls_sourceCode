import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Bookmark,
    Button,
    Comments,
    Rating,
    ProgressBar,
    Input,
    PermissionProvider,
} from "../components";
import parse from "html-react-parser";
import useRelativeTime from "../hooks/useRelativeTime";
import apiService from "../api/service";
import {
    IoIosArrowDropdown,
    IoIosArrowDropdownCircle,
    IoMdCloseCircle,
} from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import BlurImage from "../components/BlurImage";
import { set, useForm } from "react-hook-form";
import { useQueries } from "react-query";

function Novel() {
    const [showGlossaries, setShowGlossaries] = useState(false);
    const [chapterPage, setChapterPage] = useState(1);

    const chapterLimit = 20;

    const { novelId } = useParams();
    const navigate = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const [novel, setNovel] = useState({});

    const [loading, setLoading] = useState(true);

    let startReading = `/novel/${novelId}`;
    if (
        novel?.chapters?.data?.length > 0 &&
        novel?.chapters?.data[0].sequenceNumber === 1
    ) {
        startReading = `/novel/${novelId}/chapter/1/${novel?.chapters?.data[0]._id}`;
    }

    useEffect(() => {
        setLoading(true);
        if (novelId) {
            setNovel({
                ...novel,
                chapters: [],
            });
            if (authStatus) {
                apiService
                    .getNovelWithHistory(novelId, chapterPage, chapterLimit)
                    .then((data) => {
                        if (data) {
                            setNovel(data);
                        }
                    })
                    .catch((err) => {
                        if (err.response.status === 404) navigate("/404");
                    });
            } else {
                apiService
                    .getNovel(novelId, chapterPage, chapterLimit)
                    .then((data) => {
                        if (data) {
                            setNovel(data);
                        }
                    })
                    .catch((err) => {
                        if (err.response.status === 404) navigate("/404");
                    });
            }
        } else {
            navigate("/404");
        }

        setLoading(false);
    }, [novelId, authStatus, navigate, chapterPage, chapterLimit]);

    const date = useRelativeTime();

    const deleteNovel = () => {
        if (window.confirm("Are you sure you want to delete this novel?"))
            apiService.deleteNovel(novel._id).then((status) => navigate("/"));
    };

    return (
        !loading && (
            <>
                <div className="container mx-auto p-2 md:p-8 pb-0">
                    <div className="flex flex-col md:flex-row py-5">
                        {/* Novel image */}
                        <div className="flex justify-center md:block md:w-1/5 md:mt-3 mb-1 md:mb-0">
                            <div className="relative w-4/6 md:w-full aspect-[2/3]">
                                <div className="group book absolute inset-0">
                                    {/* Cover Image */}
                                    <BlurImage
                                        img={
                                            <img
                                                src={novel.coverImage}
                                                alt={novel.title}
                                                className="rounded-md lg:rounded-none"
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Novel Details and Admin controls */}
                        <div className=" md:w-2/5 md:pl-8 flex flex-col items-start">
                            <div className="w-full  pl-4 border-l-2 border-gray-500">
                                {/* Title */}
                                <h1 className="text-2xl font-bold mb-2 mt-2">
                                    {novel.title}
                                </h1>
                                {/* Published time */}
                                <div className="text-sm mb-4 text-gray-500">
                                    {date(novel.updatedAt)}
                                </div>

                                {/* Admin controls */}
                                <div className="text-sm mb-2 flex items-center">
                                    {/* Edit Buttons */}
                                    <PermissionProvider
                                        permission={["update_novel"]}
                                    >
                                        <Link to={`/edit-novel/${novel._id}`}>
                                            <Button className="mx-2 bg-green-500">
                                                Edit
                                            </Button>
                                        </Link>
                                    </PermissionProvider>

                                    {/* Delete Button */}
                                    <PermissionProvider
                                        permission={["delete_novel"]}
                                    >
                                        <Button
                                            onClick={deleteNovel}
                                            className="mx-2 bg-red-500"
                                        >
                                            Delete
                                        </Button>
                                    </PermissionProvider>
                                </div>

                                {/* Author */}
                                <div className="text-sm mb-2">
                                    Author:{" "}
                                    <Link
                                        to={`/search?q=${novel.author}`}
                                        className=""
                                    >
                                        {novel.author}
                                    </Link>
                                </div>

                                {/* Language of Origin */}
                                <div className="text-sm mb-2">
                                    Language of Origin:{" "}
                                    <Link
                                        to={`/search?q=${novel.langOfOrigin}`}
                                        className=""
                                    >
                                        {novel.langOfOrigin}
                                    </Link>
                                </div>

                                {/* Status */}
                                <div className="text-sm mb-2">
                                    Status: {novel.status}
                                </div>

                                {/* Genres */}
                                <div className="mb-2 text-sm max-w-60 text-left flex">
                                    <span>Genres: </span>
                                    <span className="flex flex-wrap">
                                        {novel.genres &&
                                            novel.genres.map((genre, index) => (
                                                <Link
                                                    to={`/search?q=${genre}`}
                                                    key={index}
                                                    className="m-0.5 px-1 py-0.5 rounded-sm text-xs bg-slate-100 dark:bg-slate-600"
                                                >
                                                    {genre}
                                                </Link>
                                            ))}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                {authStatus &&
                                    novel.userHistory?.chapters.length > 0 && (
                                        <>
                                            <div className="flex items-end text-sm mb-2">
                                                <ProgressBar
                                                    totalChapters={
                                                        novel.chapters?.metadata
                                                            ?.total
                                                    }
                                                    completedChapters={
                                                        novel.userHistory
                                                            ?.chapters.length
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                {/* Rating and Bookmark */}
                                <div className="flex items-end text-sm mb-2">
                                    <Rating
                                        novelId={novel._id}
                                        avgRatings={novel.avgRatings}
                                        authStatus={authStatus}
                                    />
                                    <Bookmark
                                        novelId={novel._id}
                                        authStatus={authStatus}
                                    />
                                </div>

                                {/* Translated by */}
                                <div className="flex items-center text-sm my-4 gap-2">
                                    Translated by:
                                    <div>
                                        <div
                                            className="flex justify-start items-center space-x-2 text-sm cursor-pointer"
                                            onClick={() => {
                                                navigate(
                                                    `/user/profile?user=${novel.translatedBy?.username}`
                                                );
                                            }}
                                        >
                                            <img
                                                className="w-7 h-7 rounded-full"
                                                src={novel.translatedBy?.avatar}
                                                alt={
                                                    novel.translatedBy?.username
                                                }
                                            />
                                            <span className="text-xs">
                                                {novel.translatedBy?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Start reading button */}
                                {novel.chapters?.metadata?.total > 0 && (
                                    <div className="flex items-end text-sm mb-2">
                                        <div
                                            onClick={() =>
                                                navigate(startReading)
                                            }
                                            className="bg-green-500 p-2 rounded-md cursor-pointer hover:bg-green-600"
                                        >
                                            Start Reading
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <h2 className="text-xl font-bold mb-2">
                                    Description
                                </h2>
                                <div className="text-sm text-left mb-8 ml-3">
                                    {parse(`${novel.description}`)}
                                </div>
                            </div>
                        </div>

                        {/* Chapter list and add chapter button */}
                        <div className="md:w-2/5 md:pl-3 pt-4 flex flex-col flex-wrap">
                            {/* Add chapter button */}
                            <PermissionProvider permission={["add_chapter"]}>
                                <div>
                                    <Button
                                        className="mx-auto bg-green-500 hover:bg-green-600 mb-2"
                                        onClick={() =>
                                            navigate(
                                                `/novel/${novel._id}/add-chapter`
                                            )
                                        }
                                    >
                                        Add a Chapter
                                    </Button>
                                </div>
                            </PermissionProvider>

                            {/* Chapter list */}
                            <div className="mb-4">
                                <h2 className="text-xl font-bold mb-2 ">
                                    Chapters
                                </h2>
                                {/* Pagination */}
                                {novel.chapters?.metadata?.total /
                                    chapterLimit >
                                    1 && (
                                    <div className="mb-2 flex flex-wrap">
                                        {[
                                            ...new Array(
                                                Math.ceil(
                                                    novel.chapters?.metadata
                                                        ?.total / chapterLimit
                                                )
                                            ),
                                        ].map((_, index) => (
                                            <button
                                                key={index}
                                                className={`mr-1 px-2 py-1 text-xs rounded-md border border-blue-400 ${
                                                    chapterPage === index + 1
                                                        ? "bg-gray-400 dark:bg-gray-700"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setChapterPage(index + 1)
                                                }
                                            >
                                                {index * chapterLimit +
                                                    1 +
                                                    "-" +
                                                    chapterLimit * (index + 1)}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <ul className="w-full min-h-[415px] shadow-inner shadow-sky-500 dark:shadow-black rounded-sm p-1 px-1 space-y-0.5">
                                    {novel.chapters?.data?.map(
                                        (chapter, index) => (
                                            <li
                                                key={index}
                                                className="py-1 px-2 bg-slate-500 bg-opacity-20 rounded-md"
                                            >
                                                <ChapterListItem
                                                    novel={novel}
                                                    chapter={chapter}
                                                    setNovel={setNovel}
                                                />
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {novel.glossaries !== "undefined" &&
                        novel.glossaries !== "" && (
                            <>
                                <br />
                                <div className="flex justify-between items-center">
                                    <h1 className="text-xl font-bold mb-2 ml-3">
                                        Glossaries
                                    </h1>
                                    {showGlossaries ? (
                                        <IoIosArrowDropdown
                                            size={25}
                                            className="text-blue-500 dark:text-blue-300 "
                                            onClick={() =>
                                                setShowGlossaries(false)
                                            }
                                        />
                                    ) : (
                                        <button className="rotate-90">
                                            <IoIosArrowDropdownCircle
                                                size={25}
                                                className="text-blue-500 dark:text-blue-300 "
                                                onClick={() =>
                                                    setShowGlossaries(true)
                                                }
                                            />
                                        </button>
                                    )}
                                </div>
                                <hr className="dark:border-white border-gray-700" />
                                <div className="text-sm text-left mb-2 ml-3">
                                    {showGlossaries && (
                                        <div>
                                            {novel.glossaries !== "undefined" &&
                                            novel.glossaries !== ""
                                                ? parse(`${novel.glossaries}`)
                                                : "No glossaries for this novel"}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    <br />
                    <h1 className="text-xl font-bold mb-2 ml-3">Comments</h1>
                    <hr />
                </div>
                <div className="pb-6 ">
                    <Comments commentFor={"novel"} id={novel._id} />
                </div>
            </>
        )
    );
}

const ChapterListItem = ({ novel, chapter, setNovel = () => {} }) => {
    const [chapterHover, setChapterHover] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            sequenceNumber: chapter?.sequenceNumber || "",
            title: chapter?.title || "",
            isPublished: chapter?.isPublished || false,
        },
    });

    const date = useRelativeTime();

    const onSubmit = async (data) => {
        setError(null);
        setIsLoading(true);
        try {
            if (chapter) {
                const dbpost = await apiService.updateChapterInfo(chapter._id, {
                    ...data,
                });

                if (dbpost) {
                    console.log(dbpost);

                    setNovel({
                        ...novel,
                        chapters: {
                            ...novel.chapters,
                            data: novel.chapters.data.map((chap) => {
                                if (chap._id === chapter._id) {
                                    return {
                                        ...dbpost,
                                    };
                                }
                                return chap;
                            }),
                        },
                    });
                }
            }
        } catch (error) {
            setError({
                status: error.response.status,
                message: error.response.statusText,
            });
        } finally {
            setShowConfirmation(true);
            setIsLoading(false);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        setIsEditing(false);
        setChapterHover(false);
    };

    return isEditing ? (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex items-center gap-2 text-sm "
            >
                <div className="w-16">
                    <Input
                        type="number"
                        placeholder="Sequence Number"
                        {...register("sequenceNumber", {
                            required: true,
                        })}
                    />
                </div>

                {/* Title */}
                <Input
                    type="text"
                    placeholder="Title"
                    {...register("title", {
                        required: true,
                    })}
                />

                <div className="">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            {...register("isPublished", {})}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                <button
                    disabled={isLoading}
                    className={`bg-green-600 hover:bg-green-700 py-1 px-2 text-sm rounded ${
                        isLoading ? "cursor-not-allowed" : ""
                    }`}
                    type="submit"
                >
                    {isLoading ? "Saving..." : "Update"}
                </button>
                <button
                    className="absolute -right-10 text-lg text-red-500 hover:text-red-600"
                    type="cancel"
                    onClick={() => {
                        setIsEditing(false);
                        setChapterHover(false);
                    }}
                >
                    <IoMdCloseCircle />
                </button>
            </form>

            {showConfirmation && (
                <div className="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white z-0 dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
                        {error ? (
                            <>
                                <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">
                                    Error {error.status}
                                </h3>
                                <p className="text-smtext-red-500 dark:text-red-300 mb-4">
                                    {error.message}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Error occurred. Please try again.
                                </p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                                    Chapter Updated
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Chapter updated successfully.
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
        </>
    ) : (
        <div
            className="relative flex items-center text-sm"
            onMouseEnter={() => setChapterHover(true)}
            onMouseLeave={() => setChapterHover(false)}
        >
            <PermissionProvider permission={["edit_chapter"]}>
                {chapterHover ? (
                    <button
                        className="text-2xl py-1 pr-1 md:text-xl hover:text-red-500 text-blue-500 flex items-center justify-center"
                        onClick={() => setIsEditing(true)}
                    >
                        <FaEdit />
                    </button>
                ) : (
                    <b className="text-xl md:text-lg shadow-lg text-gray-100 bg-slate-500 rounded px-1.5">
                        {chapter.sequenceNumber}
                    </b>
                )}
                &nbsp;
            </PermissionProvider>
            <Link
                to={`/novel/${novel._id}/chapter/${chapter.sequenceNumber}/${chapter._id}`}
                className={` hover:underline w-full flex gap-1 ${
                    novel.userHistory?.chapters.includes(chapter._id)
                        ? "text-gray-600 dark:text-gray-400"
                        : "text-gray-800 dark:text-gray-100"
                }`}
            >
                <div className="w-3/4 text-wrap p-text overflow-hidden text-ellipsis whitespace-nowrap">
                    {!chapter.isPublished && (
                        <b className="text-red-500">[PreRelease]&nbsp;</b>
                    )}
                    {chapter.title}
                </div>
                <div className="w-1/4 text-right text-gray-500 text-xs">
                    {date(chapter.updatedAt)}
                </div>
            </Link>
        </div>
    );
};

export default Novel;
