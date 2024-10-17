import { useState, useEffect, Suspense } from "react";
import {
    Button,
    Loading,
    Logo,
    SearchBar,
    SideMenu,
    Sidebar,
    Toggle,
} from "../index";
import { useSelector, useDispatch } from "react-redux";
import { setScreenWidth } from "../../store/widthSlice";
import profilePlaceholder from "../../assets/profilePlaceholder.png";

function Header({ className }) {
    const dispatch = useDispatch();
    const isMobileView = useSelector((state) => state.width.isMobile);
    const authStatus = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.user);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = (e) => {
        setIsMenuOpen(e === false ? false : !isMenuOpen);
    };

    const [isOpenSidebar, setIsOpenSidebar] = useState(false);

    const toggleSidebar = () => {
        setIsOpenSidebar(!isOpenSidebar);
    };

    const [isOpenSearchbar, setIsOpenSearchbar] = useState(false);

    const toggleSearchbar = (e) => {
        setIsOpenSearchbar(e === false ? false : !isOpenSearchbar);
    };

    return (
        <>
            <header
                className={`${className} top-0 z-30 w-full pr-2 flex justify-between items-center px-3 py-2 bg-white text-gray-900 dark:bg-gray-900 dark:text-white shadow-lg opacity-95`}
            >
                <div
                    className={`fixed inset-0 bg-black dark:opacity-35 opacity-50 z-30 transition ${
                        isMenuOpen || isOpenSearchbar ? "block" : "hidden"
                    }`}
                    onClick={() => {
                        toggleMenu(false);
                        toggleSearchbar(false);
                    }}
                ></div>

                <div className="flex items-center">
                    <button className="mr-4 z-40" onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        )}
                    </button>

                    <Logo
                        className={`${
                            isMobileView ? "w-28 mx-1" : "max-w-32 h-8 mx-2"
                        }`}
                    />
                </div>

                <Suspense fallback={<Loading />}>
                    <SideMenu
                        isMenuOpen={isMenuOpen}
                        toggleMenu={toggleMenu}
                        className={`fixed inset-y-0 z-40 w-56 ${
                            isMenuOpen ? "left-0" : "left-[-100%]"
                        }`}
                    />
                </Suspense>

                <div className="flex items-center">
                    {!isMobileView ? (
                        <span className="font-bold text-lg">
                            <SearchBar />
                        </span>
                    ) : (
                        <Button
                            onClick={() => {
                                setIsOpenSearchbar(!isOpenSearchbar);
                            }}
                            className=""
                        >
                            <svg
                                fill="#000000"
                                viewBox="0 0 28.423 28.423"
                                id="_02_-_Search_Button"
                                data-name="02 - Search Button"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 fill-current"
                            >
                                <path
                                    id="Path_215"
                                    data-name="Path 215"
                                    d="M14.953,2.547A12.643,12.643,0,1,0,27.6,15.19,12.649,12.649,0,0,0,14.953,2.547Zm0,2A10.643,10.643,0,1,1,4.31,15.19,10.648,10.648,0,0,1,14.953,4.547Z"
                                    transform="translate(-2.31 -2.547)"
                                    fillRule="evenodd"
                                />
                                <path
                                    id="Path_216"
                                    data-name="Path 216"
                                    d="M30.441,28.789l-6.276-6.276a1,1,0,1,0-1.414,1.414L29.027,30.2a1,1,0,1,0,1.414-1.414Z"
                                    transform="translate(-2.31 -2.547)"
                                    fillRule="evenodd"
                                />
                            </svg>
                        </Button>
                    )}

                    <Suspense fallback={<Loading />}>
                        <Toggle className="mx-1 md:mx-2" />
                    </Suspense>

                    <button
                        className="flex items-center"
                        onClick={toggleSidebar}
                    >
                        {authStatus ? (
                            <img
                                src={user.avatar}
                                alt="Profile"
                                className="h-8 w-8 rounded-full mr-2"
                            />
                        ) : (
                            <img
                                src={profilePlaceholder}
                                alt="Profile"
                                className="h-8 w-8 rounded-full mr-2"
                            />
                        )}
                    </button>

                    <Suspense fallback={<Loading />}>
                        <Sidebar
                            isOpen={isOpenSidebar}
                            setIsOpen={setIsOpenSidebar}
                            authStatus={authStatus}
                        />
                    </Suspense>
                </div>
            </header>
            {isOpenSearchbar && (
                <Suspense fallback={<Loading />}>
                    <div className="fixed top-12 z-50 w-full ">
                        <SearchBar />
                    </div>
                </Suspense>
            )}
        </>
    );
}

export default Header;
