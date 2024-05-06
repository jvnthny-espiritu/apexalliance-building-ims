import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import Login from './pages/auth/Login';
import BuildingPage from './pages/BuildingPage';
import RoomPage from './pages/RoomPage';
import Sidebar from './components/nav/side';
import Bottombar from './components/nav/bottom';
import Topbar from './components/nav/top';

const App = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Routes>
      {isLoggedIn && user && user.role === 'administrator' && (
        <Route path="/admin/*" element={
          <div className="flex h-full w-screen">
            {isMobile ? <Bottombar /> : <Sidebar />}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        }>
          <Route index element={<Dashboard />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="catalog/building" element={<BuildingPage />} />
          <Route path="catalog/room/:buildingId" element={<RoomPage />} />
        </Route>
      )}

      {isLoggedIn && user && user.role === 'staff' && (
        <Route path="/user/*" element={
          <div className="flex h-full w-screen">
            <Topbar />
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        }>
          <Route index element={<BuildingPage />} />
          {/* <Route path="/rooms" element={<Settings />} /> SAMPLE */}
        </Route>
      )}

      {!isLoggedIn && (
        <Route path="/login" element={<Login />} />
      )}

      {!isLoggedIn && (
        <Route path="/*" element={<Navigate to='/login' />} />
      )}

      {isLoggedIn && (
        <Route path="*" element={<Navigate to={user.role === 'administrator' ? "/admin" : "/user"} />} />
      )}
    </Routes>
  );
};

export default App;
