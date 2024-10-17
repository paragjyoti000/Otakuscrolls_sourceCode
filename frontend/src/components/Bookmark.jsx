import { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import apiService from "../api/service";
import { useNavigate } from "react-router-dom";

function Bookmark({ novelId, authStatus = false }) {
    const navigate = useNavigate();
    const [bookmark, setBookmark] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (novelId) {
            apiService.isBookmarkedByUser(novelId).then((res) => {
                setBookmark(res.isBookmarked);
            });
        }
    }, [novelId]);

    const handleBookmarkClick = async () => {
        setBookmark(!bookmark);

        await apiService.addOrRemoveBookmark(novelId).catch((err) => {
            console.error(err);
        });
    };

    return (
        <div className="ml-2 mb-2 relative">
            {show && (
                <div
                    className="absolute top-0 left-9 w-full h-full bg-gray-900 bg-opacity-70 flex justify-center items-center"
                    onClick={() => setShow(!show)}
                >
                    <div className="bg-white rounded-lg p-4 text-center">
                        <p className="text-red-500">
                            You need to be logged in to add a bookmark
                        </p>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    </div>
                </div>
            )}
            {bookmark ? (
                <FaBookmark
                    size={25}
                    color="#FF0000"
                    onClick={() => handleBookmarkClick()}
                />
            ) : (
                <FaRegBookmark
                    size={27}
                    className="text-blue-400"
                    color=""
                    onClick={() =>
                        authStatus ? handleBookmarkClick() : setShow(!show)
                    }
                />
            )}
        </div>
    );
}

export default Bookmark;
