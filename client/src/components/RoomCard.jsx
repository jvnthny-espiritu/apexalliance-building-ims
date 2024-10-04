import React, { useState } from 'react';
import RoomModal from '../components/modals/RoomModal';

const RoomCard = ({ room, selectedType, selectedStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'Classroom':
        return 'bg-room-use-classroom';
      case 'Laboratory':
        return 'bg--room-use-laboratory';
      case 'Administrative':
        return 'bg--room-use-administrative';
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
      default:
        return '';
    }
  };

  const isMatchingType = selectedType ? room.type === selectedType : true;
  const isMatchingStatus = selectedStatus ? room.status === selectedStatus : true;

  if (!isMatchingType || !isMatchingStatus) {
    return null;
  }

  return (
    <>
      <div
        className="  w-250 md:w-[300px]height: 'fit-content'p-3 text-darkGray shadow-md m-2 rounded-lg cursor-pointer bg-white border border-darkGray"
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-start items-start font-body px-2 py-1">
          <h3 className="text-base md:text-xl text-black font-extrabold">{room.name}</h3>
          <div className="flex justify-between w-full">
            <p className="mb-2">Dimension:</p>
            <p className="mb-2">{room.dimension}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Type:</p>
            <p className={`px-3 text-center text-white mb-2 rounded-xl ${getTypeClass(room.type)}`}>
              {room.type}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Capacity:</p>
            <p className="mb-2">{room.capacity}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Status:</p>
            <div className={`px-3 text-center text-white mb-2 rounded-xl ${getStatusClass(room.status)}`}>
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
