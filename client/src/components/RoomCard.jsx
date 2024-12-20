import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import api from '../services/api';
import RoomModal from '../components/modals/RoomModal';
import EditRoomModal from '../components/modals/EditRoomModal'; 
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import useRole from '../hooks/useRole';

const RoomCard = ({ room, onDelete, selectedPurpose, selectedStatus }) => {
  const { id, building, name, floor, purpose, status } = room;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const isAdmin = useRole(['admin']);
  const isStaff = useRole(['staff']);


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

  const handleRoomUpdate = (updatedRoom) => {
    setRooms((prevRooms) =>
        prevRooms.map((floor) => ({
            ...floor,
            rooms: floor.rooms.map((room) =>
                room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
            ),
        }))
    );
  };

  // Handle Delete Action 
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(false);
    console.log('Room ID:', id);
    setShowDeleteModal(true); 
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
        const response = await api.delete(`/api/rooms/${id}`);
        if (response.status === 200) {
            console.log("Delete successful:", response.data);
            onDelete(id); 
            setSuccessMessage(response.data.message || 'Room successfully deleted.');
        } else {
            throw new Error(`Unexpected response: ${response.status}`);
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        setApiError("Failed to delete room.");
    } finally {
        setShowDeleteModal(false);
        setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };
  
  const handleApiError = (errorMessage) => {
    setApiError(errorMessage);
  };
  
  const getPurposeClass = (purpose) => {
    switch (purpose) {
    }
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

  const isMatchingPurpose = selectedPurpose ? room.purpose === selectedPurpose : true;
  const isMatchingStatus = selectedStatus ? room.status === selectedStatus : true;

  if (!isMatchingPurpose || !isMatchingStatus) {
    return null;
  }

  return (
    <>
      <div
        className=" height: 'fit-content' p-3 text-darkGray shadow-md rounded-lg cursor-pointer bg-white border border-darkGray relative"
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-start items-start font-body px-2 py-1">
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
            {successMessage}
            <button
              onClick={() => setSuccessMessage("")} // Allow dismissing the message
              className="ml-4 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        )}
          <div className="flex justify-between w-full">
            <h3 className="text-base md:text-xl text-black font-extrabold">{room.name}</h3>
            {(isAdmin || isStaff) && (
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
                    {isAdmin && (
                      <li
                        onClick={handleDeleteClick}
                        className="font-light text-base px-2 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        Delete
                      </li>
                    )}
                  </ul>
                )}
              </span>
            )}
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Purpose:</p>
            <p className={`px-3 text-center text-black mb-2 rounded-xl ${getPurposeClass(room.purpose)}`}>
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
          <RoomModal room={room} toggleModal={toggleModal} onSuccessMessage={(message) => setSuccessMessage(message)} onApiError={handleApiError} />
        </div>
      )}

      {/* API Error Message */}
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
          onRoomUpdated={(updatedRoom, successMessage) => {
            handleRoomUpdate(updatedRoom); 
            setRooms(updatedRoom);    
            setSuccessMessage(successMessage);  
          }}
          onApiError={(errorMessage) => {
            setApiError(errorMessage); 
        }}
        />
      )}
    </>
  );
};

export default RoomCard;
