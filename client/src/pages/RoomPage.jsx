import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import FloorSection from "../components/FloorSection";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import api from "../services/api";
import AddButton from "../components/AddButton";
import AddRoomModal from "../components/modals/AddRoomModal";
import ModalFilter from "../components/modals/ModalFilter";
import Filter from "../components/Filter"; // Assuming you have a Filter component

function RoomPage() {
  const { buildingId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    type: [],
    status: [],
    selectedType: "",
    selectedStatus: "",
    activeTab: "type",
    isFilterModalOpen: false,
    isSearchBoxVisible: false,
  });

  function toggleAddRoomModalLocal() {
    setIsAddRoomOpen((prev) => !prev);
  }

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/api/rooms?building=${buildingId}`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [buildingId, selectedType, selectedStatus, location.search]);

  const filteredFloors = rooms.map((floor) => ({
    ...floor,
    rooms: floor.rooms.filter((room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const handleAddRoom = () => {
    toggleAddRoomModalLocal();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filterOptions = {
    type: {
      options: state.type || [],
      selectedValue: state.selectedType,
      selectedValueKey: "selectedType",
    },
    status: {
      options: state.status || [],
      selectedValue: state.selectedStatus,
      selectedValueKey: "selectedStatus",
    },
  };

  return (
    <div className="h-screen w-auto pb-20">
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
              options={state.type || []}
              selectedValue={state.selectedType}
              onChange={(value) =>
                setState((prevState) => ({ ...prevState, selectedType: value }))
              }
              placeholder="All Type"
            />
            <Filter
              options={state.status || []}
              selectedValue={state.selectedStatus}
              onChange={(value) =>
                setState((prevState) => ({
                  ...prevState,
                  selectedStatus: value,
                }))
              }
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
        {state.isFilterModalOpen && (
          <ModalFilter
            state={state}
            setState={setState}
            filterOptions={filterOptions}
          />
        )}
      </div>

      <div className="mx-4 md:mx-6">
        <div className="md:relative md:mt-24">
          <div className="justify-end md:absolute top-0 right-0 py-8 mr-8 mt-24 md:mt-0">
            <AddButton onClick={toggleAddRoomModalLocal} />
          </div>

          <h1 className="hidden md:block font-bold text-3xl text-black mt-18 py-6">
            Room Catalog
          </h1>
        </div>
        {isAddRoomOpen && (
          <AddRoomModal
            isOpen={isAddRoomOpen}
            toggleModal={toggleAddRoomModalLocal}
            onRoomAdded={handleAddRoom}
          />
        )}

        <div className="md:mx-3">
          {filteredFloors.length > 0 ? (
            filteredFloors.map((floor, index) => (
              <FloorSection
                key={index}
                floorName={floor._id}
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

      {state.isFilterModalOpen && (
        <ModalFilter
          state={state}
          setState={setState}
          filterOptions={filterOptions}
        />
      )}
    </div>
  );
}

export default RoomPage;