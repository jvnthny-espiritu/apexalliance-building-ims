import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function AccountHead() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

  const handleLogout = () => {
		console.log("Logging out...");
		dispatch({ type: 'LOGOUT' });
		localStorage.removeItem('token');
		navigate('/login');	
	}

  return (
    <div className="fixed top-0 right-0 mr-4 mt-4 z-10 text-darkGray ">
      <div onClick={toggleDropdown}>
        <MdAccountCircle className="h-10 w-10 cursor-pointer" />
      </div>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-40 z-10 bg-white rounded-lg ring-1 ring-black ring-opacity-10 focus:outline-none"
          onMouseLeave={closeDropdown}
        >
          <div className="py-1 text-black hover:bg-primary ">
            <NavLink
              to="/settings/account"
              className={`${linkClasses} ${activeLinkClasses} ${
                isHovered ? "hover:bg-primary hover:bg-opacity-50" : ""
              }`}
              onClick={closeDropdown} 
              onMouseEnter={toggleHover} 
              onMouseLeave={toggleHover} 
            >
              Setting
            </NavLink>
            <NavLink
              to="/login"
              className={`${linkClasses} ${activeLinkClasses} ${
                isHovered ? "hover:bg-gray-30" : ""
              }`}
              onClick={closeDropdown && handleLogout}
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
