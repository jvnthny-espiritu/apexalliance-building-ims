import React, { useState, useEffect } from "react";
import api from '../../services/api';

const EditUserModal = ({ isOpen, toggleModal, user, onUserUpdated  }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); 
  const [apiError, setApiError] = useState("");
  
  const [formData, setFormData] = useState({
    fullname: {
      firstName: user ? user.fullname.firstName : "",
      lastName: user ? user.fullname.lastName : "",
    },
    role: user ? user.role : "staff",
    username: user ? user.username : "",
    password: "",
    confirmPassword: "",
    campus: user ? user.campus._id : "",
  });
  
  const [campuses, setCampuses] = useState([]);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchCampuses = async () => {
        try {
            const response = await api.get("/api/campuses");
            setCampuses(response.data);
        } catch (error) {
            setApiError("Failed to fetch campuses. Please try again later.");
        }
    };

    if (isOpen) {
        fetchCampuses();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "firstName" || name === "lastName") {
      setFormData((prevData) => ({
        ...prevData,
        fullname: {
          ...prevData.fullname,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateForm = async () => {
    const errors = {};
  
    if (!formData.fullname.firstName) errors.firstName = "First name is required.";
    if (!formData.fullname.lastName) errors.lastName = "Last name is required.";
    if (!formData.username) errors.username = "Username is required.";
    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.campus) errors.campus = "Campus is required.";
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; 
  };  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;
  
    try {
      const response = await api.put(`/api/users/${user._id}`, formData);
  
      setSuccessMessage("User updated successfully!");
      if (onUserUpdated) {
        onUserUpdated();
      }
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        setValidationErrors(errors);
      } else {
        setApiError("Failed to update user. Please try again later.");
      }
    }
  };  

  const handleClose = () => {
    setSuccessMessage(""); 
    if (typeof toggleModal === "function") {
      toggleModal();
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role: role,
    }));
  };

  return (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
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
            <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-md z-20">
                {apiError}
                <button
                    onClick={() => setApiError("")}
                    className="ml-4 text-lg font-bold">
                    &times;
                </button>
            </div>
      )}
    <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50 z-10 ${isOpen ? '' : 'hidden'}`}>
      <div className="relative bg-white text-black p-8 w-full max-w-md md:max-w-3xl lg:max-w-4xl overflow-auto max-h-[90vh]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <h2 className="text-black text-xl font-bold mb-4">
              {user ? "Edit User" : "Add User"}
            </h2>
            <hr className="border-b-4 border-black mb-4" />
            <div className="mb-4">
              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.fullname.firstName}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                   {validationErrors.firstName && (
                    <span className="text-red-500 text-sm">{validationErrors.firstName}</span>
                  )}
                </div>
                <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                  <label className="text-black">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.fullname.lastName}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {validationErrors.lastName && (
                    <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black">Role</label>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      className={`px-4 py-2 ${
                        formData.role === "administrator"
                          ? "bg-indigo-500 text-white"
                          : "border border-primary text-black"
                      } rounded-lg`}
                      onClick={() => handleRoleChange("administrator")}
                      type="button"
                    >
                      Administrator
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        formData.role === "staff"
                          ? "bg-red-500 text-white"
                          : "border border-primary text-black"
                      } rounded-lg`}
                      onClick={() => handleRoleChange("staff")}
                      type="button"
                    >
                      Staff
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        formData.role === "guest"
                          ? "bg-red-500 text-white"
                          : "border border-primary text-black"
                      } rounded-lg`}
                      onClick={() => handleRoleChange("guest")}
                      type="button"
                    >
                      Guest
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                  <label className="text-black">Campus</label>
                  <select
                    name="campus"
                    value={formData.campus}
                    onChange={handleChange}
                    className="border-b-2 border-black p-3 outline-none"
                  >
                    <option value="">Select Campus</option>
                    {campuses.length > 0 ? (
                      campuses.map((campus) => (
                        <option key={campus._id} value={campus._id}>
                          {campus.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Loading Campuses...</option>
                    )}
                  </select>
                  {validationErrors.campus && (
                    <span className="text-red-500 text-sm">{validationErrors.campus}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-black">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter Userame"
                  className="border-b-2 border-black p-3 outline-none"
                />
                {validationErrors.username && (
                <span className="text-red-500 text-sm">{validationErrors.username}</span>
              )}
              </div>
              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  <p className="text-sm">• Must be at least 8 characters long.</p>
                  {validationErrors.password && (
                    <span className="text-red-500 text-sm">{validationErrors.password}</span>
              )}
                </div>
                <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                  <label className="text-black">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Enter Re-enter Password"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {passwordError && <p className="text-red-500">{passwordError}</p>}
                  {validationErrors.confirmPassword && (
                  <span className="text-red-500 text-sm">{validationErrors.confirmPassword}</span>
                )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="border border-primary text-black text-sm rounded-lg p-2.5 mr-4 hover:bg-primary hover:text-white"
              >
                Submit
              </button>
              <button
                type="button"
                className="border border-primary text-black text-sm rounded-lg p-2.5 hover:bg-primary hover:text-white"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditUserModal;
