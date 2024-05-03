import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdBook } from 'react-icons/md';

export default function Bottombar() {
    const linkClasses = 'flex w-full py-5 justify-center items-center py-2 px-4 hover:bg-white hover:bg-opacity-5';
    const activeLinkClasses = 'bg-white bg-opacity-10 transition-colors duration-200';

    return (
        <div className="fixed bottom-0 left-0 w-full bg-primary text-white flex justify-around">
            <NavLink to="/" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
                <MdDashboard className="h-6 w-6" />
            </NavLink>
            <NavLink to="/catalog/building" className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
                <MdBook className="h-6 w-6" />
            </NavLink>
        </div>
    );
}