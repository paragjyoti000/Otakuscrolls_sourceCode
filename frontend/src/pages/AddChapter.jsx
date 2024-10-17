import { Suspense } from "react";
import { ChapterForm, Loading } from "../components";
import { useParams } from "react-router-dom";

function AddChapter() {
    const { novelId } = useParams();
    return (
        <div className="py-5">
            <Suspense
                fallback={
                    <div>
                        <Loading />
                    </div>
                }
            >
                <ChapterForm novelId={novelId} />
            </Suspense>
        </div>
    );
}

export default AddChapter;
