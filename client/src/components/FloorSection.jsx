import React, { useState } from 'react';
import RoomCard from './RoomCard';
import api from "../services/api";

const getOrdinalIndicator = (number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

const FloorSection = ({  floorName, rooms, selectedPurpose, selectedStatus, setRooms, setSuccessMessage, setApiError }) => {
  console.log('Rooms for floor:', rooms);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
        setRooms((prevRooms) =>
            prevRooms.map((floor) => ({
                ...floor,
                rooms: floor.rooms.filter((room) => room.id !== roomId),
            }))
        );
        setSuccessMessage("Room is deleted successfully.");
    } catch (error) {
        console.error("Error updating room state after deletion:", error);
    }
};

  const filteredRooms = rooms.filter(room => {
    if (selectedPurpose && selectedStatus) {
      return room.purpose === selectedPurpose && room.status === selectedStatus;
    } else if (selectedPurpose) {
      return room.purpose === selectedPurpose;
    } else if (selectedStatus) {
      return room.status === selectedStatus;
    } else {
      return true;
    }
  });

  return (
    <div >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{getOrdinalIndicator(floorName)} Floor</h2>
        <button onClick={toggleCollapse}>
          {isCollapsed ? <span>&#9660;</span> : <span>&#9650;</span>}
        </button>
      </div>
      <hr className="my-4 border-gray-300" /> 
      {!isCollapsed && (
        <>
          {filteredRooms.length === 0 ? (
            <p className="text-gray-500">No rooms found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {filteredRooms.map((room, index) => (
                <RoomCard key={index} room={room} selectedPurpose={selectedPurpose} selectedStatus={selectedStatus} setRooms={setRooms} onDelete={handleDeleteRoom} setSuccessMessage={setSuccessMessage} setApiError={setApiError} 
                   onRoomUpdated={(updatedRoom) => {
                      const updatedRooms = rooms.map((r) =>
                          r.id === updatedRoom.id ? { ...r, ...updatedRoom } : r
                      );
                      setRooms(updatedRooms);
                      }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FloorSection;
