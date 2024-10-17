import { lazy } from "react";

const Home = lazy(() => import("./Home"));
const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));
const Novel = lazy(() => import("./Novel"));
const Chapter = lazy(() => import("./Chapter"));
const AddNovel = lazy(() => import("./AddNovel"));
const AddChapter = lazy(() => import("./AddChapter"));
const EditNovel = lazy(() => import("./EditNovel"));
const EditChapter = lazy(() => import("./EditChapter"));
const AllNovel = lazy(() => import("./AllNovel"));
const DraftNovel = lazy(() => import("./DraftNovel"));
const ForgetPassword = lazy(() => import("./ForgetPassword"));
const PasswordRecovery = lazy(() => import("./PasswordRecovery"));
const PageNotFound = lazy(() => import("./404page"));
const Profile = lazy(() => import("./Profile"));
const ChangePassword = lazy(() => import("./ChangePassword"));
const History = lazy(() => import("./History"));
const BookmarkPage = lazy(() => import("./BookmarkPage"));
const ContactForm = lazy(() => import("./ContactForm"));
const AboutUs = lazy(() => import("./AboutUs"));
const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
const FeedPage = lazy(() => import("./FeedPage"));

const AdminApp = lazy(() => import("./AdminApp"));

export {
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
    PrivacyPolicy,
    FeedPage,

    // Admin Pages
    AdminApp,
};
