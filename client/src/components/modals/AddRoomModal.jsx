import React, { useState, useEffect } from "react";
import api from '../../services/api';

const AddRoomModal = ({ isOpen, toggleModal, onRoomAdded }) => {
    const [apiError, setApiError] = useState("");
    const [formData, setFormData] = useState({
        RoomName: "",
        building: "",
        purpose: "", // Change to a string for single selection
        floor: "",
        status: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [buildings, setBuildings] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await api.get("/api/buildings");
                setBuildings(response.data);
                if (response.data.length > 0) {
                    setFormData((prevData) => ({
                        ...prevData,
                        building: response.data[0]._id,
                    }));
                }
            } catch (error) {
                setApiError("Failed to fetch buildings. Please try again later.");
            }
        };

        if (isOpen) {
            fetchBuildings();
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
        if (!formData.RoomName) errors.RoomName = "Room name is required.";
        if (!formData.building) errors.building = "Building is required.";
        if (!formData.floor) errors.floor = "Floor number is required.";
        if (!formData.status) errors.status = "Status is required.";
        if (!formData.purpose) errors.purpose = "Purpose is required.";

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (!isValid) return;
        
        console.log("Submitting form data:", formData);

        try {
            await api.post("/api/rooms", formData);
            setSuccessMessage("Room successfully added!");
            if (onRoomAdded) {
                onRoomAdded();
            }
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (error) {
            console.error("Error adding Room:", error.response?.data || error.message);
            setApiError("Failed to add Room. Please try again later.");
        }
    };

    const handleClose = () => {
        setFormData({
            RoomName: "",
            building: "",
            purpose: "",
            floor: "",
            status: "",
        });
        setValidationErrors({});
        setSuccessMessage("");
        if (typeof toggleModal === "function") {
            toggleModal();
        }
    };

    const handleStatusChange = (status) => {
        setFormData((prevData) => ({
            ...prevData,
            status: status,
        }));
    };

    const handlePurposeChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            purpose: e.target.value,
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return formData.status === "Available" ? "bg-green-600 text-white" : "border border-gray-600 text-gray-600"; 
            case "Not Available":
                return formData.status === "Not Available" ? "bg-red-600 text-white" : "border border-gray-600 text-gray-600"; 
            case "Under Maintenance":
                return formData.status === "Under Maintenance" ? "bg-yellow-500 text-white" : "border border-gray-600 text-gray-600"; 
            default:
                return "border border-gray-600 text-gray-600";
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
                                CREATE Room
                            </h2>
                            <hr className="border-b-4 border-black mb-4" />
                            <div className="mb-4">
                                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                                    <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                                        <label className="text-black font-semibold">Room Name</label>
                                        <input
                                            type="text"
                                            name="RoomName"
                                            value={formData.RoomName}
                                            onChange={handleChange}
                                            placeholder="Enter Room Name"
                                            className="border-b-2 border-black p-3 outline-none"
                                        />
                                        {validationErrors.RoomName && (
                                            <span className="text-red-500 text-sm">{validationErrors.RoomName}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                                        <label className="text-black font-semibold">Building</label>
                                        <select
                                            name="building"
                                            value={formData.building}
                                            onChange={handleChange}
                                            className="border-b-2 border-black p-3 outline-none"
                                        >
                                            {buildings.map((building) => (
                                                <option key={building._id} value={building._id}>
                                                    {building.name}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.building && (
                                            <span className="text-red-500 text-sm">{validationErrors.building}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                                <div className="flex flex-col md:w-1/2 md:pr-2">
                                    <label className="text-black font-semibold">Purpose</label>
                                    <select
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handlePurposeChange}
                                        className="border-b-2 border-black p-3 outline-none"
                                    >
                                        <option value="" disabled>Select Purpose</option>
                                        {["Conference Room", "Lecture Hall", "Storage", "Office", "Lab", "Classroom", "Library"].map((purpose) => (
                                            <option key={purpose} value={purpose}>
                                                {purpose}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.purpose && (
                                        <span className="text-red-500 text-sm">{validationErrors.purpose}</span>
                                    )}
                                </div>

                                    <div className="flex flex-col md:w-1/2 md:pl-2 md:ml-4">
                                        <label className="text-black font-semibold">Floor No.</label>
                                        <select
                                            name="floor"
                                            value={formData.floor}
                                            onChange={handleChange}
                                            className="border-b-2 border-black p-3 outline-none"
                                        >
                                            <option value=""disabled>Enter Floor Number</option>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.floor && (
                                            <span className="text-red-500 text-sm">{validationErrors.floor}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mb-4 md:flex-row md:mb-8">
                            <div className="flex flex-col md:w-3/4 md:pr-2">
                                        <label className="text-black mb-3 font-semibold">Status</label>
                                        <div className="flex gap-4 flex-wrap">
                                            {["Available", "Not Available", "Under Maintenance"].map((status) => (
                                                <button
                                                    key={status}
                                                    className={`px-4 py-2 rounded-md ${getStatusColor(status)}`}
                                                    onClick={() => handleStatusChange(status)}
                                                    type="button"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                        {validationErrors.status && (
                                            <span className="text-red-500 text-sm">{validationErrors.status}</span>
                                        )}
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

export default AddRoomModal;
