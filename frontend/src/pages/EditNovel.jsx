import { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Loading, NovelForm } from "../components";
import { useNavigate } from "react-router-dom";
import apiService from "../api/service";

function EditNovel() {
    const [novel, setNovel] = useState(null);

    const { novelId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (novelId) {
            apiService.getNovel(novelId).then((data) => {
                if (data) {
                    setNovel(data);
                }
            });
        } else {
            navigate("/");
        }
    }, [novelId, navigate]);

    return novel ? (
        <>
            <div className="py-5">
                <Suspense fallback={<Loading />}>
                    <NovelForm novel={novel} />
                </Suspense>
            </div>
        </>
    ) : null;
}

export default EditNovel;
