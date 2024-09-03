import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdDashboard, MdBook } from 'react-icons/md';

export default function Bottombar() {
    const location = useLocation();

    const linkClasses = 'flex w-full py-1 justify-center items-center py-2 px-4 hover:bg-white hover:bg-opacity-5';
    const activeLinkClasses = 'bg-white bg-opacity-10 transition-colors duration-200';

    return (
        <div className="fixed bottom-0 left-0 w-full bg-primary text-white flex justify-around z-10">
            <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} 
                end
            >
                <div className="flex flex-col items-center">
                    <MdDashboard className="h-6 w-6" />
                    <p className="text-xs">Dashboard</p>
                </div>
            </NavLink>
            <NavLink 
                to="/catalog/building" 
                className={({ isActive }) => {
                    const isBuildingActive = isActive || location.pathname.startsWith('/catalog/room');
                    return isBuildingActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses;
                }}
            >
                <div className="flex flex-col items-center">
                    <MdBook className="h-6 w-6" />
                    <p className="text-xs">Catalog</p>
                </div>
            </NavLink>
        </div>
    );
}
