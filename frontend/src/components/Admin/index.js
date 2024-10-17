import SideNavbar from "./SideNavbar";
import GoogleAnalyticsDashboard from "./GoogleAnalytics";
import { lazy } from "react";
const UserSearch = lazy(() => import("./UserSearch"));
const UpdateRole = lazy(() => import("./UpdateRole"));
const ManageUserPermissions = lazy(() => import("./ManageUserPermissions"));
const UpdateLabels = lazy(() => import("./UpdateLabels"));

export {
    SideNavbar,
    GoogleAnalyticsDashboard,
    UserSearch,
    UpdateRole,
    ManageUserPermissions,
    UpdateLabels,
};
