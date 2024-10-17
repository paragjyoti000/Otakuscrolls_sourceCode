import apiService from "../api/service";
import { Loading, NovelCard } from "../components";
import { FaTrash } from "react-icons/fa";
import { useQueries } from "react-query";

function BookmarkPage() {
    const [{ data: bookmark, isLoading, refetch }] = useQueries([
        {
            queryKey: "history",
            queryFn: async () =>
                await apiService.getBookmarks().catch(() => {
                    return [];
                }),
        },
    ]);

    const deleteBookmark = (id) => {
        apiService
            .deleteBookmark(id)
            .then(() => {
                refetch();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    My Novel Bookmarks
                </h1>
                {isLoading ? (
                    <Loading />
                ) : bookmark.length > 0 ? (
                    <div className="mx-2 mb-4 md:mx-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
                        {bookmark.map((el) => (
                            <div key={el._id} className="relative">
                                <NovelCard {...el.novel} />

                                <div
                                    className="absolute -top-2 -right-4 text-2xl text-red-500 cursor-pointer hover:scale-110 delay-100 duration-150"
                                    onClick={() => deleteBookmark(el._id)}
                                >
                                    {/* <RxCrossCircled /> */}
                                    <FaTrash />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            You have No Novel Bookmarked
                        </div>
                        <div className="text-center text-2xl">
                            Bookmark A Novel Now
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default BookmarkPage;
