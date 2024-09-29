import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import BuildingPage from "./pages/BuildingPage";
import RoomPage from "./pages/RoomPage";
import Sidebar from "./components/nav/side";
import Bottombar from "./components/nav/bottom";
import AccountHead from "./components/nav/AccountHead";
import TopBar from "./components/nav/top";

const App = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col h-full w-screen bg-lightGray">
      {!isLoginPage && <TopBar />} 
      <Routes>
        {isLoggedIn && user && user.role === "Administrator" && (
          <Route
            path="/"
            element={
              <div className="flex flex-col h-full w-screen">
                {isMobile ? <AccountHead /> : null}
                <div className="flex flex-1">
                  {isMobile ? null : <Sidebar />}
                  <div className="flex-1">
                    <Outlet />
                  </div>
                </div>
                {isMobile ? <Bottombar /> : null}
              </div>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="settings/*" element={<Settings />} />
            <Route path="catalog/building" element={<BuildingPage />} />
            <Route path="catalog/room/:buildingId" element={<RoomPage />} />
          </Route>
        )}

        {isLoggedIn && user && user.role === "Staff" && (
          <Route
            path="/"
            element={
              <div className="flex h-full w-screen">
                <div className="flex-1">
                  <Outlet />
                </div>
              </div>
            }
          >
            <Route index element={<BuildingPage />} />
            {/* <Route path="/rooms" element={<Settings />} /> SAMPLE */}
          </Route>
        )}

        {!isLoggedIn && <Route path="/login" element={<Login />} />}

        {!isLoggedIn && <Route path="/*" element={<Navigate to="/login" />} />}

        {isLoggedIn && (
          <Route
            path="*"
            element={
              <Navigate to={user.role === "Administrator" ? "/" : "/"} />
            }
          />
        )}
      </Routes>
    </div>
  );
};

export default App;
