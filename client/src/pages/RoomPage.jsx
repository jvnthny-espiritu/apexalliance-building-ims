import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FloorSection from '../components/FloorSection';
import { AiOutlineSearch } from 'react-icons/ai';
import api from '../services/api' ;

function RoomPage() {
  const { buildingId } = useParams();
  const [floors, setFloors] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        let apiUrl = `/building/${buildingId}/rooms`;

        if (selectedType) {
          apiUrl += `?type=${selectedType}`;
        }

        if (selectedStatus) {
          apiUrl += `${selectedType ? "&" : "?"}status=${selectedStatus}`;
        }

        const response = await api.get(apiUrl);
        const floorsArray = Object.keys(response.data).map(floorNumber => ({
          buildingFloor: parseInt(floorNumber),
          rooms: response.data[floorNumber]
        }));
        setFloors(floorsArray);
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    fetchFloors();
  }, [buildingId, selectedType, selectedStatus, location.search]);

  const filteredFloors = floors.map((floor) => ({
    ...floor,
    rooms: floor.rooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="flex flex-col h-screen">
      <div className="flex bg-primary justify-between items-center p-5 md:p-17 lg:p-5">
        <h1 className="font-bold text-2xl text-white mb-3 md:mb-0 md:mr-5">Room Catalog</h1>
        <div className="flex space-x-4">
          <TypeFilter onChange={setSelectedType} />
          <StatusFilter onChange={setSelectedStatus} />
          <div className="relative">
            <input
              type="text"
              placeholder="Search room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
            />
            <AiOutlineSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-5">
        {filteredFloors.length > 0 ? (
          filteredFloors.map((floor, index) => (
            <FloorSection
              key={index}
              floorName={floor.buildingFloor}
              rooms={floor.rooms}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
            />
          ))
        ) : (
          <p className="text-center">No rooms found for this building.</p>
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
