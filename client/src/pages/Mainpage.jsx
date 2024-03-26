import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdDashboard, MdDescription, MdSettings } from 'react-icons/md';
import {ReactComponent as Logo} from './logo.svg';


export default function Mainpage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex">
      <div
        id="sidebar"
        className={`w-80 bg-indigo-900 fixed h-full ${
          sidebarOpen ? '' : 'hidden'
        }`}
      >
        <div className="flex text-white items-center p-5">
          <Logo className="h-10 w-10 mx-2" />
          <span className="mx-3 text-lg font-mono font-semibold">
            Building Inventory
          </span>
        </div>
        <hr />
        <nav>
          <ul className="text-white font-semibold">
            <li className="flex m-3 py-2">
              <MdDashboard className='w-5 h-5 mx-5' />
              <Link to="/">Dashboard</Link>
            </li>
            <li className="flex m-3 py-2">
              <MdDescription className='w-5 h-5 mx-5' />
              <Link to="/reports">Reports</Link>
            </li>
            <li className="flex m-3 py-2">
              <MdSettings className='w-5 h-5 mx-5' />
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className={`${sidebarOpen ? 'ml-80' : ''} w-full`}>
        <button
          className="fixed right-0 top-0 mt-4 mr-4 bg-black text-white p-2 rounded-md z-10 lg:hidden"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? 'Collapse' : 'Expand'}
        </button>
        <Outlet />
      </div>
    </div>
  );
}