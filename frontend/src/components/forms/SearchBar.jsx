import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loading } from "../";
import apiService from "../../api/service";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ linkTo = "", disabled = false }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [isExpanded, setIsExpanded] = useState(false);

    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        if (query && query.length > 0)
            apiService
                .searchNovels(query)
                .then((data) => {
                    if (!data) return;
                    setSearchResults(data);
                })
                .catch(() => {
                    setSearchResults([]);
                    setError("No results found");
                });
        else {
            setSearchResults([]);
            setError("");
        }
        setLoading(false);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setIsExpanded(true);
    };

    const handleClear = () => {
        setQuery("");
        setSearchResults([]);
        setIsExpanded(false);
        inputRef.current.focus();
    };

    return (
        <>
            <div className="relative w-full max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setIsExpanded(true)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                disabled
                                    ? setSearchParams({ q: query })
                                    : navigate(linkTo || `/search?q=${query}`);
                            }
                        }}
                        className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 transition-all duration-300 ease-in-out"
                        placeholder="Search..."
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiSearch className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    {query && (
                        <button
                            onClick={handleClear}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-150 ease-in-out"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {isExpanded && (
                    <div
                        ref={resultsRef}
                        className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800 transition-all duration-300 ease-in-out max-h-96 overflow-y-auto"
                    >
                        {loading ? (
                            <Loading />
                        ) : searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <Link
                                    to={`/novel/${result._id}`}
                                    key={result._id}
                                    onClick={() => {
                                        setIsExpanded(false);
                                        setQuery("");
                                    }}
                                >
                                    <div
                                        key={result.id}
                                        // onClick={() => handleResultClick(result)}
                                        className="flex cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out my-0.5"
                                    >
                                        <img
                                            src={result.coverImage}
                                            alt={result.title}
                                            className="w-16 aspect-[2/3] object-cover rounded-md mr-4"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                                                {result.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {result.author}
                                            </p>
                                            <span className="ml-auto text-sm font-medium text-gray-200 bg-blue-500 rounded-md px-2">
                                                {result.chapterCount || 0}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : error ? (
                            <p className="p-4 text-gray-600 dark:text-gray-400">
                                {error}
                            </p>
                        ) : (
                            setIsExpanded(false)
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchBar;
