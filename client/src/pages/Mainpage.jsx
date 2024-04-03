import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Mainpage() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const toggleSidebar = () => {
	  setSidebarOpen(!sidebarOpen);
	};

  return (
    <div className="flex">
      <Sidebar />
      <Outlet />
    </div>
  );
}