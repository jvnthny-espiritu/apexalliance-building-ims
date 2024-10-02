import React, { useState } from 'react';
import RoomModal from '../components/modals/RoomModal';

const RoomCard = ({ room, selectedPurpose, selectedStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const colors = {
    laboratory: "bg-room-use-laboratory",
    classroom: "bg-room-use-classroom",
    administrative: "bg-room-use-administrative",
    library: 'bg-room-use-library',
    auditorium: 'bg-room-use-auditorium',
    lecture_hall: 'bg-room-use-lecture_hall',
    available: "bg-room-use-available",
    not_available: "bg-room-use-not_available",
    under_renovation: "bg-room-use-under_renovation",
  };

  const getPurposeClass = (purpose) => {
    return purpose && colors.hasOwnProperty(purpose.toLowerCase())
      ? colors[purpose.toLowerCase()]
      : '';
  };

  const getStatusClass = (status) => {
    return status && colors.hasOwnProperty(status.toLowerCase())
      ? colors[status.toLowerCase()]
      : '';
  };

  const isMatchingPurpose = !selectedPurpose || room.purpose.toLowerCase() === selectedPurpose.toLowerCase();
  const isMatchingStatus = !selectedStatus || room.status.toLowerCase() === selectedStatus.toLowerCase();

  if (!isMatchingPurpose || !isMatchingStatus) {
    return null; 
  }


  return (
    <>
      <div
        className="p-3 text-darkGray shadow-md m-2 rounded-lg cursor-pointer bg-white border border-darkGray"
        style={{
          width: '300px',
          height: 'fit-content',
        }}
        onClick={toggleModal}
      >
        <div className="flex flex-col justify-start items-start font-body">
          <h3 className="text-xl text-black font-extrabold">{room.name}</h3>
          <div className="flex justify-between w-full">
            <p className="mb-2">Floor:</p>
            <p className="mb-2">{room.floor}</p>
          </div>
          <div className="flex justify-between w-full">
            <p className="mb-2">Purpose:</p>
            <p className={`px-3 text-center text-white mb-2 rounded-xl ${getPurposeClass(room.purpose)}`}>
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
      
      {isModalOpen && <RoomModal room={room} toggleModal={toggleModal} />}
    </>
  );
};

export default RoomCard;
