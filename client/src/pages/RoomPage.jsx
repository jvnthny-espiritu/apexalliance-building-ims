import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FloorSection from "../components/FloorSection";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import api from "../services/api";
import AddButton from "../components/AddButton";
import AddRoomModal from "../components/modals/AddRoomModal";
import ModalFilterRoom from "../components/modals/ModalFilterRoom";
import Filter from "../components/Filter"; 
import useRole from "../hooks/useRole";

function RoomPage() {
  const { buildingId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    purpose: [],
    status: [],
    selectedPurpose: "",
    selectedStatus: "",
    activeTab: "purpose",
    isFilterModalOpen: false,
    isSearchBoxVisible: false,
  });
  const hasRole = useRole(["admin", "staff"]);

  function toggleAddRoomModalLocal() {
    setIsAddRoomOpen((prev) => !prev);
  }

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  const fetchRooms = useCallback(async () => {
    console.log("Fetching rooms with:", { selectedPurpose, selectedStatus });
    try {
      const response = await api.get(
        `/api/rooms?building=${buildingId}&purpose=${selectedPurpose || ""}&status=${selectedStatus || ""}`
      );
      console.log("Rooms fetched:", response.data);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, [buildingId, selectedPurpose, selectedStatus]);
  
  const handleRoomUpdate = (updatedRoom) => {
    setRooms((prevRooms) =>
        prevRooms.map((floor) => ({
            ...floor,
            rooms: floor.rooms.map((room) =>
                room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
            ),
        }))
    );
  };

  useEffect(() => {
    fetchRooms();
    fetchFilterOptions();
  }, [buildingId, selectedPurpose, selectedStatus, location.search]);

  const filteredFloors = rooms.map((floor) => ({
    ...floor,
    rooms: (floor.rooms || []).filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const handleAddRoom = () => {
    toggleAddRoomModalLocal();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get("/api/rooms/filter");
      console.log("Filter options response:", response.data);
      setState((prevState) => ({
        ...prevState,
        purpose: response.data.purpose || [],
        status: response.data.status || [],
      }));
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const filterOptions = {
    purpose: {
      options: state.purpose.map((purpose) => [purpose, purpose]),
      selectedValue: selectedPurpose,
      selectedValueKey: "selectedPurpose",
    },
    status: {
      options: state.status.map((status) => [status, status]),
      selectedValue: selectedStatus,
      selectedValueKey: "selectedStatus",
    },
  };

  const handleAddRoomSuccess = () => {
    fetchRooms(); // Refresh the list
    setSuccessMessage("Room added successfully!");
    setIsAddRoomOpen(false); // Close the modal
  };

  return (
    <div className="h-screen w-auto pb-20">
    {/* Success message */}
    {successMessage && (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
        {successMessage}
        <button
            onClick={() => setSuccessMessage("")}
            className="ml-4 text-lg font-bold"
        >
            &times;
        </button>
    </div>
    )}

      {/* Error message */}
      {state.apiError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-md z-20">
          {state.apiError}
          <button
            onClick={() =>
              setState((prevState) => ({ ...prevState, apiError: "" }))
            }
            className="ml-4 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center bg-primary p-1 max-w-screen-auto w-full">
          <button
            onClick={handleBack}
            className="md:mx-30 space-x-2 md:bg-red-600 text-white font-bold text-md justify-item items-start hover:bg-red-400 hover:text-white md:px-4 py-0 rounded-full transition-all duration-300 flex items-center"
          >
            <FaArrowLeft className="ml-1" />
            <span className="hidden md:inline">Back</span>
          </button>
          <div className="flex-grow flex justify-center">
            {state.isSearchBoxVisible && (
              <div className="w-full flex items-center">

                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-5 text-white bg-primary block md:hidden w-full border-b-2 px-2 py-1 focus:outline-none focus:border-b-2"
                />
                <IoFilterOutline
                  className="block md:hidden ml-4 mr-2 top-1/2 text-3xl text-white"
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      isFilterModalOpen: true,
                    }))
                  }
                />
              </div>
            )}
            {!state.isSearchBoxVisible && (
              <div className="flex-grow flex justify-center items-center">
                <h1 className="block md:hidden font-bold text-base text-white p-2">
                  Room Catalog
                </h1>
              </div>
            )}
          </div>
          {!state.isSearchBoxVisible && (
            <>
              <AiOutlineSearch
                className="absolute top-0 right-0 mr-10 mt-4 text-xl md:hidden text-white"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    isSearchBoxVisible: !prevState.isSearchBoxVisible,
                  }))
                }
              />
              <IoFilterOutline
                className="absolute top-0 right-0 mr-3 mt-3 text-2xl md:hidden text-white"
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    isFilterModalOpen: true,
                  }))
                }
              />
            </>
          )}
          <div className="hidden md:flex items-center space-x-4">
            <Filter
                options={filterOptions.purpose.options}
                selectedValue={filterOptions.purpose.selectedValue}
                onChange={(value) => {
                  console.log("Selected purpose:", value);
                  setSelectedPurpose(value === "all" ? "" : value);
                }}
                placeholder="All Purpose"
              />
            <Filter
              options={filterOptions.status.options}
              selectedValue={filterOptions.status.selectedValue}
              onChange={(value) => {
                console.log("Selected status:", value);
                setSelectedStatus(value === "all" ? "" : value);
              }}
              placeholder="All Status"
            />
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

      <div className="mx-4 md:mx-6">
        <div className="md:relative md:mt-24">
          {hasRole && (
            <div className="justify-end md:absolute top-0 right-0 py-8 mr-8 mt-24 md:mt-0">
              <AddButton onClick={toggleAddRoomModalLocal} />
            </div>
          )}
          <h1 className="hidden md:block font-bold text-3xl text-black mt-18 py-6">
            Room Catalog
          </h1>
        </div>
        {isAddRoomOpen && (
          <AddRoomModal
            isOpen={isAddRoomOpen}
            toggleModal={toggleAddRoomModalLocal}
            onRoomAdded={handleAddRoomSuccess} 
          />
        )}

        <div className="md:mx-3">
          {filteredFloors.length > 0 ? (
            filteredFloors.map((floor, index) => (
              <FloorSection
                key={index}
                floorName={floor._id}
                rooms={floor.rooms}
                selectedPurpose={selectedPurpose}
                selectedStatus={selectedStatus}
                setRooms={setRooms}
                setSuccessMessage={setSuccessMessage}
                onRoomUpdate={handleRoomUpdate}
                setApiError={(error) => setState((prev) => ({ ...prev, apiError: error }))} 
              />
            ))
          ) : (
            <p>No rooms found for this building.</p>
          )}
        </div>
      </div>

      <ModalFilterRoom
        state={state}
        setState={setState}
        filterOptions={filterOptions}
        applyFilters={(purpose, status) => {
          setSelectedPurpose(purpose === "all" ? "" : purpose);
          setSelectedStatus(status === "all" ? "" : status);
        }}
      />
    </div>
  );
}

export default RoomPage;