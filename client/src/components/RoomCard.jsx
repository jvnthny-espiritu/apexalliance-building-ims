import React, { useState } from 'react';
import RoomModal from '../pages/RoomModal';

const RoomCard = ({ room }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colors = {
    laboratory: 'bg-purple-600',
    classroom: 'bg-green-500',
    administrative: 'bg-pink-500',
    available: 'bg-blue-500',
    notavailable: 'bg-green-500'
  };

  const useIsPredefined = room.use && colors.hasOwnProperty(room.use);
  const statusIsPredefined = room.status && colors.hasOwnProperty(room.status);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div
        className="p-3 bg-[#041527] text-white shadow-md mb-2 mx-5 rounded-lg cursor-pointer"
        style={{
          width: '300px',
          height: '150px',
        }}
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-start items-start font-body">
          <h3 className="text-xl font-extrabold">{room.name}</h3>
          <div className="flex justify-between w-full">
            <p className="mb-2"> Dimension</p>
            <p className="mb-2 ">{room.dimension}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Use</p>
            <p className={`px-3 text-center mb-2 rounded-xl ${useIsPredefined ? colors[room.use] : ''}`}>
              {room.use}
            </p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">
              Status
            </p>
            <p className={`px-3 text-center mb-2 rounded-xl ${statusIsPredefined ? colors[room.status] : ''}`}>
              {room.status}
            </p>
          </div>
        </div>
      </div>
      
      {isModalOpen && <RoomModal room={room} toggleModal={toggleModal} />}
    </>
  );
};

export default RoomCard;
