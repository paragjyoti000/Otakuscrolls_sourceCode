import { useState, useEffect, Suspense } from "react";
import { useQueries } from "react-query";
import {
    Loading,
    Trendings,
    Carousel,
    NovelCard,
    Sections,
    Message,
    PermissionProvider,
    NovelCardSkeleton,
} from "../components";
import apiService from "../api/service";
import { FaPatreon } from "react-icons/fa6";
import { ErrorBoundary } from "react-error-boundary";
import fallbackRender from "../components/ErrorBoundary";
import { useNavigate } from "react-router-dom";
import { useRelativeTime } from "../hooks";

function Home() {
    const navigate = useNavigate();
    const date = useRelativeTime();

    const fetchLatestChapters = async () => {
        return await apiService.getNewRelease().catch(() => {
            return [];
        });
    };

    const fetchNewNovels = async () => {
        return await apiService.getNewNovels().catch(() => {
            return [];
        });
    };

    const fetchCompletedNovels = async () => {
        return await apiService.getCompletedNovels().catch(() => {
            return [];
        });
    };

    const [
        {
            data: newReleaseChapters,
            isLoading: latestChapterLoading,
            isSuccess: latestChapterSuccess,
        },
        {
            data: newNovels,
            isLoading: newNovelsLoading,
            isSuccess: newNovelsSuccess,
        },
        {
            data: completedNovels,
            isLoading: completedNovelsLoading,
            isSuccess: completedNovelsSuccess,
        },
    ] = useQueries([
        {
            queryKey: "newReleaseChapters",
            queryFn: fetchLatestChapters,
        },
        {
            queryKey: "newNovels",
            queryFn: fetchNewNovels,
        },
        {
            queryKey: "completedNovels",
            queryFn: fetchCompletedNovels,
        },
    ]);

    return (
        <>
            <div className="">
                <div className="max-w-full h-full">
                    <ErrorBoundary fallbackRender={fallbackRender}>
                        <Suspense
                            fallback={
                                <div className="max-w-full h-48 sm:h-80 flex justify-center items-center bg-black">
                                    <Loading />
                                </div>
                            }
                        >
                            <Carousel />
                        </Suspense>
                    </ErrorBoundary>
                </div>

                {/* Trendings, New Release, self-promotion */}
                <div className="container mx-auto p-2 md:p-8 flex flex-col md:flex-row justify-between gap-5">
                    {/* Trendings, New Release */}
                    <div className="md:w-3/4 lg:w-2/3">
                        {/* Trendings */}
                        <Suspense fallback={<Loading />}>
                            <Trendings />
                        </Suspense>

                        {/* New Release chapters */}
                        <div className="mt-4">
                            <h1 className="text-2xl font-bold mb-2 mx-1 pb-2 border-b-2 border-gray-500">
                                New Chapter Release
                            </h1>
                            <div className="mx-1">
                                {latestChapterLoading
                                    ? new Array(10).fill(
                                          <div className="w-full flex border-2 border-gray-500 gap-1 text-xs md:text-sm lg:text-base text-gray-800 dark:text-gray-200">
                                              <p className="w-4/12 md:w-5/12 py-0.5 border-r-2 border-gray-500 px-2">
                                                  <div className="w-[80%] h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                              </p>

                                              <p className="w-1/12 border-r-2 py-0.5 border-gray-500 px-2">
                                                  <div className="w-[60%] h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                              </p>

                                              <p className="w-4/12 border-r-2 py-0.5 border-gray-500 px-2">
                                                  <div className="w-[60%] h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                              </p>

                                              <p className="w-2/12 px-1 py-0.5 text-gray-700 dark:text-gray-400">
                                                  <div className="w-[80%] h-4 bg-gray-300 dark:bg-gray-500 rounded animate-pulse" />
                                              </p>
                                          </div>
                                      )
                                    : newReleaseChapters.map((chapter) => (
                                          <div
                                              key={chapter._id}
                                              onClick={() =>
                                                  navigate(
                                                      `/novel/${chapter.novelId}/chapter/${chapter.sequenceNumber}/${chapter._id}`
                                                  )
                                              }
                                              className="cursor-pointer w-full flex border-2 border-gray-500 gap-1 text-xs md:text-sm lg:text-base text-gray-800 dark:text-gray-200"
                                          >
                                              <p className="w-4/12 md:w-5/12 border-r-2 border-gray-500 px-2">
                                                  {chapter.title}
                                              </p>

                                              <p className="w-1/12 border-r-2 border-gray-500 px-2">
                                                  {chapter.sequenceNumber}
                                              </p>

                                              <p className="w-4/12 border-r-2 border-gray-500 px-2">
                                                  {chapter.chapterTitle}
                                              </p>

                                              <p className="w-2/12 px-1 text-gray-700 dark:text-gray-400">
                                                  {date(chapter.updatedAt)}
                                              </p>
                                          </div>
                                      ))}
                            </div>
                        </div>
                    </div>

                    {/* Patrons and self-promotion */}
                    <div className=" flex flex-col justify-start items-center gap-5">
                        <Suspense fallback={<Loading />}>
                            <Message />
                        </Suspense>

                        <PermissionProvider
                            permission={["view_unpublished_chapter"]}
                        >
                            <div className="text-center text-wrap w-[300px] bg-slate-500 bg-opacity-25 rounded px-6 py-3 ">
                                <p className="text-center animate-pulse">
                                    👌Pre-Release Chapters from the Novels are
                                    now viewable to You as well.🪇
                                </p>
                            </div>
                        </PermissionProvider>

                        <div className="flex flex-col items-center gap-1 bg-slate-500 bg-opacity-25 rounded px-6 py-3 ">
                            <p className="text-center">
                                Join our patreon to get early access
                                <br />
                                to our new released chapters.
                            </p>
                            <button className="animate-pulse">
                                <a
                                    href="https://www.patreon.com/bePatron?u=124464587"
                                    data-patreon-widget-type="become-patron-button"
                                    className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg text-white"
                                >
                                    <FaPatreon /> Become a member!
                                </a>
                            </button>
                        </div>

                        {/* <iframe
                            src="https://discord.com/widget?id=1208018768610197525&theme=dark"
                            className="hidden md:block md:w-[260px] md:h-[340px] lg:w-[290px] lg:h-[370px]"
                            allowTransparency={true}
                            frameBorder="0"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        ></iframe> */}

                        <div className="w-[300px] p-5 bg-blue-600 rounded-md animate-bounce m-3">
                            <a
                                href="https://discord.com/invite/v2cQhmJxKt?utm_source=Discord%20Widget&utm_medium=Connect"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-between items-center gap-4"
                            >
                                <img
                                    width="124"
                                    height="Auto"
                                    alt="Click for home"
                                    src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6257d23c5fb25be7e0b6e220_Open%20Source%20Projects%20_%20Discord-7.svg"
                                    loading="lazy"
                                    className="w-[124px] h-[34px]"
                                />
                                <span className="text-sm text-right">
                                    Join our
                                    <br />
                                    Discord
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                <Sections title={"Recently Added"}>
                    {newNovelsLoading
                        ? new Array(7).fill(<NovelCardSkeleton />)
                        : newNovels.map((novel) => (
                              <div key={novel._id}>
                                  <Suspense fallback={<Loading />}>
                                      <NovelCard {...novel} />
                                  </Suspense>
                              </div>
                          ))}
                </Sections>

                <Sections title={"Completed"}>
                    {completedNovelsLoading
                        ? new Array(7).fill(<NovelCardSkeleton />)
                        : completedNovels.map((novel) => (
                              <div key={novel._id}>
                                  <Suspense fallback={<Loading />}>
                                      <NovelCard {...novel} />
                                  </Suspense>
                              </div>
                          ))}
                </Sections>
            </div>
        </>
    );
}

export default Home;
