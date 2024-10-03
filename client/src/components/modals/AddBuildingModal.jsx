import React, { useState, useEffect } from "react";
import api from '../../services/api';

const AddBuildingModal = ({ isOpen, toggleModal, onBuildingAdded }) => {
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    buildingName: "",
    campus: "",
    facilities: "",
    numberOfFloors: "", 
    yearOfCompletion: "", 
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [campuses, setCampuses] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await api.get("/campus");
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.buildingName) errors.buildingName = "Building name is required.";
    if (!formData.campus) errors.campus = "Campus is required.";
    if (!formData.numberOfFloors) errors.numberOfFloors = "Number of floors is required.";
    if (!formData.yearOfCompletion) {
      errors.yearOfCompletion = "Year of completion is required.";
    } else {
      const date = new Date(formData.yearOfCompletion);
      if (isNaN(date.getTime())) {
        errors.yearOfCompletion = "Invalid date format.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    console.log("Submitting form data:", formData); // Log the data being submitted

    try {
      await api.post("/building", formData);
      setSuccessMessage("Building successfully added!");
      if (onBuildingAdded) {
        onBuildingAdded();
      }
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Error adding building:", error.response?.data || error.message); // Log the error
      setApiError("Failed to add building. Please try again later.");
    }
  };  

  const handleClose = () => {
    setFormData({
      buildingName: "",
      campus: "",
      facilities: "", 
      numberOfFloors: "", 
      yearOfCompletion: "", 
    });
    setValidationErrors({});
    setSuccessMessage(""); 
    if (typeof toggleModal === "function") {
      toggleModal();
    }
  };

  const handleFacilitiesChange = (facility) => {
    setFormData((prevData) => ({
      ...prevData,
      facilities: facility, 
    }));
  };

  const getFacilityColor = (facility) => {
    switch (facility) {
      case "Classroom":
        return formData.facilities === facility ? "bg-green-600 text-white" : "border border-gray-600 text-gray-600 ";
      case "Laboratory":
        return formData.facilities === facility ? "bg-blue-600 text-white" : "border border-gray-600 text-gray-600";
      case "Administrative":
        return formData.facilities === facility ? "bg-primary text-white" : "border border-gray-600 text-gray-600"; 
      default:
        return "";
    }
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
            className="ml-4 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50 z-10 ${isOpen ? '' : 'hidden'}`}>
        <div className="relative bg-white text-black p-8 w-full max-w-md md:max-w-3xl lg:max-w-4xl overflow-auto max-h-[90vh] rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <h2 className="text-black text-xl font-bold mb-4">
                CREATE BUILDING
              </h2>
              <div className="mb-4">
                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                  <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                    <label className="text-black font-semibold">Name</label>
                    <input
                      type="text"
                      name="buildingName"
                      value={formData.buildingName}
                      onChange={handleChange}
                      className="border-b-2 border-black p-3 outline-none"
                    />
                    {validationErrors.buildingName && (
                      <span className="text-red-500 text-sm">{validationErrors.buildingName}</span>
                    )}
                  </div>
                  <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                    <label className="text-black font-semibold">Campus</label>
                    <select
                      name="campus"
                      value={formData.campus}
                      onChange={handleChange}
                      className="border-b-2 border-black p-3 outline-none"
                    >
                      <option value=""></option>
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

                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                  <div className="flex flex-col mb-4 md:w-1/2 md:pr-2">
                    <label className="text-black font-semibold">Year of Completion</label>
                    <input
                      type="date"
                      name="yearOfCompletion"
                      value={formData.yearOfCompletion}
                      onChange={handleChange}
                      className="border-b-2 border-black p-3 outline-none"
                    />
                    {validationErrors.yearOfCompletion && (
                      <span className="text-red-500 text-sm">{validationErrors.yearOfCompletion}</span>
                    )}
                  </div>

                  <div className="flex flex-col md:w-1/2 md:pl-2 md:ml-4">
                    <label className="text-black font-semibold">No. of Floors</label>
                    <select
                      name="numberOfFloors"
                      value={formData.numberOfFloors}
                      onChange={handleChange}
                      className="border-b-2 border-black p-3 outline-none"
                    >
                      <option value=""></option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    {validationErrors.numberOfFloors && (
                      <span className="text-red-500 text-sm">{validationErrors.numberOfFloors}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col w-full  md:pr-2">
                  <label className="text-black mb-3 font-semibold">Facilities</label>
                  <div className="flex gap-4 flex-wrap">
                    {["Classroom", "Laboratory", "Administrative"].map((facility) => (
                      <button
                        key={facility}
                        className={`px-4 py-2 ${getFacilityColor(facility)} rounded-md`}
                        onClick={() => handleFacilitiesChange(facility)}
                        type="button"
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="border border-primary bg-primary text-white text-sm rounded-lg p-2.5 mr-4 hover:bg-primary hover:text-white"
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

export default AddBuildingModal;