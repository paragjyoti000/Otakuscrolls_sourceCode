import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateStoreUserPrefs } from "../store/authSlice";
import {
    Button,
    Comments,
    Loading,
    PageDesignOne,
    PageDesignTwo,
    PermissionProvider,
} from "../components";
import parse from "html-react-parser";
import { useRelativeTime } from "../hooks";
import apiService from "../api/service";
import authService from "../api/auth";
import conf from "../envConf/conf";
import MySelect from "../components/MySelect";
import { useQueries } from "react-query";

function Chapter() {
    const dispatch = useDispatch();

    const getAllChapters = async () => {
        return await apiService.getChaptersByNovel(novelId).catch((err) => {
            console.error(err);
        });
    };

    const [{ data: allChapters, isLoading: loading }] = useQueries([
        {
            queryKey: "allChapters",
            queryFn: getAllChapters,
        },
    ]);

    const [chapter, setChapter] = useState([]);
    const [index, setIndex] = useState(0);
    const [showPreferences, setShowPreferences] = useState(false);

    const [isUnpublishedChapterVissible, setIsUnpublishedChapterVissible] =
        useState(false);

    const { chapterId, sqNo, novelId } = useParams();
    const navigate = useNavigate();

    const authStatus = useSelector((state) => state.auth.status);
    const userPrefs = useSelector((state) => state.auth.userPrefs);

    const [prefs, setPrefs] = useState(
        userPrefs?.chapter || {
            textSize: "text-base",
            bgColor: "bg-inherit",
            fontFamily: "font-sans",
        }
    );

    const updateUserPrefs = useCallback(async () => {
        if (authStatus) {
            await authService.updateChapterUserPrefs(prefs).then((data) => {
                if (data) {
                    dispatch(updateStoreUserPrefs(data));
                }
            });
        }
    }, [prefs, authStatus, dispatch]);

    useEffect(() => {
        updateUserPrefs();
    }, [updateUserPrefs]);

    let novelList = [];

    if (allChapters && allChapters.length) {
        novelList = allChapters.map((chapter) => ({
            value: `/novel/${novelId}/chapter/${chapter.sequenceNumber}/${chapter._id}`,
            label: `CH${chapter.sequenceNumber} ${chapter.title}`,
            sequenceNumber: chapter.sequenceNumber,
        }));
    }

    useEffect(() => {
        if (allChapters && allChapters.length && chapterId) {
            setIndex(allChapters.findIndex((item) => item._id === chapterId));
            setChapter(allChapters.find((item) => item._id === chapterId));
        }

        if (!allChapters || (!allChapters.length && chapterId)) {
            apiService.getChapter(chapterId).then((data) => {
                if (data) {
                    setChapter(data);
                }
            });
        }
    }, [chapterId, navigate, allChapters]);

    useEffect(() => {
        const READ_THRESHOLD = 10000; // Time in milliseconds to consider page read (10 seconds)
        let hasRead = false;
        let readTimer;

        function markPageAsRead() {
            if (
                authStatus &&
                (chapter.isPublished || isUnpublishedChapterVissible)
            ) {
                if (!hasRead) {
                    hasRead = true;
                    apiService.addHistory(novelId, chapterId).catch((err) => {
                        console.error(err);
                    });
                }
            }
        }

        readTimer = setTimeout(markPageAsRead, READ_THRESHOLD);

        // Reset timer if user scrolls or clicks
        window.addEventListener("scroll", () => {
            clearTimeout(readTimer);
            readTimer = setTimeout(markPageAsRead, READ_THRESHOLD);
        });

        window.addEventListener("click", () => {
            clearTimeout(readTimer);
            readTimer = setTimeout(markPageAsRead, READ_THRESHOLD);
        });

        // Clean up when component unmounts
        return () => {
            clearTimeout(readTimer);
        };
    }, [
        authStatus,
        chapterId,
        novelId,
        isUnpublishedChapterVissible,
        chapter.isPublished,
    ]);

    const date = useRelativeTime();

    const deleteChapter = () => {
        if (window.confirm("Are you sure you want to delete this chapter?"))
            apiService.deleteChapter(chapter._id).then((status) => {
                if (status) {
                    navigate(`/novel/${novelId}`);
                }
            });
    };

    return loading ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <Loading />
        </div>
    ) : (
        <div className="relative">
            <div
                className={`absolute left-0 top-0 w-full h-screen ${
                    showPreferences ? "block" : "hidden"
                }`}
                onClick={() => showPreferences && setShowPreferences(false)}
            />
            <div className="container mx-auto xl:mt-5 w-full ">
                <div
                    id="chapterTop"
                    className={`text-left p-5 rounded-md ${prefs.bgColor}`}
                >
                    {/* Navigate Back to Novel */}
                    <div className="space-x-2 mb-4 ">
                        <span
                            onClick={() => navigate(`/novel/${novelId}`)}
                            className="cursor-pointer pl-2"
                        >
                            <span className="mr-2">◀️</span>

                            <span className="font-bold hover:underline">
                                {chapter.novel?.title}
                            </span>
                        </span>
                        <span className="font-bold">-</span>
                        <span>Chapter {`${sqNo}`}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        {/* Chapter Header */}
                        <div>
                            {/* Chapter Title */}
                            <h1 className="font-bold ">
                                Title: {chapter.title}
                            </h1>

                            {/* Uploaded at */}
                            <p className="text-sm mb-1 text-gray-500">
                                {date(chapter?.createdAt)}
                            </p>
                        </div>

                        {/* User Preferences */}
                        <div
                            className={`relative w-52 flex justify-between items-end ease-in-out duration-300 delay-75 text-gray-200 ${
                                showPreferences
                                    ? "border-gray-600 border-b-2"
                                    : ""
                            }`}
                        >
                            <div>
                                {showPreferences && (
                                    <button
                                        className="bg-blue-500 text-sm p-1 rounded-t-md"
                                        onClick={() =>
                                            setPrefs({
                                                textSize: "text-base",
                                                bgColor: "bg-inherit",
                                                fontFamily: "font-sans",
                                            })
                                        }
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            <button
                                className={`text-sm ease-in-out duration-300 py-1 px-2  ${
                                    showPreferences
                                        ? "bg-gray-600 rounded-t-md"
                                        : "bg-blue-900 rounded-md"
                                }`}
                                onClick={() =>
                                    setShowPreferences(!showPreferences)
                                }
                            >
                                Preferances{" "}
                                {showPreferences ? (
                                    <span className="ml-1">▲</span>
                                ) : (
                                    <span className="ml-1">▼</span>
                                )}
                            </button>
                            <div
                                className={`absolute top-8 right-0 overflow-hidden bg-[rgba(154,226,255,0.8)] dark:bg-[rgba(34,33,33,0.8)] backdrop-blur-lg ${
                                    showPreferences
                                        ? "h-64 w-52 border"
                                        : "h-0 w-0"
                                } delay-150 duration-150 ease-in-out`}
                            >
                                <div className="text-gray-300 text-sm w-full h-full p-4">
                                    <div className="">
                                        <MySelect
                                            label="Text Size"
                                            options={conf.textSizeOptions}
                                            value={prefs.textSize}
                                            onChange={(e) => {
                                                setPrefs({
                                                    ...prefs,
                                                    textSize: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="">
                                        <MySelect
                                            label="Background Color"
                                            options={
                                                conf.backgroundColorOptions
                                            }
                                            value={prefs.bgColor}
                                            onChange={(e) => {
                                                setPrefs({
                                                    ...prefs,
                                                    bgColor: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="">
                                        <MySelect
                                            label="Font Family"
                                            options={conf.fontFamilyOptions}
                                            value={prefs.fontFamily}
                                            className={`${prefs.fontFamily}`}
                                            onChange={(e) => {
                                                setPrefs({
                                                    ...prefs,
                                                    fontFamily: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="mb-3 " />

                    {/* Edit and Delete Chapter Button */}

                    <div className="mb-2 space-x-2">
                        <PermissionProvider permission={["edit_chapter"]}>
                            <Link
                                to={`/novel/${novelId}/edit-chapter/${sqNo}/${chapter._id}`}
                            >
                                <Button className="bg-green-500">Edit</Button>
                            </Link>
                        </PermissionProvider>
                        <PermissionProvider permission={["delete_chapter"]}>
                            <Button
                                onClick={deleteChapter}
                                className="bg-red-500"
                            >
                                Delete
                            </Button>
                        </PermissionProvider>
                    </div>

                    {/* Chapter Content and Previous and Next Chapter */}
                    <div className="mt-3 flex flex-col items-center space-y-2">
                        {/* Previous and Next Chapter */}
                        <div className="flex space-x-1">
                            {/* Previous Chapter */}
                            <Button
                                className={`bg-green-500 ${
                                    index > 0
                                        ? ""
                                        : "cursor-not-allowed opacity-20"
                                }`}
                                onClick={() =>
                                    index > 0 &&
                                    navigate(
                                        `/novel/${novelId}/chapter/${
                                            allChapters[index - 1]
                                                .sequenceNumber
                                        }/${allChapters[index - 1]._id}`
                                    )
                                }
                            >
                                Prev Chapter
                            </Button>

                            {/* Select Chapter Dropdown */}
                            <div>
                                <select
                                    value={`/novel/${novelId}/chapter/${chapter.sequenceNumber}/${chapter._id}`}
                                    onChange={(e) => {
                                        navigate(e.target.value);
                                    }}
                                    className=" w-full p-2 border-none bg-white dark:bg-green-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {novelList.map((chapter, index) => (
                                        <option
                                            key={index}
                                            value={chapter.value}
                                            className="bg-slate-500 dark:bg-slate-800 "
                                        >
                                            {chapter.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Next Chapter */}
                            <Button
                                className={`bg-green-500 ${
                                    index < allChapters.length - 1
                                        ? ""
                                        : "cursor-not-allowed opacity-20"
                                }`}
                                onClick={() =>
                                    index < allChapters.length - 1 &&
                                    navigate(
                                        `/novel/${novelId}/chapter/${
                                            allChapters[index + 1]
                                                .sequenceNumber
                                        }/${allChapters[index + 1]._id}`
                                    )
                                }
                            >
                                Next Chapter
                            </Button>
                        </div>

                        <div>
                            <PageDesignOne />
                            <hr className="dark:border-white border-gray-700" />
                        </div>

                        {/* Chapter Content */}
                        <div className="w-full text-left my-2">
                            {/* Render chapter content */}
                            {!chapter.isPublished &&
                            !isUnpublishedChapterVissible ? (
                                <div className="flex flex-col items-center">
                                    <PermissionProvider
                                        permission={[
                                            "view_unpublished_chapter",
                                        ]}
                                    >
                                        <button
                                            className={`bg-red-500 hover:bg-red-600 text-white font-bold mb-4 py-2 px-4 rounded my-2`}
                                            onClick={() =>
                                                setIsUnpublishedChapterVissible(
                                                    !isUnpublishedChapterVissible
                                                )
                                            }
                                        >
                                            Take a Peek at Pre-Release Chapter
                                        </button>
                                    </PermissionProvider>
                                    <div className="text-center">
                                        <b>COMING SOON</b>
                                        <p>Chapter is not Released Yet</p>
                                        <p>To Early Access This Chapter</p>
                                        <a
                                            href="https://patreon.com/OtakuScrolls"
                                            className="font-bold text-blue-400 hover:text-blue-500 hover:underline hover:uppercase"
                                        >
                                            Please Join our Patreon
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`chapter-content md:px-6 lg:px-14 ${prefs.textSize} ${prefs.fontFamily} `}
                                >
                                    {parse(`${chapter.content}`)}
                                </div>
                            )}
                        </div>

                        <div>
                            <hr className="dark:border-white border-gray-700" />
                            <PageDesignTwo />
                        </div>

                        {/* Previous and Next Chapter */}
                        <div className="flex space-x-1">
                            {/* Previous Chapter */}
                            <Button
                                className={`bg-green-500 ${
                                    index > 0
                                        ? ""
                                        : "cursor-not-allowed opacity-20"
                                }`}
                                onClick={() => {
                                    index > 0 &&
                                        navigate(
                                            `/novel/${novelId}/chapter/${
                                                allChapters[index - 1]
                                                    .sequenceNumber
                                            }/${allChapters[index - 1]._id}`
                                        );

                                    document.body.scrollTop = 0;
                                    document.documentElement.scrollTop = 0;
                                }}
                            >
                                Prev Chapter
                            </Button>

                            {/* Select Chapter Dropdown */}
                            <div>
                                <select
                                    value={`/novel/${novelId}/chapter/${chapter.sequenceNumber}/${chapter._id}`}
                                    onChange={(e) => {
                                        navigate(e.target.value);
                                    }}
                                    className=" w-full p-2 border-none bg-white dark:bg-green-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    {novelList.map((chapter, index) => (
                                        <option
                                            key={index}
                                            value={chapter.value}
                                            className="bg-slate-500 dark:bg-slate-800"
                                        >
                                            {chapter.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Next Chapter */}
                            <Button
                                className={`bg-green-500 ${
                                    index < allChapters.length - 1
                                        ? ""
                                        : "cursor-not-allowed opacity-20"
                                }`}
                                onClick={() => {
                                    index < allChapters.length - 1 &&
                                        navigate(
                                            `/novel/${novelId}/chapter/${
                                                allChapters[index + 1]
                                                    .sequenceNumber
                                            }/${allChapters[index + 1]._id}`
                                        );
                                    document.body.scrollTop = 0;
                                    document.documentElement.scrollTop = 0;
                                }}
                            >
                                Next Chapter
                            </Button>
                        </div>
                    </div>
                </div>
                <br />
                <h1 className="text-xl font-bold mb-2 ml-3">Comments</h1>
                <hr />
            </div>
            <div className="pb-6 ">
                <Comments commentFor={"chapter"} id={chapter._id} />
            </div>
        </div>
    );
}

export default Chapter;
