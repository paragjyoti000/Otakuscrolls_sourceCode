import { Suspense } from "react";
import { Loading, NovelForm } from "../components";

function AddNovel() {
    return (
        <div className="py-5">
            <Suspense
                fallback={
                    <div>
                        <Loading />
                    </div>
                }
            >
                <NovelForm />
            </Suspense>
        </div>
    );
}

export default AddNovel;
