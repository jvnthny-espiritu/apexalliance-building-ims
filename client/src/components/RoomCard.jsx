import React, { useState } from 'react';

const RoomCard = ({ room, onClick }) => {
  const getColorClass = (key) => {
    switch (key) {
      case 'laboratory':
        return 'bg-room-use-laboratory';
      case 'classroom':
        return 'bg-room-use-classroom';
      case 'administrative':
        return 'bg-room-use-administrative';
      case 'available':
        return 'bg-room-use-available';
      case 'notavailable':
        return 'bg-room-use-notavailable';
      default:
        return '';
    }
  };

  const useColorClass = getColorClass(room.use);
  const statusColorClass = getColorClass(room.status);

  return (
    <button
      className="p-5 w-auto bg-black-pearl-950 text-white shadow-md mb-2 m-2 rounded-lg"
      style={{ 
        width: '300px', 
        height: '150px',
      }}
    >
      <div className="flex flex-col justify-start items-start font-body">
        <h3 className="text-xl font-extrabold">{room.name}</h3>
        <div className="flex justify-between w-full">
          <p className="mb-2"> Dimension</p>
          <p className="mb-2 text-sm ">{room.dimension}</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="mb-2">Use</p>
          <p className={`p-1 mb-2 rounded-full text-center text-sm ${useColorClass}`}>
            {room.use}
          </p>
        </div>
        <div className="flex justify-between w-full">
          <p className="mb-2">
            Status
          </p>
          <p className={`p-0.5 mb-2 rounded-full text-sm ${statusColorClass}`}>
            {room.status}
          </p>
        </div>
      </div>
    </button>
  );
};

export default RoomCard;