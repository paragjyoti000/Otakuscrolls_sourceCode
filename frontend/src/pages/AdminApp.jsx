import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense, useEffect, useState } from "react";
import { SideNavbar } from "../components/Admin";
import { Dashboard, Users, Settings } from "./Admin";
import { Loading, PermissionProvider } from "../components";

function AdminApp() {
    return (
        <PermissionProvider permission={["access_admin_panel"]} autoRedirect>
            <div className="flex rounded-md overflow-hidden select-text">
                <SideNavbar />
                <div className="flex-grow">
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </Suspense>
                </div>
            </div>
        </PermissionProvider>
    );
}

export default AdminApp;
