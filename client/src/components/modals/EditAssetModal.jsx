import React, { useState, useEffect } from "react";
import api from "../../services/api";

const EditAssetModal = ({ isOpen, toggleModal, onAssetEdit, roomName, asset }) => {
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    report: "",
    status: "good condition",
    location: roomName || "",
    purchaseDate: "",
    value: "1000",
    numberOfUnits: 1,
    electricDetails: {
      voltage: "1",
      power: "1",
      manufacturer: "",
      warranty: "",
    },
    nonElectricDetails: {
      material: "",
      dimensions: "",
      weight: "1",
    },
  });
  
    // Populate formData when asset changes or modal opens
    useEffect(() => {
      if (isOpen && asset) {
        setFormData({
          name: asset.name || "",
          category: asset.category || "",
          report: asset.report || "",
          status: asset.status || "good condition",
          location: roomName || "",
          purchaseDate: asset.purchaseDate || "",
          value: asset.value || "1000",
          numberOfUnits: asset.numberOfUnits || 1,
          electricDetails: {
            voltage: asset.electricDetails?.voltage || "1",
            power: asset.electricDetails?.power || "1",
            manufacturer: asset.electricDetails?.manufacturer || "",
            warranty: asset.electricDetails?.warranty || "",
          },
          nonElectricDetails: {
            material: asset.nonElectricDetails?.material || "",
            dimensions: asset.nonElectricDetails?.dimensions || "",
            weight: asset.nonElectricDetails?.weight || "1",
          },
        });
      }
    }, [isOpen, asset, roomName]);

  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name.startsWith("electricDetails") ||
      name.startsWith("nonElectricDetails")
    ) {
      const [parent, key] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required.";
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.location) errors.location = "Location is required.";
    if (!formData.purchaseDate) errors.purchaseDate = "Purchase Date is required.";
    if (!formData.numberOfUnits || formData.numberOfUnits < 1)
      errors.numberOfUnits = "Number of units must be at least 1.";
    if (!formData.value || formData.value <= 0)
      errors.value = "Value must be a positive number.";

    if (formData.category === "electric") {
      if (!formData.electricDetails.voltage)
        errors.electricDetails = "Voltage is required for electric items.";
      if (!formData.electricDetails.power)
        errors.electricDetails = "Power is required for electric items.";
    }

    if (formData.category === "non-electric") {
      if (!formData.nonElectricDetails.material)
        errors.nonElectricDetails =
          "Material is required for non-electric items.";
      if (!formData.nonElectricDetails.dimensions)
        errors.nonElectricDetails =
          "Dimensions are required for non-electric items.";
      if (!formData.nonElectricDetails.weight)
        errors.nonElectricDetails =
          "Weight is required for non-electric items.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      const newAsset = {
        ...formData,
        location: formData.location, 
      };
      console.log("Submitting asset data:", newAsset); 
      await api.post("/api/assets", newAsset);

      if (onAssetEdit) {
        onAssetEdit("Asset successfully updated!");
      }
      
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error(
        "Error editing Asset:",
        error.response?.data || error.message
      );
      setApiError("Failed to update Asset. Please try again later.");
    }
  };

  const handleClose = () => {
    resetForm();
    if (typeof toggleModal === "function") {
      toggleModal();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      report: "",
      status: "good condition",
      location: "",
      purchaseDate: "",
      value: "1000",
      numberOfUnits: 1,
      electricDetails: {
        voltage: "1",
        power: "1",
        manufacturer: "",
        warranty: "",
      },
      nonElectricDetails: {
        material: "",
        dimensions: "",
        weight: "1",
      },
    });
    setValidationErrors({});
    setSuccessMessage("");
    setApiError("");
  };

  const handleCategoryChange = (category) => {
    setFormData((prevData) => ({
      ...prevData,
      category: category,
    }));
  };

  const getCategoryColor = (category) => {
    return formData.category === category
      ? category === "electric"
        ? "bg-green-600 text-white"
        : "bg-primary text-white"
      : "border border-gray-600 text-gray-600";
  };

  return (
    <>
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
      <div
        className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50 z-10 ${
          isOpen ? "" : "hidden"
        }`}
      >
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
        <div className="relative bg-white text-black p-8 w-full max-w-4xl md:max-w-5xl lg:max-w-6xl overflow-auto max-h-[90vh] rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <h2 className="text-black text-xl font-bold mb-4">
                EDIT ASSET
              </h2>

              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {validationErrors.name && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.name}
                    </span>
                  )}
                </div>

                <div className="ml:2 flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">Category</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("electric")}
                      className={`px-6 py-2 rounded-lg ${getCategoryColor(
                        "electric"
                      )}`}
                    >
                      Electric
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange("non-electric")}
                      className={`px-6 py-2 rounded-lg ${getCategoryColor(
                        "non-electric"
                      )}`}
                    >
                      Non-Electric
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">Report</label>
                  <input
                    type="text"
                    name="report"
                    value={formData.report}
                    onChange={handleChange}
                    placeholder="Enter report"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                </div>

                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    placeholder="Choose status"
                    className="border-b-2 border-black p-3 outline-none"
                  >
                    <option value="good condition">Good Condition</option>
                    <option value="not working">Not Working</option>
                    <option value="for replacement">For Replacement</option>
                    <option value="under maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {validationErrors.location && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.location}
                    </span>
                  )}
                </div>

                <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                  <label className="text-black font-semibold">Purchase Date</label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {validationErrors.purchaseDate && (
                    <span className="text-red-500 text-sm">{validationErrors.purchaseDate}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">
                    Value
                    </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {validationErrors.value && (
                    <span className="text-red-500 text-sm">
                    {validationErrors.location}
                  </span>
                  )}
                </div>

                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                  <label className="text-black font-semibold">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    name="numberOfUnits"
                    value={formData.numberOfUnits}
                    onChange={handleChange}
                    min="1"
                    className="border-b-2 border-black p-3 outline-none"
                  />
                  {validationErrors.numberOfUnits && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.numberOfUnits}
                    </span>
                  )}
                </div>
              </div>

              {formData.category === "electric" && (
                <>
                  <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                    <div className="flex flex-col w-full md:w-1/4 md:pr-2">
                      <label className="text-black font-semibold">
                        Voltage
                      </label>
                      <input
                        type="number"
                        name="electricDetails.voltage"
                        value={formData.electricDetails.voltage}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                      {validationErrors.electricDetails && (
                        <span className="text-red-500 text-sm">
                          {validationErrors.electricDetails}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col w-full md:w-1/4 md:pr-2">
                      <label className="text-black font-semibold">Power</label>
                      <input
                        type="number"
                        name="electricDetails.power"
                        value={formData.electricDetails.power}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/4 md:pr-2">
                      <label className="text-black font-semibold">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        name="electricDetails.manufacturer"
                        value={formData.electricDetails.manufacturer}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/4 md:pr-2">
                      <label className="text-black font-semibold">
                        Warranty
                      </label>
                      <input
                        type="text"
                        name="electricDetails.warranty"
                        value={formData.electricDetails.warranty}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.category === "non-electric" && (
                <>
                  <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                    <div className="flex flex-col w-full md:w-1/3 md:pr-2">
                      <label className="text-black font-semibold">
                        Material
                      </label>
                      <input
                        type="text"
                        name="nonElectricDetails.material"
                        value={formData.nonElectricDetails.material}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/3 md:pr-2">
                      <label className="text-black font-semibold">
                        Dimensions
                      </label>
                      <input
                        type="text"
                        name="nonElectricDetails.dimensions"
                        value={formData.nonElectricDetails.dimensions}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                    </div>
                    <div className="flex flex-col w-full md:w-1/3 md:pr-2">
                      <label className="text-black font-semibold">Weight</label>
                      <input
                        type="number"
                        name="nonElectricDetails.weight"
                        value={formData.nonElectricDetails.weight}
                        onChange={handleChange}
                        className="border-b-2 border-black p-3 outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit and Cancel buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg"
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

export default EditAssetModal;