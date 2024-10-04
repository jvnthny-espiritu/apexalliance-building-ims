import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import BuildingCard from "../components/BuildingCard";
import AddButton from "../components/AddButton";
import api from "../services/api";
import AddBuildingModal from "../components/modals/AddBuildingModal";
import Filter from "../components/Filter";

function BuildingPage() {
  const { user } = useSelector((state) => state.auth);
  const [state, setState] = useState({
    buildings: [],
    selectedCampus: user ? user.campus : '',
    selectedPurpose: "",
    campuses: [],
    purposes: [],
    searchQuery: "",
    loading: false,
    error: null,
    successMessage: "",
    apiError: "",
    isAddBuildingOpen: false,
  });
  const navigate = useNavigate();

  const toggleAddBuildingModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isAddBuildingOpen: !prevState.isAddBuildingOpen,
    }));
  }, []);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        const response = await api.get("/api/campuses");
        const campusNames = response.data.map((campus) => [campus.name, campus._id]);
        setState((prevState) => ({ ...prevState, campuses: campusNames }));
      } catch (error) {
        console.error("Error fetching campuses:", error);
        setState((prevState) => ({ ...prevState, error: "Error fetching campuses" }));
      } finally {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    fetchCampuses();
  }, []);

  useEffect(() => {
    if (user) {
      setState((prevState) => ({ ...prevState, selectedCampus: user.campus._id }));
    }
  }, [user]);

  useEffect(() => {
    if (user && state.selectedCampus) {
      fetchFacilities();
      fetchBuildings();
    }
  }, [state.selectedPurpose, state.selectedCampus, user]);

  const fetchFacilities = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const response = await api.get(`/api/buildings/facilities?campusId=${state.selectedCampus}`);
      const facilities = response.data.map((facility) => [facility, facility]);
      setState((prevState) => ({ ...prevState, purposes: facilities }));
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setState((prevState) => ({ ...prevState, error: "Error fetching facilities" }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.selectedCampus]);

  const fetchBuildings = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const params = new URLSearchParams();
      if (state.selectedPurpose) {
        params.append('facilities', state.selectedPurpose);
      }
      if (state.selectedCampus) {
        params.append('campus', state.selectedCampus);
      }
      const response = await api.get(`/api/buildings?${params.toString()}`);
      setState((prevState) => ({ ...prevState, buildings: response.data }));
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setState((prevState) => ({ ...prevState, error: 'Error fetching buildings' }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.selectedPurpose, state.selectedCampus]);

  const filteredBuildings = useMemo(() => {
    return state.buildings.filter((building) =>
      building.name.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }, [state.buildings, state.searchQuery]);

  const handleBuildingClick = useCallback((building) => {
    navigate(`/catalog/rooms/${building.id}`);
  }, [navigate]);

  const handleAddBuilding = useCallback(() => {
    fetchBuildings();
    toggleAddBuildingModal();
  }, [fetchBuildings, toggleAddBuildingModal]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Alert for success */}
      {state.successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
          {state.successMessage}
          <button
            onClick={() => setState((prevState) => ({ ...prevState, successMessage: "" }))}
            className="ml-4 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Alert for errors */}
      {state.apiError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-md z-20">
          {state.apiError}
          <button
            onClick={() => setState((prevState) => ({ ...prevState, apiError: "" }))}
            className="ml-4 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}

      <div className="h-screen w-auto pb-20 mt-16">
        <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md">
          <div className="flex bg-primary items-center md:justify-end p-1 max-w-screen-auto w-full">
            <h1 className="block md:hidden font-bold text-md text-white p-2 justify-items-start">
              Building Catalog
            </h1>
            <AiOutlineSearch className="absolute top-0 right-0 mr-10 mt-4 text-xl md:hidden text-white" />
            <IoFilterOutline className="absolute top-0 right-0 mr-3 mt-3 text-2xl md:hidden text-white" />
            <div className="hidden md:flex items-center space-x-4">
              <Filter
                options={state.purposes}
                selectedValue={state.selectedPurpose}
                onChange={(value) => setState((prevState) => ({ ...prevState, selectedPurpose: value }))}
                placeholder="All Purposes"
              />
              <Filter
                options={state.campuses}
                selectedValue={state.selectedCampus}
                onChange={(value) => setState((prevState) => ({ ...prevState, selectedCampus: value }))}
                placeholder="All Campuses"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search buildings..."
                  value={state.searchQuery}
                  onChange={(e) => setState((prevState) => ({ ...prevState, searchQuery: e.target.value }))}
                  className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap ml-3 mt-5 text-sm md:hidden font-normal relative">
          <div className="flex md:space-x-4 mb-4 sticky top-0">
            <div className="relative">
              <AiOutlineSearch className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search buildings..."
                value={state.searchQuery}
                onChange={(e) => setState((prevState) => ({ ...prevState, searchQuery: e.target.value }))}
                className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
          </div>
          <div className="flex sm:ml-4 md:ml-4 mb-4 space-x-4"></div>
        </div>
        <div className="md:relative mx-5 md:mx-8 md:mt-24">
          <div className="justify-end md:absolute top-0 right-0 py-8 mr-4">
            <AddButton onClick={toggleAddBuildingModal} />
          </div>
          <h1 className="hidden md:block font-bold text-3xl text-black mt-18 py-8">
            Building Catalog
          </h1>
          <div className="flex flex-wrap">
            {filteredBuildings.length === 0 && (
              <p className="text-white">No buildings found.</p>
            )}
            {filteredBuildings.map((building, index) => (
              <div className="flex-none md:mx-2 md:mb-4" key={index}>
                <BuildingCard
                  building={building}
                  onClick={() => handleBuildingClick(building)}
                  onDelete={(deletedId) =>
                    setState((prevState) => ({
                      ...prevState,
                      buildings: prevState.buildings.filter((b) => b._id !== deletedId),
                    }))
                  }
                  setSuccessMessage={(message) => setState((prevState) => ({ ...prevState, successMessage: message }))}
                  setApiError={(error) => setState((prevState) => ({ ...prevState, apiError: error }))}
                />
              </div>
            ))}
          </div>
          {state.isAddBuildingOpen && (
            <AddBuildingModal
              isOpen={state.isAddBuildingOpen}
              toggleModal={toggleAddBuildingModal}
              onBuildingAdded={handleAddBuilding}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BuildingPage;