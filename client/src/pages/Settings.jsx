import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserAccount = () => {
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="py-5 -my-1 text-white mr-5">
      <div className="mx-auto mr-5">
        <h3 className="font-extrabold text-2xl mb-1">Account</h3>
        <p className="text-sm mb-2 text-gray-500">Account information</p>
        <hr className="mb-2 w-full mr-5" />
        <div className="max-w-md">
          <form>
            <div className="grid gap-6 mb-7 md:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-lg  font-bold text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <div
                  id="first_name"
                  className="text-white text-md rounded-lg block w-full p-2.5"
                >
                  {user.firstName}
                </div>
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className=" text-lg font-bold text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <div
                  id="last_name"
                  className=" text-white text-md rounded-lg block w-full p-2.5 "
                >
                  {user.lastName}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-lg font-bold text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 bg-transparent border border-white text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white"
                  placeholder="email address"
                  required
                />
              </div>
            </div>
          </form>
          <div className="max-w-screen-lg mx-auto"></div>
          <form>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="new_password"
                  className="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new_password"
                    className="bg-transparent border border-white text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white"
                    placeholder="new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block mb-2 text-lg font-bold text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    className="bg-transparent border border-white text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white"
                    placeholder="confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 focus:outline-none"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="p-2 flex justify-end mr-10">
        <div className="flex">
          <button
            type="submit"
            className="bg-transparent border border-white text-gray-900 text-sm rounded-lg p-2.5 mr-4 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white dark:hover:border-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-transparent border border-white text-gray-900 text-sm rounded-lg p-2.5 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white dark:hover:border-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const UserRow = ({ user }) => {
  return (
    <tr>
      <td className="py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.campus}</div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-gray-900">
          {user.role}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        **********
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Edit
        </a>
        <a href="#" className="ml-2 text-red-600 hover:text-red-900">
          Delete
        </a>
      </td>
    </tr>
  );
};

const ManageUser = () => {
  const [users, setUsers] = useState([
    {
      name: "John Doe",
      campus: "Alangilan",
      role: "STAFF",
      email: "john.doe@example.com",
    },
    {
      name: "John Doe",
      campus: "Alangilan",
      role: "STAFF",
      email: "john.doe@example.com",
    },
    {
      name: "John Doe",
      campus: "Alangilan",
      role: "STAFF",
      email: "john.doe@example.com",
    },
    {
      name: "John Doe",
      campus: "Alangilan",
      role: "STAFF",
      email: "john.doe@example.com",
    },
    {
      name: "John Doe",
      campus: "Alangilan",
      role: "STAFF",
      email: "john.doe@example.com",
    },
  ]);

  return (
    <div className="my-4 text-white overflow-y-auto relative mr-10">
      <div className="max-w-screen-lg mx-auto">
        <h3 className="font-extrabold text-2xl mb-1">Manage User</h3>
        <p className="text-sm mb-2 text-gray-500">
          Manage who has access to the system
        </p>
        <hr className="mb-2" />
        <div className="flex mb-2 items-center justify-end">
          <input
            type="text"
            placeholder="Search users..."
            className="border border-white text-gray-900 text-sm rounded-lg px-2.5 py-1.5"
          />
          <button className="rounded-full text-white p-2 ml-2">
            <FaCirclePlus />
          </button>
        </div>
        <table className="divide-y divide-gray-200 mb-5 w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Campus
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Password
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <UserRow key={index} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function Settings() {
  const [selectedItem, setSelectedItem] = useState("account");

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="w-screen h-screen overflow-y-auto flex flex-col">
      <h2 className="font-body text-2xl font-extrabold pt-5 mb-1 px-10 ">
        SETTINGS
      </h2>
      <div className="flex flex-grow font-body mx-10 mb-10 bg-primary">
        <div>
          <nav className="border-r border-white h-full px-2 ">
            <ul className="text-white font-semibold font-body">
              <li
                className={`flex mt-3 m-0 py-2 pl-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5 ${
                  selectedItem === "account"
                    ? "bg-white bg-opacity-5 border-l-4 border-white"
                    : ""
                }`}
                onClick={() => handleItemClick("account")}
              >
                <Link to="/settings" className="ml-3">
                  Account
                </Link>
              </li>
              <div className="border-l border-white h-full"></div>
              <li
                className={`flex mt-3 m-0 py-2 pl-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5 ${
                  selectedItem === "manageuser"
                    ? "bg-white bg-opacity-5  border-l-4 pl-2 border-white   "
                    : ""
                }`}
                onClick={() => handleItemClick("manageuser")}
              >
                <Link to="/settings" className="ml-3">
                  Manage User
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="ml-5 flex-grow">
          {selectedItem === "account" && <UserAccount />}
          {selectedItem === "manageuser" && <ManageUser />}
        </div>
      </div>
    </div>
  );
}
