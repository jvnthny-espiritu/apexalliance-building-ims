
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FloorSection from '../components/FloorSection';
import { AiOutlineSearch } from 'react-icons/ai';
import api from '../services/api' ;

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
        let apiUrl = `/room/${buildingId}/rooms-by-floor`;

        if (selectedType) {
          apiUrl += `?type=${selectedType}`;
        }

        if (selectedStatus) {
          apiUrl += `${selectedType ? '&' : '?'}status=${selectedStatus}`;
        }

        const response = await api.get(apiUrl);
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
    <div className=" overflow-y-auto h-screen sticky">
      <div className="flex w-auto sticky top-0 z-10">
        <div className="flex bg-primary justify-between items-center w-screen p-5 ">
          <h1 className="font-bold text-2xl text-white">Room Catalog</h1>
          <div className="hidden md:flex items-center space-x-4 ">
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
            </div>
          </div>
        </div>
      </div>

      {/*MOBILE RESPONSIVENESS*/}
      <div className="flex flex-wrap ml-3 mt-5 text-sm md:hidden font-normal relative">
        <div className="flex space-x-4 mb-4 sticky top-0">
          <div className="relative">
            <AiOutlineSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400 text-sm md:text-base lg:text-lg" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md pl-8 pr-2 py-1 focus:outline-none focus:border-blue-500 text-black text-sm md:text-base lg:text-lg"
            />
          </div>
        </div>
        <div className="flex sm:ml-4 md:ml-4 mb-4 space-x-4">
          <TypeFilter
            className="text-sm md:text-base lg:text-lg"
            onChange={setSelectedType}
          />
          <StatusFilter
            className="text-sm md:text-base lg:text-lg"
            onChange={setSelectedStatus}
          />
        </div>
      </div>

      <div className="mx-3">
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
