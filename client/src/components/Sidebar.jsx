import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdDescription,
  MdBook,
  MdSettings,
  MdMenu,
  MdExitToApp,
} from "react-icons/md";
import { ReactComponent as Logo } from "../assets/img/logo.svg";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const linkClasses =
    "flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5";
  const activeLinkClasses =
    "border-l-4 bg-white bg-opacity-10 transition-colors duration-200";
  const link =
    "flex items-center mx-auto px-3 p-1    rounded-lg rounded-b-none hover:bg-white hover:bg-opacity-5";
  const activeLink =
    "border-b-2 mx-auto px-2 p-1 bg-white bg-opacity-10 transition-colors duration-200";

  return (
    <div>
      <div
        className={`h-screen sticky top-0 transition-width ease-in-out duration-300 hidden md:flex  ${
          expanded ? "w-1/5" : "w-auto"
        }`}
      >
        <nav className="h-full flex flex-col justify-between px-5 bg-primary text-white">
          <div>
            <div className="w-full p-4 pb-5 inline-flex justify-between items-center">
              <div className={`inline-flex items-center`}>
                <Logo
                  className={`transition-all ease-in-out ${
                    expanded ? "h-10 w-10" : "h-0 w-0"
                  }`}
                />
                <span
                  className={`transition-all ease-in-out ${
                    expanded ? "px-5 font-mono font-semibold" : "sr-only"
                  }`}
                >
                  Building Inventory
                </span>
              </div>
              <button
                onClick={() => setExpanded((curr) => !curr)}
                className="p-1.5 rounded-lg hover:bg-white hover:bg-opacity-5"
              >
                <MdMenu className="h-7 w-7" />
              </button>
            </div>
            <hr />
            <ul className="mt-5 justify-center">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${linkClasses} ${activeLinkClasses}`
                      : linkClasses
                  }
                  title="Dashboard"
                >
                  <MdDashboard className="h-6 w-6 mx-4" />
                  <span className={`${expanded ? "ml-4" : "sr-only"}`}>
                    Dashboard
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/catalog/building"
                  className={({ isActive }) =>
                    isActive
                      ? `${linkClasses} ${activeLinkClasses}`
                      : linkClasses
                  }
                  title="Catalog"
                >
                  <MdBook className="h-6 w-6 mx-4" />
                  <span className={`${expanded ? "ml-4" : "sr-only"}`}>
                    Catalog
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <hr />
            <ul className="mb-4">
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? `${linkClasses} ${activeLinkClasses}`
                      : linkClasses
                  }
                  title="Settings"
                >
                  <MdSettings className="h-6 w-6 mx-4" />
                  <span className={`${expanded ? "ml-4" : "sr-only"}`}>
                    Settings
                  </span>
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full mt-4 py-2 p-1.5 rounded-lg hover:bg-white hover:bg-opacity-5"
                >
                  <MdExitToApp className="h-6 w-6 mx-4" />
                  <span className={`${expanded ? "ml-4" : "sr-only"}`}>
                    Logout
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="visible sm:block md:hidden">
        <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-primary">
          <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium ">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${link} ${activeLink}` : link
              }
              title="Dashboard"
            >
              <div className="flex flex-col items-center justify-center">
                <MdDashboard className="w-6 h-6 mb-2 text-white" />
                <span className="text-sm text-white">Dashboard</span>
              </div>
            </NavLink>
            <NavLink
              to="/catalog/building"
              className={({ isActive }) =>
                isActive ? `${link} ${activeLink}` : link
              }
              title="Catalog"
            >
              <div className="flex flex-col items-center justify-center">
                <MdBook className="w-6 h-6 mb-2 text-white" />
                <span className="text-sm text-white">Catalog</span>
              </div>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? `${link} ${activeLink}` : link
              }
              title="Settings"
            >
              <div className="flex flex-col items-center justify-center">
                <MdSettings className="w-6 h-6 mb-2 text-white" />
                <span className="text-sm text-white">Settings</span>
              </div>
            </NavLink>
            <button
              type="button"
              className="inline-flex flex-col items-center justify-center px-5"
            >
              <MdExitToApp className="w-6 h-6 mb-2 text-white" />
              <span className="text-sm text-white">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
