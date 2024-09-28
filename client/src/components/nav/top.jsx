import React from "react";
import logo from '../../assets/img/logo.png'; // Adjusted path based on your provided directory

const TopBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 px-6 flex justify-between items-center z-10"> {/* Added fixed positioning */}
      {/* Left Logo */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-10 w-10" /> {/* Use img tag for PNG */}
      </div>
      {/* Add more elements like navigation links or buttons here if needed */}
    </nav>
  );
};

export default TopBar;
