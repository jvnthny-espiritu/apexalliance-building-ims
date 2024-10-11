import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import BuildingPage from "./pages/BuildingPage";
import RoomPage from "./pages/RoomPage";
import DualNav from "./components/nav/dual";
import TopBar from "./components/nav/top";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isLoggedIn, userRole } = useSelector((state) => state.auth); // Access userRole from Redux store
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Checks if the screen is mobile size

  // Handle screen resize to toggle between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle redirect logic after login based on user role
  useEffect(() => {
    if (isLoggedIn) {
      if (location.pathname === "/login") {
        if (userRole === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/catalog/buildings"); // Redirect staff and guests to catalog
        }
      }
    }
  }, [isLoggedIn, userRole, location.pathname, navigate]);

  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex flex-col h-full w-screen bg-lightGray">
      {!isLoginPage && <TopBar />}
      <div className="flex flex-1">
        {!isLoginPage && <DualNav />} 
        <main className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to={userRole === "admin" ? "/dashboard" : "/catalog/buildings"} /> : <Login />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={userRole === "admin" ? <Dashboard /> : <Navigate to="/catalog/buildings" />} />
              <Route path="/settings" element={userRole === "admin" ? <Settings /> : <Navigate to="/catalog/buildings" />} />
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
