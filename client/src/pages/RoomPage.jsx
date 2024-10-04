import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FloorSection from "../components/FloorSection";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import api from "../services/api";
import AddButton from "../components/AddButton";
import AddRoomModal from "../components/modals/AddRoomModal";

function RoomPage() {
  const { buildingId } = useParams();
  const [building, setBuilding] = useState(null);
  const [floors, setFloors] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleAddRoomModalLocal = () => {
    setIsAddRoomOpen((prev) => !prev);
  };

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
      if (selectedStatus)
        apiUrl += `${selectedType ? "&" : "?"}status=${selectedStatus}`;

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

  useEffect(() => {
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
    toggleAddRoomModalLocal();
    fetchFloors();
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
        <div className="justify-end">
        <div className="hidden md:flex justify-between mt-18 mb-5">
        <h1 className="font-bold text-3xl text-black mt-8">
          Room Catalog
        </h1>
        </div>
        <div className="flex md:hidden justify-between mt-18 pt-8 mb-5">
          <AddButton onClick={toggleAddRoomModalLocal} />
          </div>
        </div>
        {isAddRoomOpen && (
          <AddRoomModal
            isOpen={isAddRoomOpen}
            toggleModal={toggleAddRoomModalLocal}
            onRoomAdded={handleAddRoom}
          />
        )}
        <MobileFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedType={setSelectedType}
          setSelectedStatus={setSelectedStatus}
          handleAddRoom={handleAddRoom}
        />
        <div className="md:mx-3">
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

function Header({handleBack,searchQuery,setSearchQuery,setSelectedType,setSelectedStatus,}) {
  return (
    <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md">
      <div className="flex items-center bg-primary p-1 max-w-screen-auto w-full">
        <button
          onClick={handleBack}
          className="md:mx-10 md:bg-red-600 text-white font-bold text-md justify-item items-start hover:bg-white hover:border hover:border-gray-300 hover:text-red-600 md:px-4 py-0 rounded-full transition-all duration-300 flex items-center"
        >
          <FaArrowLeft className="ml-1" />
          <span className="hidden md:inline">Back</span>
        </button>
        <div className="flex-grow flex justify-center">
          <h1 className="block md:hidden font-bold text-base text-white p-2">
            Room Catalog
          </h1>
        </div>
        <AiOutlineSearch className="absolute top-0 right-0 mr-9 mt-4 text-xl md:hidden text-white" />
        <IoFilterOutline className="absolute top-0 right-0 mr-3 mt-3 text-2xl md:hidden text-white" />
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

function MobileFilters({searchQuery,setSearchQuery,setSelectedType,setSelectedStatus,handleAddRoom,}) {
  return (
    <div className="flex flex-wrap ml-3 text-sm md:hidden font-normal relative">
      <div className="w-full mb-4 mt-5">
        <div className="relative">
        </div>
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
