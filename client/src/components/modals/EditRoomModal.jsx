import React, { useState, useEffect } from 'react';

const EditRoomModal = ({ isOpen, toggleModal, room, onRoomUpdated }) => {
    const [formData, setFormData] = useState({
        name: room ? room.name : "",
        status: room ? room.status : "",
        type: room ? room.type : "",
      });

  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        name: room.name,
        status: room.status,
        type: room.type,
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

  const handleTypeChange = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      type: type,
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
    setApiError(""); 

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (onRoomUpdated) {
        onRoomUpdated(formData);
      }

      setSuccessMessage("Room updated successfully!");
      setTimeout(() => {
        toggleModal();
      }, 2000);
    } catch (error) {
      setApiError("Failed to update the room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    toggleModal();
    setFormData({
      name: room ? room.name : "",
      status: room ? room.status : "",
      type: room ? room.type : "",
    });
    setValidationErrors({});
    setSuccessMessage("");
    setApiError("");
  };

  return (
    <div className={`fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50 z-10 ${isOpen ? '' : 'hidden'}`}>
      <div className="relative bg-white p-8 w-full max-w-2xl overflow-auto">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">EDIT ROOM</h2>
          {apiError && <span className="text-red-500">{apiError}</span>}
          {successMessage && <span className="text-green-500">{successMessage}</span>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>Room Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Room Name"
                className="border-b-2 border-black p-2 outline-none w-full"
              />
              {validationErrors.name && <span className="text-red-500 text-sm">{validationErrors.name}</span>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label>Status</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded ${formData.status === 'Available' ? 'bg-red-500 text-white' : 'border border-gray-500'}`}
                  onClick={() => handleStatusChange('Available')}
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded ${formData.status === 'Not Available' ? 'bg-red-500 text-white' : 'border border-gray-500'}`}
                  onClick={() => handleStatusChange('Not Available')}
                >
                  Not Available
                </button>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label>Type</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`px-4 py-2 rounded ${formData.type === 'Classroom' ? 'bg-red-500 text-white' : 'border border-gray-500'}`}
                onClick={() => handleTypeChange('Classroom')}
              >
                Classroom
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${formData.type === 'Laboratory' ? 'bg-red-500 text-white' : 'border border-gray-500'}`}
                onClick={() => handleTypeChange('Laboratory')}
              >
                Laboratory
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${formData.type === 'Administration' ? 'bg-red-500 text-white' : 'border border-gray-500'}`}
                onClick={() => handleTypeChange('Administration')}
              >
                Administration
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="submit" className={`bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
              {loading ? 'Updating...' : 'SUBMIT'}
            </button>
            <button type="button" className="bg-gray-500 text-white rounded-lg px-4 py-2 hover:bg-gray-600" onClick={handleClose}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal;
