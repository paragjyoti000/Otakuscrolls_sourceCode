import { useState, useEffect, useCallback, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { Header, Footer, Loading } from "./components";
import { Outlet, useNavigate } from "react-router-dom";
import conf from "./envConf/conf";
import authService from "./api/auth";
import { ErrorBoundary } from "react-error-boundary";
import fallbackRender from "./components/ErrorBoundary";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { QueryClient, QueryClientProvider } from "react-query";

import ReactGA from "react-ga4";

ReactGA.initialize(conf.googleAnalyticsMeasurementId);

function App() {
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }, []);

    const queryClient = new QueryClient();

    const [loading, setLoading] = useState(true);
    const [toTop, setToTop] = useState(false);

    const dispatch = useDispatch();

    const getUser = useCallback(async () => {
        authService
            .getCurrentUser()
            .then((userData) => {
                userData ? dispatch(login({ userData })) : dispatch(logout());
            })
            .catch((err) => {
                // console.warn(
                //     `Error: ${err.response.statusText}\nStatus: ${err.response.status}\nmessage: "Visiting the site as guest user"`
                // );
            })
            .finally(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        getUser();

        window.addEventListener("scroll", () => {
            if (
                document.body.scrollTop > 0 ||
                document.documentElement.scrollTop > 0
            ) {
                setToTop(true);
            } else {
                setToTop(false);
            }
        });

        return () => {
            window.removeEventListener("scroll", () => {
                if (
                    document.body.scrollTop > 0 ||
                    document.documentElement.scrollTop > 0
                ) {
                    setToTop(true);
                } else {
                    setToTop(false);
                }
            });
        };
    });

    const navigate = useNavigate();

    useEffect(() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, [navigate]);

    return !loading ? (
        <>
            <QueryClientProvider client={queryClient}>
                <div
                    className="h-screen w-full dark:bg-gray-900 dark:text-slate-50 antialiased scrollbar-thin scrollbar-webkit select-none ease-in-out"
                    // onContextMenu={(e) => e.preventDefault()}
                >
                    <div className="flex flex-col h-screen w-full">
                        <Header
                            className={`fixed `}
                            // ${
                            //     document.body.scrollTop > 0 ||
                            //     document.documentElement.scrollTop > 0
                            //         ? "fixed"
                            //         : ""
                            // }
                        />
                        <main className="mt-14 rounded-md backdrop-blur-sm print:hidden">
                            <ErrorBoundary fallbackRender={fallbackRender}>
                                <Suspense fallback={<Loading />}>
                                    <Outlet />
                                </Suspense>
                            </ErrorBoundary>
                        </main>
                        <Footer />
                    </div>
                    {toTop && (
                        <div
                            onClick={() => {
                                document.body.scrollTop = 0;
                                document.documentElement.scrollTop = 0;
                            }}
                            id="toTop"
                            className="fixed bottom-4 right-4 cursor-pointer shadow-2xl shadow-black hover:scale-110 duration-200 delay-100"
                        >
                            <FaRegArrowAltCircleUp size={35} />
                        </div>
                    )}
                </div>
            </QueryClientProvider>
        </>
    ) : (
        <>
            <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900 dark:text-slate-50 antialiased">
                <div className="loading-container">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                </div>
            </div>
        </>
    );
}

export default App;
