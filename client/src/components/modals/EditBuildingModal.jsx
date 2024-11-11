import React, { useState, useEffect } from "react";
import api from '../../services/api';

const EditBuildingModal = ({ isOpen, toggleModal, building, onBuildingUpdated, facilities }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    name: building ? building.name : "",
    campus: building ? building.campus._id : "",
    yearBuilt: building ? building.yearBuilt : "",
    numberOfFloors: building ? building.numberOfFloors : "",
    facilities: building ? building.facilities : [],
  });

  const [campuses, setCampuses] = useState([]);
  const [facilityColorMap, setFacilityColorMap] = useState({});

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const campusResponse = await api.get("/api/campuses");
        setCampuses(campusResponse.data);
      } catch (error) {
        setApiError("Failed to fetch campuses. Please try again later.");
      }
    };

    if (isOpen) {
      fetchCampuses();
      if (building) {
        setFormData({
          name: building.name,
          campus: building.campus._id,
          yearBuilt: building.yearBuilt,
          numberOfFloors: building.numberOfFloors,
          facilities: building.facilities || [],
        });
      }
    }
  }, [isOpen, building]);

  useEffect(() => {
    if (facilities.length > 0) {
      const facilityColors = ['bg-facilities-1', 'bg-facilities-2', 'bg-facilities-3', 'bg-facilities-4', 'bg-facilities-5'];
      const colorMap = {};
      facilities.forEach((facility, index) => {
        colorMap[facility] = facilityColors[index % facilityColors.length];
      });
      setFacilityColorMap(colorMap);
    }
  }, [facilities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData((prevData) => {
      const updatedFacilities = prevData.facilities.includes(facility)
        ? prevData.facilities.filter((f) => f !== facility)
        : [...prevData.facilities, facility];
      return {
        ...prevData,
        facilities: updatedFacilities,
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Building name is required.";
    if (!formData.yearBuilt) errors.yearBuilt = "Year of completion is required.";
    if (!formData.numberOfFloors) errors.numberOfFloors = "Number of floors is required.";
    if (!formData.campus) errors.campus = "Campus is required.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await api.put(`/building/${building._id}`, formData); // Assuming PUT request to update building
      setSuccessMessage("Building updated successfully!");
      if (onBuildingUpdated) {
        onBuildingUpdated();
      }
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      setApiError("Failed to update building. Please try again later.");
    }
  };

  const handleClose = () => {
    setSuccessMessage("");
    if (typeof toggleModal === "function") {
      toggleModal();
    }
  };

  return (
    <>
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
          {successMessage}
          <button onClick={() => setSuccessMessage("")} className="ml-4 text-lg font-bold">
            &times;
          </button>
        </div>
      )}
      {apiError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-md z-20">
          {apiError}
          <button onClick={() => setApiError("")} className="ml-4 text-lg font-bold">
            &times;
          </button>
        </div>
      )}
      <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50 z-10 ${isOpen ? '' : 'hidden'}`}>
        <div className="relative bg-white text-black p-8 w-full max-w-md md:max-w-3xl lg:max-w-4xl overflow-auto max-h-[90vh]">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4">{building ? "EDIT BUILDING" : "Add Building"}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Building Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-b-2 border-black p-2 outline-none w-full"
                />
                {validationErrors.name && <span className="text-red-500 text-sm">{validationErrors.name}</span>}
              </div>
              <div>
                <label className="text-black">Campus</label>
                <select
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                  className="border-b-2 border-black p-2 outline-none w-full"
                >
                  <option value="">Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus._id} value={campus._id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
                {validationErrors.campus && <span className="text-red-500 text-sm">{validationErrors.campus}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-black">Year of Completion</label>
                <input
                  type="number" 
                  name="yearBuilt"
                  value={formData.yearBuilt || ""} 
                  onChange={handleChange}
                  className="border-b-2 border-black p-2 outline-none w-full"
                  min="1900" 
                  max={new Date().getFullYear()} 
                />
                {validationErrors.yearBuilt && <span className="text-red-500 text-sm">{validationErrors.yearBuilt}</span>}
              </div>
              <div>
                <label className="text-black">Number of Floors</label>
                <select
                  name="numberOfFloors"
                  value={formData.numberOfFloors}
                  onChange={handleChange}
                  className="border-b-2 border-black p-2 outline-none w-full"
                >
                  <option value="">Select</option>
                  {[...Array(10).keys()].map((n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
                {validationErrors.numberOfFloors && <span className="text-red-500 text-sm">{validationErrors.numberOfFloors}</span>}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-black">Facilities</label>
              <div className="flex space-x-4 flex-wrap">
                {facilities.length === 0 && (
                  <p className="text-red-500">No facilities available.</p>
                )}
                {facilities.map((facility) => (
                  <button
                    type="button"
                    key={facility}
                    className={`px-4 py-2 rounded shadow-md transition-all ${
                      formData.facilities.includes(facility)
                        ? `${facilityColorMap[facility]} text-white`
                        : "bg-gray-300 text-black border border-gray-500"
                    }`}
                    onClick={() => handleFacilityChange(facility)}
                  >
                    {facility}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button type="submit" className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600">
                SUBMIT
              </button>
              <button type="button" className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600" onClick={handleClose}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBuildingModal;
