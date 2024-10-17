import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Authlayout } from "./components";
import {
    Home,
    Login,
    Signup,
    Novel,
    Chapter,
    AddNovel,
    AddChapter,
    EditNovel,
    EditChapter,
    AllNovel,
    DraftNovel,
    ForgetPassword,
    PasswordRecovery,
    PageNotFound,
    Profile,
    ChangePassword,
    History,
    BookmarkPage,
    ContactForm,
    AboutUs,

    // Admin Pages
    AdminApp,
    PrivacyPolicy,
    FeedPage,
} from "./pages";

const theme = localStorage.getItem("localTheme");
theme === "light"
    ? document.querySelector("html").classList.remove("dark")
    : null;

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/admin/*"
                        element={
                            <Authlayout authentication={true}>
                                <AdminApp />
                            </Authlayout>
                        }
                    />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                    <Route path="*" element={<PageNotFound />} />
                    <Route
                        path="/login"
                        element={
                            <Authlayout authentication={false}>
                                <Login />
                            </Authlayout>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <Authlayout authentication={false}>
                                <Signup />
                            </Authlayout>
                        }
                    />
                    <Route
                        path="/forget-password"
                        element={
                            <Authlayout authentication={false}>
                                <ForgetPassword />
                            </Authlayout>
                        }
                    />
                    <Route
                        path="/password-recovery"
                        element={
                            <Authlayout authentication={false}>
                                <PasswordRecovery />
                            </Authlayout>
                        }
                    />
                    <Route path="/user/profile" element={<Profile />} />
                    <Route
                        path="/user/history"
                        element={
                            <Authlayout authentication={true}>
                                <History />
                            </Authlayout>
                        }
                    />
                    <Route
                        path="/user/bookmarks"
                        element={
                            <Authlayout authentication={true}>
                                <BookmarkPage />
                            </Authlayout>
                        }
                    />
                    <Route
                        path="/user/change-password"
                        element={
                            <Authlayout authentication={true}>
                                <ChangePassword />
                            </Authlayout>
                        }
                    />
                    <Route path="/search" element={<AllNovel />} />
                    <Route
                        path="/draft-novels"
                        element={
                            <Authlayout authentication={true}>
                                <DraftNovel />
                            </Authlayout>
                        }
                    />

                    <Route
                        path="/add-novel"
                        element={
                            <Authlayout authentication={true}>
                                <AddNovel />
                            </Authlayout>
                        }
                    />
                    <Route path="/novel/:novelId" element={<Novel />} />
                    <Route
                        path="/edit-novel/:novelId"
                        element={
                            <Authlayout authentication={true}>
                                <EditNovel />
                            </Authlayout>
                        }
                    />

                    <Route
                        path="/novel/:novelId/add-chapter"
                        element={
                            <Authlayout authentication={true}>
                                <AddChapter />
                            </Authlayout>
                        }
                    />
                    <Route
                        path="/novel/:novelId/chapter/:sqNo/:chapterId"
                        element={<Chapter />}
                    />
                    <Route
                        path="/novel/:novelId/edit-chapter/:sqNo/:chapterId"
                        element={
                            <Authlayout authentication={true}>
                                <EditChapter />
                            </Authlayout>
                        }
                    />

                    <Route path="/feed" element={<FeedPage />} />

                    <Route path="/contact-us" element={<ContactForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);
