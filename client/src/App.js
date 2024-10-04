import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import BuildingPage from "./pages/BuildingPage";
import RoomPage from "./pages/RoomPage";
import Sidebar from "./components/nav/side";
// import AccountHead from "./components/nav/AccountHead";
import TopBar from "./components/nav/top";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/login" && isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col h-full w-screen bg-lightGray">
      {!isLoginPage && <TopBar />}
      <div className="flex flex-1">
        {!isLoginPage && <Sidebar />}
        <main className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/catalog/buildings" element={<BuildingPage />} />
              <Route path="/catalog/rooms/:buildingId" element={<RoomPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
