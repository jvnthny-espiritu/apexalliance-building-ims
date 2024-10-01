import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FloorSection from "../components/FloorSection";
import { AiOutlineSearch } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import api from "../services/api";
import AddButton from "../components/AddButton";

function RoomPage() {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuildingDetails = async () => {
      try {
        const response = await api.get(`/building/${buildingId}`);
        setBuilding(response.data);
      } catch (error) {
        console.error("Error fetching building details:", error);
      }
    };

    const fetchFloors = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        let apiUrl = `/building/${buildingId}/rooms`;

        if (selectedType) apiUrl += `?type=${selectedType}`;
        if (selectedStatus) apiUrl += `${selectedType ? "&" : "?"}status=${selectedStatus}`;

        const response = await api.get(apiUrl);
        const floorsArray = Object.keys(response.data).map((floorNumber) => ({
          buildingFloor: parseInt(floorNumber),
          rooms: response.data[floorNumber],
        }));
        setFloors(floorsArray);
      } catch (error) {
        console.error("Error fetching floors:", error);
      }
    };

    fetchBuildingDetails();
    fetchFloors();
  }, [buildingId, selectedType, selectedStatus, location.search]);

  const filteredFloors = floors.map((floor) => ({
    ...floor,
    rooms: floor.rooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const handleAddRoom = () => {
    console.log("Add Room button clicked");
    // Logic for adding a room
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-auto pb-20">
      <Header
        handleBack={handleBack}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedType={setSelectedType}
        setSelectedStatus={setSelectedStatus}
      />
      <div className="pt-24 mx-6">
        <div className="hidden md:flex justify-end mt-8 mb-4">
          <AddButton onClick={handleAddRoom} />
        </div>
        <MobileFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedType={setSelectedType}
          setSelectedStatus={setSelectedStatus}
          handleAddRoom={handleAddRoom}
        />
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
    </div>
  );
}

function Header({ handleBack, searchQuery, setSearchQuery, setSelectedType, setSelectedStatus }) {
  return (
    <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md">
      <div className="flex bg-primary justify-between items-center p-1 max-w-screen-auto w-full">
        <button
          onClick={handleBack}
          className="mx-10 bg-red-600 text-white font-bold text-xl hover:bg-white hover:border hover:border-gray-300 hover:text-red-600 px-4 py-0 rounded-full transition-all duration-300 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="hidden md:flex items-center space-x-4">
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
  );
}

function MobileFilters({ searchQuery, setSearchQuery, setSelectedType, setSelectedStatus, handleAddRoom }) {
  return (
    <div className="flex flex-wrap ml-3 text-sm md:hidden font-normal relative">
      <div className="w-full mb-4 mt-5">
        <div className="relative">
          <AiOutlineSearch className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-400 text-sm md:text-base lg:text-lg" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md pl-8 pr-2 py-1 focus:outline-none focus:border-blue-500 text-black text-sm md:text-base lg:text-lg w-full"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full mb-4">
        <TypeFilter onChange={setSelectedType} />
        <StatusFilter onChange={setSelectedStatus} />
        <AddButton onClick={handleAddRoom} />
      </div>
    </div>
  );
}

function TypeFilter({ onChange }) {
  return (
    <select
      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Types</option>
      <option value="Classroom">Classroom</option>
      <option value="Laboratory">Laboratory</option>
      <option value="Administrative">Administrative</option>
    </select>
  );
}

function StatusFilter({ onChange }) {
  return (
    <select
      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Statuses</option>
      <option value="Available">Available</option>
      <option value="Not Available">Not Available</option>
    </select>
  );
}

export default RoomPage;