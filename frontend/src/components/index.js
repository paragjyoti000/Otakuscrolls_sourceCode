import { lazy } from "react";

import Authlayout from "./Authlayout";
import PermissionProvider from "./PermissionProvider";
import Button from "./Button";
import Logo from "./Logo";
import Footer from "./Footer";
import Header from "./Header/Header";
import Loading from "./Loading";

import PageDesignOne from "./PageDesign/PageDesignOne";
import PageDesignTwo from "./PageDesign/PageDesignTwo";
import NovelCardSkeleton from "./NovelCardSkeleton";

const Toggle = lazy(() => import("./Header/Toggle"));
const SideMenu = lazy(() => import("./Header/SideMenu"));
const Sidebar = lazy(() => import("./Header/Sidebar"));
const RTE = lazy(() => import("./RTE"));
const Input = lazy(() => import("./Input"));
const Login = lazy(() => import("./forms/LoginForm"));
const Signup = lazy(() => import("./forms/SignupForm"));
const ChapterForm = lazy(() => import("./forms/ChapterForm"));
const NovelForm = lazy(() => import("./forms/NovelForm"));
const NovelCard = lazy(() => import("./NovelCard"));
const ForgetPasswordForm = lazy(() => import("./forms/ForgetPasswordForm"));
const PasswordRecoverForm = lazy(() => import("./forms/PasswordRecoverForm"));
const SearchBar = lazy(() => import("./forms/SearchBar"));
const ChangePasswordForm = lazy(() => import("./forms/ChangePasswordForm"));
const OtpForm = lazy(() => import("./forms/OtpForm"));
const Rating = lazy(() => import("./Rating"));
const Bookmark = lazy(() => import("./Bookmark"));
const Carousel = lazy(() => import("./Home/Carousel"));
const Comments = lazy(() => import("./comments/Comments"));
const CommentForm = lazy(() => import("./comments/CommentForm"));
const ProgressBar = lazy(() => import("./ProgressBar"));
const Trendings = lazy(() => import("./Home/Trendings"));
const Sections = lazy(() => import("./Home/Sections"));
const Message = lazy(() => import("./Home/Message"));
const BlurImage = lazy(() => import("./BlurImage"));

export {
    PermissionProvider,
    Header,
    Footer,
    Loading,
    Button,
    Logo,
    Toggle,
    SideMenu,
    Sidebar,
    RTE,
    Input,
    Login,
    Signup,
    ChapterForm,
    NovelForm,
    NovelCard,
    Authlayout,
    ForgetPasswordForm,
    PasswordRecoverForm,
    SearchBar,
    PageDesignOne,
    PageDesignTwo,
    ChangePasswordForm,
    OtpForm,
    Rating,
    Bookmark,
    Carousel,
    Comments,
    CommentForm,
    ProgressBar,
    Trendings,
    Sections,
    Message,
    BlurImage,
    NovelCardSkeleton,
};
