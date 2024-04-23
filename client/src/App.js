import React from 'react';
import { Routes, Route } from "react-router-dom";
import Mainpage from './pages/Mainpage';
import Dashboard from './pages/Dashboard';
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
          <Route path='settings' element={<Settings />} />
          <Route path='catalog/building' element={<BuildingPage />} />
          <Route path='/catalog/room/:buildingId' element={<RoomPage />} />

        </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  );
}