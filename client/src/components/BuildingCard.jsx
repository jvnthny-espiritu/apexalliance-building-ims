import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import { getFacilityColor } from '../utils/colorUtils';


const BuildingCard = ({ building, onDelete, setSuccessMessage, setApiError }) => {
  const { _id, name, facilities } = building;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [confirmDelete, setConfirmDelete] = useState(false); // Confirmation state
  const navigate = useNavigate();

  // Toggle dropdown
  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent the Link from being triggered
    event.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

  // Handle Edit Action (redirect to edit form)
  const handleEdit = (event) => {
    event.stopPropagation();
    navigate(`/edit-building/${_id}`);
  };

  // Handle Delete Action (show modal first)
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(false);
    setShowModal(true); // Show confirmation modal
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/building/${_id}`);
      onDelete(_id); // Inform parent to update the list
      setShowModal(false); // Close modal after delete
      setSuccessMessage('Building successfully deleted.'); // Show success alert
    } catch (error) {
      setApiError('Failed to delete building.'); // Show error alert
      setShowModal(false); // Close modal even if there's an error
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowModal(false); // Close modal without deleting
  };

  // Close dropdown when clicking outside
  const handleCardClick = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
    } else {
      navigate(`/catalog/rooms/${_id}`);
    }
  };

  return (
    <div className="w-[250px] md:w-[300px] h-[185px] md:h-[250px] my-2 md:my-15 flex flex-col relative">
      <div
        className="bg-white rounded-xl shadow-lg flex-shrink-0 flex flex-col h-full border border-darkGray"
        onClick={handleCardClick}
      >
        <div className="p-3 md:p-5 flex flex-col flex-grow">
          <div className="building-name text-black text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3">
            <span className="flex items-center justify-between">
              <span className="text-black">{name}</span>
              <span onClick={toggleDropdown} className="relative cursor-pointer">
                <BsThreeDotsVertical className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2" />
                {dropdownVisible && (
                  <ul
                    className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <li
                      onClick={handleEdit}
                      className="font-light text-base px-2 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      Edit
                    </li>
                    <li
                      onClick={handleDeleteClick}
                      className="font-light text-base px-2 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Delete
                    </li>
                  </ul>
                )}
              </span>
            </span>
          </div>
          <div className="text-darkGray font-body text-sm md:text-base lg:text-[14px] mt-2 gap-2 flex-grow">
            <p className="flex justify-between font-bold">Facilities:</p>
            <ul className="ml-1 md:ml-3">
              {facilities && facilities.map((facility, index) => (
                <li
                  key={index}
                  className="building-use rounded-full mt-1 md:mt-2 text-center text-white shadow-md hover:shadow-lg"
                  style={{ backgroundColor: getFacilityColor(facility) }}
                >
                  {facility}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default BuildingCard;
