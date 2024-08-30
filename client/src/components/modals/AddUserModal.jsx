import React, { useState, useEffect, useRef } from "react";
import api from '../../services/api';

const AddUserModal = ({ isOpen, toggleModal }) => {
  const [formData, setFormData] = useState({
    fullName: {
      firstName: "",
      lastName: "",
    },
    role: "Staff",
    username: "",
    email: "",
    password: "",
    campus: "", 
  });

  const [campuses, setCampuses] = useState([]); 
  const modalRef = useRef();

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/campus");
        setCampuses(response.data); 
      } catch (error) {
        console.error("Error fetching campuses:", error);
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
    <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-primary bg-opacity-50 z-10 ${isOpen ? '' : 'hidden'}`}>
      <div className="relative bg-white text-black p-8 w-full max-w-md md:max-w-3xl lg:max-w-4xl overflow-auto max-h-[90vh] rounded-lg">
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
                  <div className="flex gap-4 flex-wrap">
                    <button
                      className={`px-4 py-2 ${
                        formData.role === "Administrator"
                          ? "bg-indigo-500 text-white"
                          : "border border-primary text-black"
                      } rounded-lg`}
                      onClick={() => handleRoleChange("Administrator")}
                      type="button"
                    >
                      Administrator
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        formData.role === "Staff"
                          ? "bg-red-500 text-white"
                          : "border border-primary text-black"
                      } rounded-lg`}
                      onClick={() => handleRoleChange("Staff")}
                      type="button"
                    >
                      Staff
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
                </div>
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-black">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border-b-2 border-black p-3 outline-none"
              />
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
