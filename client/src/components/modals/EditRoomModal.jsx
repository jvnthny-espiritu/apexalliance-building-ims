import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EditRoomModal = ({ isOpen, toggleModal, room, onRoomUpdated, onApiError }) => {
  // console.log('Room:', room);
  const [formData, setFormData] = useState({
    id: room.id,
    building: room.building,
    name: room.name,
    status: room.status,
    purpose: room.purpose,
    floor: room.floor,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        id: room.id,
        building: room.building,
        name: room.name,
        status: room.status,
        purpose: room.purpose,
        floor: room.floor,
      });
    }
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (status) => {
    setFormData((prevData) => ({
      ...prevData,
      status: status,
    }));
  };

  const handleTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      purpose: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Room Name is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
        const response = await api.put(`/api/rooms/${formData.id}`, formData);
        if (response.status === 200) {
            onRoomUpdated(response.data, "Room updated successfully!"); // Pass success message
        }
        setSuccessMessage("Room updated successfully!");
    } catch (error) {
        setApiError("Failed to update the room. Please try again.");
        onApiError("Failed to update the room. Please try again."); // Pass error message
    } finally {
        setLoading(false);
        toggleModal();
    }
  };


  const handleClose = () => {
    toggleModal();
    setFormData({
      name: room ? room.name : "",
      status: room ? room.status : "",
      purpose: room ? room.purpose : "",
    });
    setValidationErrors({});
    setSuccessMessage("");
    setApiError("");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-room-use-available';
      case 'Not Available':
        return 'bg-room-use-notAvailable';
      case 'Under Maintenance':
        return 'bg-room-use-underMaintenance';
      default:
        return '';
    }
  };

  return (
    <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50 z-10 ${isOpen ? '' : 'hidden'}`}>
      <div className="relative bg-white p-8 w-full max-w-2xl overflow-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">EDIT ROOM</h2>
          <hr className="border-b-4 border-black mb-4" />
          {apiError && <span className="text-red-500">{apiError}</span>}
          {successMessage && <span className="text-green-500">{successMessage}</span>}   
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>Room Name</label>
              <input
                purpose="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Room Name"
                className="border-b-2 border-black p-2 outline-none w-full"
              />
              {validationErrors.name && <span className="text-red-500 text-sm">{validationErrors.name}</span>}
            </div>
            <div className="mb-4">
            <label>Type</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="border-b-2 border-black p-2 outline-none w-full"
            >
              <option value="" disabled>Select Room Type</option>
              <option value="Classroom">Classroom</option>
              <option value="Library">Library</option>              
              <option value="Lab">Lab</option>              
              <option value="Storage">Storage</option>
              <option value="Office">Office</option>              
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Conference Room">Conference Room</option>
            </select>
          </div>
          </div>
          <div className="mb-4">
            <label>Status</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  formData.status === 'Available'
                    ? 'bg-room-use-available text-white'
                    : 'border border-gray-500'
                }`}
                onClick={() => handleStatusChange('Available')}
              >
                Available
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  formData.status === 'Not Available'
                    ? 'bg-room-use-notAvailable text-white'
                    : 'border border-gray-500'
                }`}
                onClick={() => handleStatusChange('Not Available')}
              >
                Not Available
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  formData.status === 'Under Maintenance'
                    ? 'bg-room-use-underMaintenance text-white'
                    : 'border border-gray-500'
                }`}
                onClick={() => handleStatusChange('Under Maintenance')}
              >
                Under Maintenance
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button purpose="submit" className={`bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
              {loading ? 'Updating...' : 'SUBMIT'}
            </button>
            <button purpose="button" className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600" onClick={handleClose}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;
