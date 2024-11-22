import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import BuildingPage from "./pages/BuildingPage";
import RoomPage from "./pages/RoomPage";
import Reports from "./pages/admin/Report";
import DualBar from "./components/nav/dual";
import TopBar from "./components/nav/top";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorized from "./pages/NotAuthorized";

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
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

  useEffect(() => {
    if (location.pathname === "/login" && isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const isLoginPage = location.pathname === "/login" || location.pathname === "/not-authorized";

  return (
    <div className="flex flex-col h-full w-screen bg-lightGray">
      {!isLoginPage && <TopBar />}
      <div className="flex flex-1">
        {!isLoginPage && <DualBar />}
        <main className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route element={<ProtectedRoute requiredRoles={['admin', 'staff', 'guest']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/catalog/buildings" element={<BuildingPage />} />
              <Route path="/catalog/rooms/:buildingId" element={<RoomPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
      
    </div>
  );
};

export default App;