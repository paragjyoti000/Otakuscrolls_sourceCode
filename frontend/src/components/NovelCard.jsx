import { Link } from "react-router-dom";
import BlurImage from "./BlurImage";
import { FaRegStar, FaStar } from "react-icons/fa6";

function NovelCard({
    _id,
    title,
    avgRatings,
    coverImage,
    uploadedBy,
    chaptersCount,
    createdAt,
    readCount = null,
    link = null,
}) {
    return (
        <>
            <Link to={link || `/novel/${_id}`}>
                <div className="relative w-full aspect-[2/3] md:w-[128px] md:h-[192px] lg:w-[160px] lg:h-[240px] ">
                    <div className="group book absolute inset-0 ">
                        <div className=" book-shine relative w-full aspect-[2/3] md:w-[128px] md:h-[192px] lg:w-[160px] lg:h-[240px] object-center overflow-hidden rounded-md md:rounded-none shadow-lg">
                            <BlurImage
                                img={
                                    <img
                                        className={`w-full aspect-[2/3] md:w-[128px] md:h-[192px] lg:w-[160px] lg:h-[240px] object-center`}
                                        src={coverImage}
                                        alt={title}
                                        loading="lazy"
                                    />
                                }
                            />
                            {new Date() - new Date(createdAt) <
                                30 * 24 * 60 * 60 * 1000 && (
                                <div className="absolute z-50 top-1 left-0 bg-orange-500 text-xs px-2 pb-0.5 -skew-x-12 -translate-x-1">
                                    <p className="skew-x-12">New</p>
                                </div>
                            )}

                            <div
                                className={`bottom-0 delay-100 duration-150 pt-2 px-2 w-full absolute z-40 left-0 bg-gradient-to-t from-black via-black to-[rgba(0,0,0,0.2)] text-left text-gray-300`}
                            >
                                <div className="font-medium text-sm uppercase p-text">
                                    {title}
                                </div>
                                <div className="text-xs mb-2 flex justify-between">
                                    <div className="flex justify-between items-center text-[10px] px-0.5 rounded-sm bg-blue-600">
                                        {avgRatings && avgRatings !== 0 ? (
                                            <>
                                                <div className="font-bold">
                                                    {avgRatings
                                                        ?.toFixed(1)
                                                        .replace(/\.0$/, "")}
                                                </div>
                                                &nbsp;
                                                <FaStar color="#FFD700" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="font-bold">
                                                    0
                                                </div>{" "}
                                                &nbsp;
                                                <FaRegStar color="#FFD700" />
                                            </>
                                        )}
                                    </div>
                                    <p className="text-[10px] px-0.5 rounded-sm bg-blue-600">
                                        {readCount
                                            ? readCount + "/" + chaptersCount
                                            : chaptersCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default NovelCard;
