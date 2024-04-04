import React from 'react';
import { Routes, Route } from "react-router-dom";
import Mainpage from './pages/Mainpage';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Settings from './pages/Settings';
import Login from './pages/LoginPage';
import BuildingPage from './pages/BuildingPage';
import RoomPage from './pages/RoomPage';


export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Mainpage />}>
          <Route index element={<Dashboard />} />
          <Route path='reports' element={<Report />} />
          <Route path='settings' element={<Settings />} />
          <Route path='dashboard/building' element={<BuildingPage />} />
          <Route path='dashboard/room' element={<RoomPage />} />
        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}