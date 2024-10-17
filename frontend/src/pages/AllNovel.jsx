import { useState, useEffect, Suspense } from "react";
import { Loading, NovelCard } from "../components";
import { useSearchParams } from "react-router-dom";
import apiService from "../api/service";

function AllNovel() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const [novels, setNovels] = useState([]);

    useEffect(() => {
        apiService.searchNovels(query).then((data) => {
            if (data) {
                setNovels(data);
            }
        });
    }, [query]);

    return (
        <>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    All Novels that matches {`"${query}"`}
                </h1>
                {novels.length > 0 ? (
                    <div className="mx-2 mb-4 md:mx-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
                        {novels.map((novel) => (
                            <div key={novel._id}>
                                <Suspense fallback={<Loading />}>
                                    <NovelCard {...novel} />
                                </Suspense>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center font-semibold">
                        No novels found for {`"${query}"`}
                    </div>
                )}
            </div>
        </>
    );
}

export default AllNovel;
