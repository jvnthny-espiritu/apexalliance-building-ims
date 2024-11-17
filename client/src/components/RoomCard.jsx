import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import api from '../services/api';
import RoomModal from '../components/modals/RoomModal';
import EditRoomModal from '../components/modals/EditRoomModal'; 
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

const RoomCard = ({ room, onDelete, selectedType, selectedStatus, setSuccessMessage, setApiError }) => {
  const { _id, building, name, floor, purpose, status } = room;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

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
      await api.delete(`/api/rooms/${_id}`);
      onDelete(_id); 
      setShowDeleteModal(false); 
      setSuccessMessage('Room successfully deleted.'); 
    } catch (error) {
      setApiError('Failed to delete room.');
      setShowDeleteModal(false); 
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  
  const getTypeClass = (purpose) => {
    switch (purpose) {
      case 'Lab':
        return 'bg-room-type-lab';
      case 'Storage':
        return 'bg-room-type-storage';
      case 'Office':
        return 'bg-room-type-office';
      case 'Lecture Hall':
        return 'bg-room-type-lecture';
      case 'Conference Room':
        return 'bg-room-type-conference';
      default:
        return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-room-use-available';
      case 'Not Available':
        return 'bg-room-use-notavailable';
      case 'Under Maintenance':
        return 'bg-room-use-maintenance';
      default:
        return '';
    }
  };

  const isMatchingType = selectedType ? room.purpose === selectedType : true;
  const isMatchingStatus = selectedStatus ? room.status === selectedStatus : true;

  if (!isMatchingType || !isMatchingStatus) {
    return null;
  }

  return (
    <>
      <div
        className="w-250 md:w-[300px] height: 'fit-content' p-3 text-darkGray shadow-md m-2 rounded-lg cursor-pointer bg-white border border-darkGray relative"
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-start items-start font-body px-2 py-1">
          <div className="flex justify-between w-full">
            <h3 className="text-base md:text-xl text-black font-extrabold">{room.name}</h3>
            <span onClick={toggleDropdown} className="relative cursor-pointer">
              <BsThreeDotsVertical className="w-5 h-5 md:w-6 md:h-6" />
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
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Type:</p>
            <p className={`px-3 text-center text-white mb-2 rounded-xl ${getTypeClass(room.purpose)}`}>
              {room.purpose}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Status:</p>
            <div className={`px-3 text-center text-white mb-2 rounded-xl ${getStatusClass(room.status)}`}>
              {room.status}
            </div>
          </div>
        </div>
      </div>

      {/* Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <RoomModal room={room} toggleModal={toggleModal} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Edit Room Modal */}
      {showEditModal && (
        <EditRoomModal
          isOpen={showEditModal}
          toggleModal={() => setShowEditModal(false)}
          room={room}
          onRoomUpdated={() => {
            console.log('Room updated successfully.');
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default RoomCard;
