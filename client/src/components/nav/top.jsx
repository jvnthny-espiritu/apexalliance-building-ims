import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { NavLink } from 'react-router-dom';

export default function Topbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const linkClasses = "flex w-full py-5 justify-center items-center py-2 px-4";
  const activeLinkClasses = "transition-colors duration-200";

  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div className="fixed top-0 right-0 mr-4 mt-4 z-10 text-white">
      <div onClick={toggleDropdown}>
        <MdAccountCircle className="h-10 w-10 cursor-pointer" />
      </div>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white rounded-lg ring-1 ring-black ring-opacity-10 focus:outline-none"
          onMouseLeave={closeDropdown}
        >
          <div className="py-1 text-black">
            <NavLink
              to="/settings/account"
              className={`${linkClasses} ${activeLinkClasses} ${
                isHovered ? "hover:bg-gray-30" : ""
              }`}
              onClick={closeDropdown} 
              onMouseEnter={toggleHover} 
              onMouseLeave={toggleHover} 
            >
              Account
            </NavLink>
            <NavLink
              to="/settings/manageuser"
              className={`${linkClasses} ${activeLinkClasses} ${
                isHovered ? "hover:bg-gray-30" : ""
              }`}
              onClick={closeDropdown} 
              onMouseEnter={toggleHover} 
              onMouseLeave={toggleHover} 
            >
              Manage User
            </NavLink>

            <NavLink
              to="/settings/manageuser"
              className={`${linkClasses} ${activeLinkClasses} ${
                isHovered ? "hover:bg-gray-30" : ""
              }`}
              onClick={closeDropdown} 
              onMouseEnter={toggleHover} 
              onMouseLeave={toggleHover} 
            >
              Logout
            </NavLink>

          </div>
        </div>
      )}
    </div>
  );
}
