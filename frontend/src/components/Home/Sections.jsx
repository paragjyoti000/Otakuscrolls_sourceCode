import React, { Suspense } from "react";
import { Loading, NovelCard } from "..";

function Sections({ title, children }) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-2 mx-5 pb-2 border-b-2 border-gray-500">
                {title}
            </h1>

            <div className="mb-4 px-3 md:px-0 items-center md:mx-5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-2 md:gap-5">
                {children}
            </div>
        </div>
    );
}

export default Sections;
