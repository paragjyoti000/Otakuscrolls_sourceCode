import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        //dark:bg-gray-900 text-gray-900
        <div className={`flex justify-center items-center h-screen`}>
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                    404 - Page Not Found
                </h1>
                <p className="text-lg mb-8">
                    The page you are looking for does not exist.
                </p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    <Link to="/">Go Home</Link>
                </button>
            </div>
        </div>
    );
};

export default PageNotFound;
