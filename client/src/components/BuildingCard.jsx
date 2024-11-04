import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import api from '../services/api';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import EditBuildingModal from '../components/modals/EditBuildingModal'; 

const BuildingCard = ({ building, onDelete, setSuccessMessage, setApiError }) => {
  const { _id, name, campus, yearBuilt, numberOfFloors, facilities } = building;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [facilityColorMap, setFacilityColorMap] = useState({});

  useEffect(() => {
    const facilityColors = [
      'bg-facilities-1',
      'bg-facilities-2',
      'bg-facilities-3',
      'bg-facilities-4',
      'bg-facilities-5',
    ];

    const colorMap = {};
    const facilityNames = Array.from(new Set(facilities)); // Get unique facility names

    facilityNames.forEach((facility, index) => {
      colorMap[facility] = facilityColors[index % facilityColors.length];
    });

    setFacilityColorMap(colorMap); // Set the mapping state
  }, [facilities]);

  // Toggle dropdown
  const toggleDropdown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

  // Handle Edit Action (show the modal)
  const handleEdit = (event) => {
    event.stopPropagation(); 
    event.preventDefault(); 
    setDropdownVisible(false); 
    setShowEditModal(true); 
  };

  // Handle Delete Action 
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(false);
    setShowDeleteModal(true); 
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/building/${_id}`);
      onDelete(_id); 
      setShowDeleteModal(false); 
      setSuccessMessage('Building successfully deleted.'); 
    } catch (error) {
      setApiError('Failed to delete building.');
      setShowDeleteModal(false); 
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleModalClose = () => {
    setShowEditModal(false); 
  };

  return (
    <div className="w-[300px] h-[225px] md:h-[250px] my-8 md:my-15 flex flex-col relative">
      <div className="bg-white rounded-xl shadow-lg flex-shrink-0 flex flex-col h-full border border-darkGray">
        <Link to={`/catalog/rooms/${_id}`} className="p-3 md:p-5 flex flex-col flex-grow">
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
            <p className="flex justify-between font-bold">Campus: <span className="font-normal">{campus.name}</span></p>
            <p className="flex justify-between font-bold">Year of Completion: <span className="font-normal">{yearBuilt}</span></p>
            <p className="flex justify-between font-bold">No. of Floors: <span className="font-normal">{numberOfFloors}</span></p>
            <p className="flex justify-between font-bold">Facilities:</p>
            <ul className="ml-1 md:ml-3">
              {facilities && facilities.map((facility, index) => (
                <li
                  key={index}
                  className={`building-use rounded-full mt-1 md:mt-2 text-center text-white shadow-md hover:shadow-lg ${facilityColorMap[facility] || 'bg-primary'}`} // Use mapped color
                >
                  {facility}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Edit Building Modal */}
      <EditBuildingModal
        isOpen={showEditModal}
        toggleModal={handleModalClose}
        building={building}
        facilities={facilities}
        onBuildingUpdated={() => {
          setSuccessMessage('Building successfully updated.');
          setShowEditModal(false); 
        }}
      />
    </div>
  );
};

export default BuildingCard;
