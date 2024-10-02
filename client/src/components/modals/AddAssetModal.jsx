import React, { useState, useEffect } from "react";
import api from '../../services/api';

const AddAssetModal = ({ isOpen, toggleModal, onAssetAdded }) => {
    const [apiError, setApiError] = useState("");
    const [formData, setFormData] = useState({
        Name: "",
        category: "",
        status: "Good",
        condition: "Good",
        location: "",
        numberOfUnits: "",
        cost: "",
        purchasedDate: "",
        electricDetails: "",
        nonElectricDetails: ""
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");


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
        if (!formData.Name) errors.Name = "Name is required.";
        if (!formData.category) errors.category = "Category is required.";
    
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) return;

        try {
            await api.post("/Asset", formData);
            setSuccessMessage("Asset successfully added!");
            if (onAssetAdded) {
                onAssetAdded();
            }
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (error) {
            console.error("Error adding Asset:", error.response?.data || error.message);
            setApiError("Failed to add Asset. Please try again later.");
        }
    };

    const handleClose = () => {
        setFormData({
            Name: "",
            category: "",
            status: "Good",
            condition: "Good",
            location: "",
            numberOfUnits: "",
            cost: "",
            purchasedDate: "",
            electricDetails: "",
            nonElectricDetails: ""
        });
        setValidationErrors({});
        setSuccessMessage("");
        if (typeof toggleModal === "function") {
            toggleModal();
        }
    };

    const handleCategoryChange = (category) => {
        setFormData((prevData) => ({
            ...prevData,
            category: category,
        }));
    };

    const getCategoryColor = (category) => {
        return formData.category === category
            ? (category === "Electric" ? "bg-green-600 text-white" : "bg-primary text-white")
            : "border border-gray-600 text-gray-600";
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
                <div className="relative bg-white text-black p-8 w-full max-w-4xl md:max-w-5xl lg:max-w-6xl overflow-auto max-h-[90vh] rounded-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <h2 className="text-black text-xl font-bold mb-4">CREATE ASSET</h2>
                            <div className="mb-4">
                                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                                    <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                        <label className="text-black font-semibold">Name</label>
                                        <input
                                            type="text"
                                            name="Name"
                                            value={formData.Name}
                                            onChange={handleChange}
                                            className="border-b-2 border-black p-3 outline-none"
                                        />
                                        {validationErrors.Name && (
                                            <span className="text-red-500 text-sm">{validationErrors.Name}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col md:w-1/4 md:pr-2">
                                    <label className="text-black font-semibold">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    >
                                        <option value="Good">Good</option>
                                        <option value="Bad">Bad</option>
                                        <option value="Working">Working</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:w-1/4 md:pr-2">
                                    <label className="text-black font-semibold">Condition</label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    >
                                        <option value="Good">Good</option>
                                        <option value="Bad">Bad</option>
                                        <option value="Working">Working</option>
                                    </select>
                                </div>
                                </div>

                                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                                    <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                        <label className="text-black mb-3 font-semibold">Category</label>
                                        <div className="flex gap-4 flex-wrap">
                                            {["Electric", "Non Electric"].map((category) => (
                                                <button
                                                    key={category}
                                                    className={`px-4 py-2 rounded-full ${getCategoryColor(category)}`}
                                                    onClick={() => handleCategoryChange(category)}
                                                    type="button"
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                        {validationErrors.category && (
                                            <span className="text-red-500 text-sm">{validationErrors.category}</span>
                                        )}
                                    </div>
                                    
                                <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                    <label className="text-black font-semibold">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    />
                                </div>
                                </div>
                                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                                    <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                    <label className="text-black font-semibold">Electric Details</label>
                                    <input
                                        type="text"
                                        name="electricDetails"
                                        value={formData.electricDetails}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    />
                                    
                                </div>
                                <div className="flex flex-col md:w-1/4 md:pr-2">
                                    <label className="text-black font-semibold">Number of Units</label>
                                    <input
                                        type="number"
                                        name="numberOfUnits"
                                        value={formData.numberOfUnits}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    />
                                </div>
                                <div className="flex flex-col md:w-1/4 md:pr-2">
                                    <label className="text-black font-semibold">Cost</label>
                                    <input
                                        type="number"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    />
                                </div>
                                </div>
                                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                                    <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                    <label className="text-black font-semibold">Non-electric Details</label>
                                    <input
                                        type="text"
                                        name="nonElectricDetails"
                                        value={formData.nonElectricDetails}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    />
                            </div>
                                    <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                    <label className="text-black font-semibold">Purchased Date</label>
                                    <input
                                        type="date"
                                        name="purchasedDate"
                                        value={formData.purchasedDate}
                                        onChange={handleChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    />
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
                                    onClick={handleClose}
                                    className="border border-red-500 text-black text-sm rounded-lg p-2.5 hover:bg-red-500 hover:text-white"
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

export default AddAssetModal;
