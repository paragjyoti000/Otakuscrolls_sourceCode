import BlurImage from "./BlurImage";
import { FaRegStar, FaStar } from "react-icons/fa6";

function NovelCardSkeleton() {
    return (
        <>
            <div className="relative w-full aspect-[2/3] md:w-[128px] md:h-[192px] lg:w-[160px] lg:h-[240px] animate-pulse">
                <div className="group book absolute inset-0 ">
                    <div className=" book-shine relative w-full aspect-[2/3] md:w-[128px] md:h-[192px] lg:w-[160px] lg:h-[240px] object-center overflow-hidden rounded-md md:rounded-none shadow-lg">
                        <div
                            //image
                            className="w-full aspect-[2/3] md:w-[128px] md:h-[192px] lg:w-[160px] lg:h-[240px] object-center bg-gray-300 dark:bg-gray-500 rounded-md lg:rounded-none drop-shadow-2xl shadow-xl shadow-indigo-500/40 group-hover:shadow-indigo-500 duration-300 transition-shadow ease-in-out"
                        >
                            <p className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                Loading...
                            </p>
                        </div>

                        <div
                            className={`bottom-0 delay-100 duration-150 pt-2 px-2 w-full absolute z-40 left-0 bg-gradient-to-t from-black via-black to-[rgba(0,0,0,0.2)] text-left text-gray-300`}
                        >
                            <div className="font-medium text-sm uppercase p-text">
                                <div className="w-full h-3 bg-gray-300 dark:bg-gray-500 rounded " />
                            </div>
                            <div className="text-xs my-2 flex justify-between">
                                <div className="w-4 h-5 bg-gray-300 dark:bg-gray-500 rounded " />
                                <div className="w-4 h-5 bg-gray-300 dark:bg-gray-500 rounded " />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NovelCardSkeleton;
