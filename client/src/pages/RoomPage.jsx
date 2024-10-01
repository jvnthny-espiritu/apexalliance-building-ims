import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FloorSection from "../components/FloorSection";
import { AiOutlineSearch } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa"; // Back icon from react-icons
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
  const navigate = useNavigate(); // To handle navigation

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

        if (selectedType) {
          apiUrl += `?type=${selectedType}`;
        }

        if (selectedStatus) {
          apiUrl += `${selectedType ? "&" : "?"}status=${selectedStatus}`;
        }

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
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="h-screen w-auto pb-20">
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex bg-primary justify-between items-center p-1 max-w-screen-auto w-full">
        <div className="flex items-center space-x-6">
  {/* Back Button */}
  <button 
    onClick={handleBack} 
    className="mx-10 bg-red-600 text-white font-bold text-xl hover:bg-white hover:border hover:border-gray-300 hover:text-red-600 px-4 py-0 rounded-full transition-all duration-300 flex items-center"
  >
    <FaArrowLeft className="mr-2" /> Back
  </button>
</div>

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

      <div className="pt-24 mx-6">
        {/* Add Room button positioned before the floor section */}
        <div className="flex justify-end mt-8 mb-4">
          <AddButton onClick={handleAddRoom} />
        </div>

        {/* Floor sections */}
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
