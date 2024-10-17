import { useState, useEffect } from "react";
import { NovelCard, PermissionProvider } from "../components";
import { Link, useSearchParams } from "react-router-dom";
import { Button, SearchBar } from "../components";
import apiService from "../api/service";

function AllNovel() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const [novels, setNovels] = useState([]);
    const [result, setResult] = useState([]);
    const [myNovels, setMyNovels] = useState([]);

    useEffect(() => {
        apiService.getNovelsByUser().then((data) => {
            if (data) setMyNovels(data);
        });

        if (query)
            apiService.searchNovels(query).then((data) => {
                if (!data) return;
                setResult(data);
            });

        apiService.getDraftNovels().then((data) => {
            if (data) {
                setNovels(data);
            }
        });
    }, [query]);

    return (
        <PermissionProvider
            permission={[
                "add_novel",
                "update_novel",
                "delete_novel",
                "add_chapter",
                "edit_chapter",
                "delete_chapter",
                "publish_novel",
            ]}
            autoRedirect
        >
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    All Draft Novels
                </h1>
                <div className="flex space-x-4">
                    <div>
                        <Link to={"/add-novel"}>
                            <Button className="mb-4 bg-green-600">
                                Add a Novel
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <SearchBar disabled />
                    </div>
                </div>

                {result.length > 0 ? (
                    <>
                        <h2 className="text-xl font-bold mb-3">
                            Search Results
                        </h2>
                        <div className="mx-2 mb-4 md:mx-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                            {result.map((novel) => (
                                <div key={novel._id}>
                                    <Link
                                        to={`/novel/${novel._id}`}
                                        className="hover:bg-slate-300 dark:hover:bg-slate-500 w-full"
                                    >
                                        <div className="flex w-full p-1">
                                            <div className="w-1/5 overflow-hidden">
                                                <img
                                                    src={novel.coverImage}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="px-2 py-1 text-left text-xs font-light">
                                                <h1 className="text-sm font-normal">
                                                    {novel.title}
                                                </h1>
                                                <p>{novel.author}</p>
                                                <p>
                                                    Chapters:{" "}
                                                    {novel.chapterCount || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    query && (
                        <h2 className="text-xl font-bold mb-3">
                            No search results with {`"${query}"`}
                        </h2>
                    )
                )}

                <h2 className="text-2xl font-bold mb-3">My Works</h2>
                {myNovels.length > 0 ? (
                    <div className="mx-2 mb-4 md:mx-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
                        {myNovels.map((novel) => (
                            <div key={novel._id}>
                                <NovelCard {...novel} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-lg py-5">
                        No novels found
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-3">All Novels</h2>
                {novels.length > 0 ? (
                    <div className="mx-2 mb-4 md:mx-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
                        {novels.map((novel) => (
                            <div key={novel._id}>
                                <NovelCard {...novel} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-lg py-5">
                        There are no Unpublished Novels
                    </div>
                )}
            </div>
        </PermissionProvider>
    );
}

export default AllNovel;
