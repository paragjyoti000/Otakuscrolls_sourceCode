import { useState, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChapterForm, Loading } from "../components";
import apiService from "../api/service";

export default function EditChapter() {
    const [chapter, setChapter] = useState(null);
    const { chapterId } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (chapterId) {
            apiService.getChapter(chapterId).then((data) => {
                if (data) {
                    setChapter(data);
                }
            });
        } else {
            navigate("/");
        }
    }, [chapterId, navigate]);
    return chapter ? (
        <div className="py-5">
            <Suspense
                fallback={
                    <div>
                        <Loading />
                    </div>
                }
            >
                <ChapterForm chapter={chapter} />
            </Suspense>
        </div>
    ) : null;
}
