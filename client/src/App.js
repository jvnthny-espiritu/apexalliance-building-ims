import React from 'react';
import { Routes, Route } from "react-router-dom";
import Mainpage from './pages/Mainpage';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Settings from './pages/Settings';


export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Mainpage />}>
          <Route index element={<Dashboard />} />
          <Route path='reports' element={<Report />} />
          <Route path='settings' element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}