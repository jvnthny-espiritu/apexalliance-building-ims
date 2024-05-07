import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AddUserModal from '../../components/modals/AddUserModal';

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
      <div className="ml-2 mr-5">
        <h3 className="font-extrabold text-2xl mb-1">Account</h3>
        <p className="text-sm mb-2 text-gray-500">Account information</p>
        <hr className="mb-2 w-full mr-5" />
        <div className="max-w-md">
          <form>
            <div className="grid gap-6 mb-7 md:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-lg  font-bold text-white"
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
                  className=" text-lg font-bold text-white"
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
                  className="text-lg font-bold text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 bg-transparent border border-white text-white text-sm rounded-lg block w-full p-2.5 dark:bg-primary dark:white dark:text-white dark:focus:white dark:focus:border-white"
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
                  className="block mb-2 text-lg font-bold text-white"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new_password"
                    className="bg-transparent border border-white text-white text-sm rounded-lg block w-full p-2.5 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white"
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
                  className="block mb-2 text-lg font-bold text-white"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    className="bg-transparent border border-white text-white text-sm rounded-lg block w-full p-2.5 dark:bg-black-pearl-950 dark:white dark:text-white dark:focus:white dark:focus:border-white"
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
            className="bg-transparent border border-white text-white text-sm rounded-lg p-2.5 mr-4 dark:bg-black-pearl-950 dark:white dark:focus:white dark:focus:border-white hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white dark:hover:border-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-transparent border border-white text-white text-sm rounded-lg p-2.5 dark:bg-black-pearl-950 dark:white  dark:focus:white dark:focus:border-white hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-white dark:hover:border-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ManageUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [filterCampus, setFilterCampus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCampuses, setAvailableCampuses] = useState([]);

  const toggleModal = () => {
    setIsOpen(prev => !prev);
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user"); // Fetch users from your API endpoint
        setUsers(response.data); // Set the fetched users to the state
        const campuses = [...new Set(response.data.map(user => user.campus.name))];
        setAvailableCampuses(campuses);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); // Fetch users when the component mounts
  }, []);

  const handleEdit = (userId) => {
    // Implement the edit functionality here
    console.log(`Editing user with ID: ${userId}`);
  };
  

  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/user/${userId}`); // Delete user using your API
      if (response.ok) {
        console.log('User deleted successfully');
        setUsers(users.filter(user => user._id !== userId));
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };  

  const filteredUsers = users.filter(user => {
    const fullName = `${user.fullName.firstName} ${user.fullName.lastName}`.toLowerCase();
    const role = user.role.toLowerCase();
    const searchValue = searchTerm.toLowerCase();
    return (
      (filterRole ? user.role === filterRole : true) &&
      (filterCampus ? user.campus.name === filterCampus : true) &&
      (fullName.includes(searchValue) || role.includes(searchValue))
    );
  });

  return (
    <div className="my-4 text-white overflow-y-auto relative mr-10">
      <div className="max-w-screen-lg ml-2">
        <h3 className="font-extrabold text-2xl mb-1">Manage User</h3>
        <p className="text-sm mb-2 text-gray-500">
          Manage who has access to the system
        </p>
        <hr className="mb-2" />
        <div className="flex mb-2 items-center justify-end">
          <div className="mr-4">
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="border border-white text-black text-sm rounded-lg px-2.5 py-1">
              <option value="">All Roles</option>
              <option value="Staff">Staff</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div>
            <select value={filterCampus} onChange={e => setFilterCampus(e.target.value)} className="border border-white text-black text-sm rounded-lg px-2.5 py-1">
              <option value="">All Campuses</option>
              {availableCampuses.map(campus => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center ml-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-white text-gray-900 text-sm rounded-lg px-2.5 py-1.5"
            />
             <button onClick={toggleModal} className="rounded-full text-white p-2 ml-2 ">
              <FaCirclePlus />
            </button>
            {isOpen && <AddUserModal isOpen={isOpen} toggleModal={toggleModal}/>}
          </div>
        </div>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campus</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-3 text-gray-500 text-sm">{user.fullName.firstName} {user.fullName.lastName}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{user.campus.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{user.role}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{user.email}</td>

                  <td className="px-4 py-3 text-gray-500 text-sm">
                    <button onClick={() => handleEdit(user._id)} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="ml-2 text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



const Settings = () => {
  const [selectedItem, setSelectedItem] = useState("account");
  const [open, setOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const toggleModal = () => {
    setOpen((prevOpen) => {
      console.log("Modal toggle state:", !prevOpen);
      return !prevOpen;
    });
  };
  

  return (
    <div className="w-screen h-screen overflow-y-auto flex flex-col">
      <h2 className="font-body text-2xl font-extrabold pt-5 mb-5 px-10 ">
        SETTINGS
      </h2>
      <div className="block sm:hidden">
        <div className="w-screen flex flex-col mx-4 mb-10 bg-primary overflow-x-auto">
          <nav className="border-b border-white">
            <ul className="pl-5 pr-5 flex text-white font-semibold font-body justify-between space-x-3 ">
              <li
                className={`flex mt-3 ml-2 py-2 pr-4  rounded-lg rounded-b-none hover:bg-white hover:bg-opacity-5 ${
                  selectedItem === "account" ? "bg-white bg-opacity-5 border-b-2" : ""
                }`}
                onClick={() => handleItemClick("account")}
              >
                <Link to="/settings" className="ml-3">
                  Account
                </Link>
              </li>
              <li
                className={`flex mt-3 ml-2 py-2 pr-4  rounded-lg rounded-b-none hover:bg-white hover:bg-opacity-5  ${
                  selectedItem === "manageuser" ? "bg-white bg-opacity-5 border-b-2" : ""
                }`}
                onClick={() => handleItemClick("manageuser")}
              >
                <Link to="/settings" className="ml-3">
                  Manage User
                </Link>
              </li>
            </ul>
          </nav>
          <div className="ml-5 flex-grow">
            {selectedItem === "account" && <UserAccount />}
            {selectedItem === "manageuser" && <ManageUser toggleModal={toggleModal} />}
          </div>
        </div>
      </div>
      <div className="hidden sm:table-cell">
        <div className="py-2 flex flex-grow font-body mx-10 mb-10 bg-primary overflow-x-auto">
          <nav className="px-2  py-3 border-r border-white max-h-full  hidden md:block">
            <ul className="text-white font-semibold font-body">
              <li
                className={`flex mt-3 py-2 pl-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5 ${
                  selectedItem === "account" ? "bg-white bg-opacity-5 border-l-4 border-white" : ""
                }`}
                onClick={() => handleItemClick("account")}
              >
                <Link to="/admin/settings/account" className="ml-3">
                  Account
                </Link>
              </li>
              <div className="border-l border-white h-full"></div>
              <li
                className={`flex mt-3 py-2 pl-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5 ${
                  selectedItem === "manageuser" ? "bg-white bg-opacity-5 border-l-4 border-white" : ""
                }`}
                onClick={() => handleItemClick("manageuser")}
              >
                <Link to="/admin/settings/manageuser" className="ml-3">
                  Manage User
                </Link>
              </li>
            </ul>
          </nav>
          <div className="ml-5 flex-grow">
            {selectedItem === "account" && <UserAccount />}
            {selectedItem === "manageuser" && <ManageUser toggleModal={toggleModal} />}
          </div>
        </div>
      </div>
      {open && <AddUserModal toggleModal={toggleModal} />}
    </div>
  );
};

export default Settings;