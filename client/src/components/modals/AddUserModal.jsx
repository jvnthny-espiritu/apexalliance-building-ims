import React, { useState, useEffect, useRef } from "react";
import api from '../../services/api';

const AddUserModal = ({ isOpen, toggleModal }) => {
  const [formData, setFormData] = useState({
    fullName: {
      firstName: "",
      lastName: "",
    },
    role: "staff",
    username: "",
    email: "",
    password: "",
  });

  const modalRef = useRef();

  useEffect(() => {
    const handleEscapeKeyPress = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress);
    } else {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName" || name === "lastName") {
      setFormData((prevData) => ({
        ...prevData,
        fullName: {
          ...prevData.fullName,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/user", formData);
      console.log("User created:", response.data);
      handleClose();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleClose = () => {
    if (typeof toggleModal === "function") {
      toggleModal(); // Close modal if toggleModal prop is provided
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prevData) => ({
      ...prevData,
      role: role,
    }));
  };
  
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-primary bg-opacity-50 z-10">
      <div className="relative bg-white text-black p-8 w-full max-w-md md:max-w-3xl lg:max-w-4xl">
        <button
          className="absolute top-0 right-5 m-2 text-black text-xl cursor-pointer"
          onClick={handleClose}
        >
          x
        </button>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <h2 className="text-black text-xl font-bold mb-4">
              Account Registration
            </h2>
            <hr className="border-b-4 border-black mb-4" />
            <div className="mb-4">
              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.fullName.firstName}
                    onChange={handleChange}
                    className="border-b-2 border-black p-3 outline-none"
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                  <label className="text-black">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.fullName.lastName}
                    onChange={handleChange}
                    className="border-b-2 border-black p-3 outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black">Role</label>
                  <div className="flex gap-4">
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
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                  <label className="text-black">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border-b-2 border-black p-3 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-black">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-b-2 border-black p-3 outline-none"
              />
            </div>
            <div className="flex flex-col mb-4 md:flex-row md:mb-8">
              <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                <label className="text-black">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-b-2 border-black p-3 outline-none"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                <label className="text-black">Confirm Password</label>
                <input
                  type="password"
                  className="border-b-2 border-black p-3 outline-none"
                />
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
  );
};

export default AddUserModal;
