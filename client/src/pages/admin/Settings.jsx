import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { FaEllipsisV } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useSelector } from 'react-redux';
import api from "../../services/api";
import AddUserModal from "../../components/modals/AddUserModal";
import EditUserModal from "../../components/modals/EditUserModal";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

const UserAccount = () => {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setUser({
      ...user,
      password: "",
      confirmPassword: "",
    });
    setSuccessMessage("");
    setApiError("");
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      fetchUserData(decoded.id);
    } else {
      console.error("Token not found in localStorage");
    }
  }, []);

  const fetchUserData = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    try {
      const response = await api.get(`/api/users/${userId}`);
      setUser({
        ...user,
        id: response.data._id,
        firstName: response.data.fullname.firstName,
        lastName: response.data.fullname.lastName,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (user.password && user.password !== user.confirmPassword) {
      setApiError("Passwords do not match!");
      return;
    }
    if (user.password && user.password.length < 8) {
      setApiError("New password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await api.put(`/api/users/${user.id}`, {
        password: user.password,
        fullname: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        setApiError("");
      } else {
        setApiError("Failed to update profile.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setApiError("An error occurred while updating the profile.");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [apiError]);

  return (
    <div className="py-5 -my-1 text-black mx-5">
      <div className="ml-2 mr-5">
        <h3 className="font-bold text-4xl mb-1">Account</h3>
        <p className="text-sm mb-2 text-gray-500">Account information</p>
        <hr className="mb-2 w-full mr-5" />

        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-black p-4 rounded shadow-md z-20">
            {successMessage}
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-4 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        )}
        {apiError && (
          <div className="fixed top-4 right-4 bg-red-500 text-black p-4 rounded shadow-md z-20">
            {apiError}
            <button
              onClick={() => setApiError("")}
              className="ml-4 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        )}

        <div className="max-w-md">
          <form onSubmit={handleUpdate}>
            <div className="grid gap-6 mb-7 md:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-lg font-bold text-black"
                >
                  First Name
                </label>
                <div
                  id="first_name"
                  className="text-black text-md rounded-lg block w-full p-2.5"
                >
                  {user.firstName}
                </div>
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-lg font-bold text-black"
                >
                  Last Name
                </label>
                <div
                  id="last_name"
                  className="text-black text-md rounded-lg block w-full p-2.5"
                >
                  {user.lastName}
                </div>
              </div>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="new_password"
                  className="block mb-2 text-lg font-bold text-black"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="new_password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="bg-transparent border border-black text-black text-sm rounded-lg block w-full p-2.5 pr-10" // Adjusted padding-right to make space for the icon
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-gray-500 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-sm mt-1">
                  • Must be at least 8 characters long.
                </p>{" "}
                {/* Added margin-top to separate the text */}
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="block mb-2 text-lg font-bold text-black"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    value={user.confirmPassword}
                    onChange={(e) =>
                      setUser({ ...user, confirmPassword: e.target.value })
                    }
                    className="bg-transparent border border-black text-black text-sm rounded-lg block w-full p-2.5 pr-10" // Adjusted padding-right to make space for the icon
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-gray-500 focus:outline-none"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2 flex justify-end mr-10">
              <div className="flex">
                <button
                  type="button"
                  className="bg-transparent border border-black text-black text-sm rounded-lg p-2.5 mr-4 "
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-transparent border border-black text-black text-sm rounded-lg p-2.5"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ManageUser = ({ toggleAddUserModal, toggleEditUserModal }) => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterCampus, setFilterCampus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCampuses, setAvailableCampuses] = useState([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleAddUserModalLocal = () => {
    setIsAddUserOpen((prev) => !prev);
    if (toggleAddUserModal) toggleAddUserModal();
  };

  const toggleEditUserModalLocal = () => {
    setIsEditUserOpen((prev) => !prev);
    if (toggleEditUserModal) toggleEditUserModal();
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
      const campuses = [
        ...new Set(response.data.map((user) => user.campus.name)),
      ];
      setAvailableCampuses(campuses);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserUpdate = async () => {
    await fetchUsers(); // Fetch the latest list of users from the server
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    const user = users.find((user) => user._id === userId);
    setEditingUser(user);
    toggleEditUserModalLocal();
  };

  const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/api/users/${userId}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== userId));

        setSuccessMessage("User deleted successfully!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await api.delete(`/api/users/${deleteUserId}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== deleteUserId));
        setSuccessMessage("User deleted successfully!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
    setIsDeleteModalOpen(false); // Close the confirmation modal
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setIsDeleteModalOpen(false); // Close the confirmation modal
  };

  const toggleDropdown = (userId) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId);
  };

  const filteredUsers = users.filter((user) => {
    const fullname =
      `${user.fullname.firstName} ${user.fullname.lastName}`.toLowerCase();
    const role = user.role.toLowerCase();
    const searchValue = searchTerm.toLowerCase();
    return (
      (filterRole ? user.role === filterRole : true) &&
      (filterCampus ? user.campus.name === filterCampus : true) &&
      (fullname.includes(searchValue) || role.includes(searchValue))
    );
  });

  return (
    <div className="my-4 text-black relative mx-5 md:mx-5  h-full flex-grow overflow-hidden">
      <div className="max-w-screen-lg ml-2">
        <h3 className="font-bold text-4xl mb-1">Manage User</h3>
        <p className="text-sm mb-2 text-gray-500">
          Manage who has access to the system
        </p>
        <hr className="mb-2" />
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-black p-4 rounded shadow-md z-20">
            {successMessage}
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-4 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
          <div className=" md:mt-0 flex items-center space-x-1 md:space-x-4">
            <div className="mr-0 md:mr-0 flex-shrink-0 w-24">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-black text-black text-sm rounded-lg px-2.5 py-1 w-full"
              >
                <option value="">All Roles</option>
                <option value="staff">Staff</option>
                <option value="administrator">Administrator</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div className="mr-0 md:mr-0 flex-shrink-0">
              <select
                value={filterCampus}
                onChange={(e) => setFilterCampus(e.target.value)}
                className="border border-black text-black text-sm rounded-lg px-2.5 py-1"
              >
                <option value="">All Campuses</option>
                {availableCampuses.map((campus) => (
                  <option key={campus} value={campus}>
                    {campus}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center mt-2 space-x-2 md:space-x-4">
            <div className="flex-grow max-w-xs md:max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-black text-gray-900 text-sm rounded-lg px-2.5 py-1.5 w-full"
              />
            </div>
            <button
              onClick={toggleAddUserModalLocal}
              className="rounded-full text-black p-2"
            >
              <FaCirclePlus />
            </button>
          </div>
        </div>
        {/* Table for Desktop View */}
        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-bold text-black-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-bold text-black-500 uppercase tracking-wider">
                Campus
              </th>
              <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-bold text-black-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-bold text-black-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-2 py-2 md:px-4 md:py-3 text-gray-500 text-xs md:text-sm">
                  {user.fullname.firstName} {user.fullname.lastName}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-3 text-gray-500 text-xs md:text-sm">
                  {user.campus.name}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-3 text-gray-500 text-xs md:text-sm">
                  {user.role}
                </td>
                <td className="px-2 py-2 md:px-4 md:py-3 text-gray-500 text-xs md:text-sm">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                     onClick={() => handleDeleteClick(user._id)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Table for Mobile View */}
        <div className="overflow-y-auto h-[calc(100vh-320px)]">
          {" "}
          <div className="md:hidden space-y-4 items">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="border rounded-lg p-4 bg-white shadow relative"
              >
                {/* Dropdown menu */}
                <div className="absolute top-4 right-2">
                  <button
                    onClick={() => toggleDropdown(user._id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen === user._id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => handleEdit(user._id)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                             onClick={() => handleDeleteClick(user._id)}
                            className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="flex-1">
                    <h3 className="text-lg text-black font-bold">
                      {user.fullname.firstName} {user.fullname.lastName}
                    </h3>
                    <p className="text-gray-800 text-sm">Role: {user.role}</p>
                    <p className="text-gray-800 text-sm">
                      Campus: {user.campus.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

         {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onConfirm={confirmDeleteUser}
            onCancel={cancelDelete}
          />


        {isAddUserOpen && (
          <AddUserModal
            isOpen={isAddUserOpen}
            toggleModal={toggleAddUserModalLocal}
            onUserAdded={handleUserUpdate}
          />
        )}
        {isEditUserOpen && (
          <EditUserModal
            isOpen={isEditUserOpen}
            toggleModal={toggleEditUserModalLocal}
            user={editingUser}
            onUserUpdated={handleUserUpdate}
          />
        )}
      </div>
    </div>
  );
};

const Settings = () => {
  const [selectedItem, setSelectedItem] = useState("account");
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const toggleAddUserModal = () => {
    setOpenAddUserModal((prevOpen) => !prevOpen);
  };

  const toggleEditUserModal = () => {
    setOpenEditUserModal((prevOpen) => !prevOpen);
  };

  return (
    <div className="flex-grow-1 h-screen overflow-y-auto flex flex-col">
      <h2 className="font-body text-3xl font-extrabold mt-20 mb-5 px-10 bg-lightGray text-black">
        Settings
      </h2>

      {/* Mobile Navigation */}
      <div className="block md:hidden overflow-x-hidden sticky top-0">
        <div className="flex flex-col mx-4 mb-10 bg-white">
          <nav className="border-b border-black">
            <ul className="pl-5 pr-5 flex text-black font-semibold justify-between space-x-3">
              <li
                className={`flex mt-3 py-2 pr-4 rounded-lg rounded-b-none hover:bg-primary hover:bg-opacity-5 ${
                  selectedItem === "account"
                    ? "bg-primary bg-opacity-5 border-b-2"
                    : ""
                }`}
                onClick={() => handleItemClick("account")}
              >
                <Link to="/settings" className="ml-3">
                  Account
                </Link>
              </li>
              <li
                className={`flex mt-3 py-2 pr-4 rounded-lg rounded-b-none hover:bg-primary hover:bg-opacity-5 ${
                  selectedItem === "manageuser"
                    ? "bg-primary bg-opacity-5 border-b-2"
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
          <div className="flex flex-col flex-1">
            {selectedItem === "account" && <UserAccount />}
            {selectedItem === "manageuser" && (
              <ManageUser
                toggleAddUserModal={toggleAddUserModal}
                toggleEditUserModal={toggleEditUserModal}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <div className="flex flex-grow flex-col md:flex-row mx-4 mb-10 bg-white overflow-hidden">
          <nav className="flex-shrink-0 md:w-1/6 py-3 px-2 border-r border-black">
            <ul className="text-black font-semibold">
              <li
                className={`flex mt-3 py-2 pl-2 hover:bg-primary hover:bg-opacity-10 hover:text-black ${
                  selectedItem === "account"
                    ? "bg-primary bg-opacity-75 border-l-4 border-primary text-white"
                    : ""
                }`}
                onClick={() => handleItemClick("account")}
              >
                <Link to="/settings" className="ml-3">
                  Account
                </Link>
              </li>
              <li
                className={`flex mt-3 py-2 pl-2 hover:bg-primary hover:bg-opacity-10 hover:text-black ${
                  selectedItem === "manageuser"
                    ? "bg-primary bg-opacity-75 border-l-4 border-primary text-white"
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

          <div className="flex flex-col flex-grow p-5 overflow-x-hidden">
            {selectedItem === "account" && <UserAccount />}
            {selectedItem === "manageuser" && (
              <ManageUser
                toggleAddUserModal={toggleAddUserModal}
                toggleEditUserModal={toggleEditUserModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
