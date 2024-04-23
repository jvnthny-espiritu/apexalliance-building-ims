
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FloorSection from '../components/FloorSection';
import { AiOutlineSearch } from 'react-icons/ai'; 

function RoomPage() {
  const { buildingId } = useParams();
  const [floors, setFloors] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        let apiUrl = `http://localhost:5050/api/room-floor/buildings/${buildingId}/rooms-by-floor`;

        if (selectedType) {
          apiUrl += `?type=${selectedType}`;
        }

        if (selectedStatus) {
          apiUrl += `${selectedType ? '&' : '?'}status=${selectedStatus}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setFloors(data);
      } catch (error) {
        console.error('Error fetching floors:', error);
      }
    };

    fetchFloors();
  }, [buildingId, selectedType, selectedStatus, location.search]);

  const filteredFloors = floors.map(floor => ({
    ...floor,
    rooms: floor.rooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="room-dashboard overflow-y-auto h-screen">
      <div className="flex bg-gray-800 justify-between items-center h-20 p-5 pb-5" style={{ width: '1370px' }}>
        <h1 className="font-bold text-2xl text-white">Room Catalog</h1>
        <div className="flex items-center space-x-4">
          <TypeFilter onChange={setSelectedType} />
          <StatusFilter onChange={setSelectedStatus} />
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
            />
            <AiOutlineSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="ml-4 mr-4">
        {filteredFloors.length > 0 ? (
          filteredFloors.map((floor, index) => (
            <FloorSection key={index} floorName={floor.buildingFloor} rooms={floor.rooms} selectedType={selectedType} selectedStatus={selectedStatus} />
          ))
        ) : (
          <p>No rooms found for this building.</p>
        )}
      </div>
    </div>
  );
}

function TypeFilter({ onChange }) {
  const handleTypeChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-white">Filter by Type:</span>
      <select
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={handleTypeChange}
      >
        <option value="">All Types</option>
        <option value="Classroom">Classroom</option>
        <option value="Laboratory">Laboratory</option>
        <option value="Administrative">Administrative</option>
      </select>
    </div>
  );
}

function StatusFilter({ onChange }) {
  const handleStatusChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-white">Filter by Status:</span>
      <select
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={handleStatusChange}
      >
        <option value="">All Statuses</option>
        <option value="Available">Available</option>
        <option value="Not Available">Not Available</option>
      </select>
    </div>
  );
}

export default RoomPage;
