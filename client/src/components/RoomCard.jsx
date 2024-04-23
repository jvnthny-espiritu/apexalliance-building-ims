import React, { useState } from 'react';
import RoomModal from '../pages/RoomModal';

const RoomCard = ({ room, selectedType, selectedStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Define classes based on room type
  const getTypeClass = (type) => {
    switch (type) {
      case 'Classroom':
        return 'bg-[#00B178]';
      case 'Laboratory':
        return 'bg-[#712EE1]';
      case 'Administrative':
        return 'bg-[#F02556]';
      default:
        return '';
    }
  };

  // Define classes based on room status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-[#005FE9]';
      case 'Not Available':
        return 'bg-[#F02556]';
      default:
        return '';
    }
  };

  // Check if the room matches the selected type and status
  const isMatchingType = selectedType ? room.type === selectedType : true;
  const isMatchingStatus = selectedStatus ? room.status === selectedStatus : true;

  // Show the room card only if it matches the selected type and status
  if (!isMatchingType || !isMatchingStatus) {
    return null;
  }

  return (
    <>
      <div
        className="p-3 text-white shadow-md m-2 rounded-lg cursor-pointer bg-[#04172D]"
        style={{
          width: '300px',
          height: 'fit-content',
        }}
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-start items-start font-body">
          <h3 className="text-xl font-extrabold">{room.name}</h3>
          <div className="flex justify-between w-full">
            <p className="mb-2">Dimension:</p>
            <p className="mb-2">{room.dimension}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Type:</p>
            <p className={`px-3 text-center mb-2 rounded-xl ${getTypeClass(room.type)}`}>
              {room.type}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Capacity:</p>
            <p className="mb-2">{room.capacity}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Status:</p>
            <div className={`px-3 text-center mb-2 rounded-xl ${getStatusClass(room.status)}`}>
              {room.status}
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && <RoomModal room={room} toggleModal={toggleModal} />}
    </>
  );
};

export default RoomCard;
