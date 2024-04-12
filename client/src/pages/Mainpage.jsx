import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Mainpage() {
  return (
    <div className="flex h-full w-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}