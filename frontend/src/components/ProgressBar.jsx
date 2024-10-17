import React from "react";

function ProgressBar({ totalChapters = 100, completedChapters = 0 }) {
    return (
        <>
            <div className="w-full flex justify-between items-center gap-1 pr-1">
                <div className="flex justify-between items-center">
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {completedChapters}
                    </div>
                    /
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {totalChapters}
                    </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="w-0 bg-blue-600 h-2"
                        style={{
                            width: `${Math.floor(
                                (completedChapters / totalChapters) * 100
                            )}%`,
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
}

export default ProgressBar;
