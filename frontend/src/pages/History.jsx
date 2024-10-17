import apiService from "../api/service";
import { Loading, NovelCard } from "../components";
import { FaTrash } from "react-icons/fa";
import { useQueries } from "react-query";

function History() {
    const [{ data: history, isLoading, refetch }] = useQueries([
        {
            queryKey: "history",
            queryFn: async () =>
                await apiService.getReadHistory().catch(() => {
                    return [];
                }),
        },
    ]);

    const deleteHistory = (id) => {
        apiService
            .deleteSingleHistory(id)
            .then((data) => {
                if (data) refetch();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    My Reading History
                </h1>

                {isLoading ? (
                    <Loading />
                ) : history.length > 0 ? (
                    <div className="mx-2 mb-4 md:mx-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
                        {history.map((el) => (
                            <div key={el._id} className="relative">
                                <NovelCard
                                    {...el.novel}
                                    readCount={el.chapters.length}
                                    link={`/novel/${el.novel._id}/chapter/${
                                        el.chapters[el.chapters?.length - 1]
                                            .sequenceNumber
                                    }/${
                                        el.chapters[el.chapters?.length - 1]._id
                                    }`}
                                />

                                <div
                                    className="absolute -top-2 -right-4 text-2xl text-red-500 cursor-pointer hover:scale-110 delay-100 duration-150"
                                    onClick={() => deleteHistory(el._id)}
                                >
                                    <FaTrash />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="text-center">
                            You have No Reading History
                        </div>
                        <div className="text-center text-2xl">
                            Start Reading Now
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default History;
