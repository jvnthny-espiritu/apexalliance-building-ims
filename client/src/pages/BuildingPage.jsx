import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";

import BuildingCard from "../components/BuildingCard";
import AddButton from "../components/AddButton";
import api from "../services/api";
import AddBuildingModal from "../components/modals/AddBuildingModal";
import Filter from "../components/Filter";
import ModalFilterBuilding from "../components/modals/ModalFilterBuilding";
import useRole from "../hooks/useRole";

function BuildingPage() {
  const { user } = useSelector((state) => state.auth);
  // console.log("User:", user);
  const [state, setState] = useState({
    buildings: [],
    selectedCampus: user ? user.campus.id : "all",
    selectedPurpose: "all",
    campuses: [],
    purposes: [],
    searchQuery: "",
    loading: false,
    error: null,
    successMessage: "",
    apiError: "",
    isAddBuildingOpen: false,
    isFilterModalOpen: false,
    activeTab: "purposes", 
    isSearchBoxVisible: false,
  });

  const navigate = useNavigate();
  const hasRole = useRole(["admin", "staff"]);

  const toggleAddBuildingModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isAddBuildingOpen: !prevState.isAddBuildingOpen,
    }));
  }, []);  

  useEffect(() => {
    console.log("Modal isOpen state:", state.isAddBuildingOpen); 
  }, [state.isAddBuildingOpen]);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true }));
        const response = await api.get("/api/campuses");
        const campusNames = response.data.map((campus) => [
          campus.name,
          campus._id,
        ]);
        setState((prevState) => ({ ...prevState, campuses: campusNames }));
      } catch (error) {
        console.error("Error fetching campuses:", error);
        setState((prevState) => ({
          ...prevState,
          error: "Error fetching campuses",
        }));
      } finally {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    };

    fetchCampuses();
  }, []);

  useEffect(() => {
    if (user) {
      setState((prevState) => ({
        ...prevState,
        selectedCampus: user.campus.id,
      }));
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
      const campusId = `?campusId=${state.selectedCampus}`;
      const response = await api.get(`/api/buildings/facilities${campusId}`);
      const facilities = response.data.map((facility) => [facility, facility]);
      setState((prevState) => ({ ...prevState, purposes: facilities }));
    } catch (error) {
      console.error("Error fetching facilities:", error);
      setState((prevState) => ({
        ...prevState,
        apiError: "Error fetching facilities",
      }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.selectedCampus]);

  const fetchBuildings = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, loading: true }));
      const campusId = state.selectedCampus === 'all' ? '' : `?campus=${state.selectedCampus}`;
      const response = await api.get(`/api/buildings${campusId}`);
      setState((prevState) => ({ ...prevState, buildings: response.data }));
    } catch (error) {
      console.error("Error fetching buildings:", error);
      setState((prevState) => ({
        ...prevState,
        apiError: "Error fetching buildings",
      }));
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.selectedCampus]);

  const handleDeleteBuilding = async (buildingId) => {
    try {
      setState((prevState) => ({
        ...prevState,
        buildings: prevState.buildings.filter((building) => building._id !== buildingId),
        successMessage: "Building deleted successfully.",
      }));
      await fetchBuildings(); 
    } catch (error) {
      console.error("Error updating building state after deletion:", error);
    }
  };

  const filteredBuildings = useMemo(() => {
    return state.buildings.filter((building) => {
        const matchesName = building.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesFacility = state.selectedPurpose === 'all' || building.facilities.includes(state.selectedPurpose);
        return matchesName && matchesFacility;
    });
  }, [state.buildings, state.searchQuery, state.selectedPurpose]);

  const handleBuildingClick = useCallback(
    (building) => {
      navigate(`/catalog/rooms/${building._id}`);
    },
    [navigate]
  );

  const handleAddBuilding = useCallback(() => {
    fetchBuildings(); 
    setState((prevState) => ({
      ...prevState,
      successMessage: "Building successfully added!",
      isAddBuildingOpen: false, 
    }));
  }, [fetchBuildings]);
  

  const filterOptions = {
    purposes: {
      options: state.purposes,
      selectedValue: state.selectedPurpose,
      selectedValueKey: "selectedPurpose",
    },
    campuses: {
      options: state.campuses,
      selectedValue: state.selectedCampus,
      selectedValueKey: "selectedCampus",
    },
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Success message */}
      {state.successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
          {state.successMessage}
          <button
            onClick={() =>
              setState((prevState) => ({ ...prevState, successMessage: "" }))
            }
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

      <div className="h-screen w-auto pb-20 mt-16">
        <div className="fixed top-16 left-0 right-0 z-10 shadow-md">
          <div className="flex bg-primary items-center md:justify-end p-1 max-w-screen-auto w-full">
            {state.isSearchBoxVisible && (
              <div className="w-full flex items-center">
                <button
                  className="mx-3 pr-5 text-white text-xl"
                  onClick={() =>
                    setState((prevState) => ({
                      ...prevState,
                      isSearchBoxVisible: false,
                    }))
                  }
                >
                  <FaArrowLeft />
                </button>
                <input
                  type="text"
                  placeholder="Search buildings..."
                  value={state.searchQuery}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      searchQuery: e.target.value,
                    }))
                  }
                  className="text-white bg-primary block md:hidden w-full border-b-2 px-2 py-1 focus:outline-none focus:border-b-2 "
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
              <>
                <h1 className="block md:hidden font-bold text-md text-white p-2">
                  Building Catalog
                </h1>
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
              {/* Filters */}
              <Filter
                options={filterOptions.campuses.options}
                selectedValue={filterOptions.campuses.selectedValue}
                onChange={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    selectedCampus: value,
                  }))
                }
                placeholder="All Campuses"
              />
              <Filter
                options={filterOptions.purposes.options}
                selectedValue={filterOptions.purposes.selectedValue}
                onChange={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    selectedPurpose: value,
                  }))
                }
                placeholder="All Facilities"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search buildings..."
                  value={state.searchQuery}
                  onChange={(e) =>
                    setState((prevState) => ({
                      ...prevState,
                      searchQuery: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-nonetext-black"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:relative mx-5 md:mx-8 md:mt-24">
          {hasRole && (
            <div className="justify-end md:absolute top-0 right-0 py-8 mr-8 mt-24 md:mt-0">
              <AddButton onClick={toggleAddBuildingModal} /> 
            </div>
          )}

          <h1 className="hidden md:block font-bold text-3xl text-black mt-18 py-6">
            Building Catalog
          </h1>

          <div className="grid grid-cols-1 mt-5 wmd:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBuildings.length > 0 ? (
              filteredBuildings.map((building) => (
                <BuildingCard
                  key={building._id}
                  building={building}
                  onClick={() => handleBuildingClick(building)}
                  onDelete={() => handleDeleteBuilding(building._id)}
                  setSuccessMessage={(message) =>
                    setState((prevState) => ({ ...prevState, successMessage: message }))
                  }
                />
              ))
            ) : (
              <div>No buildings found</div>
            )}
          </div>
        </div>

        {state.isAddBuildingOpen && (
          <AddBuildingModal
            isOpen={state.isAddBuildingOpen} 
            toggleModal={toggleAddBuildingModal} 
            onBuildingAdded={handleAddBuilding} 
          />
        )}

        {state.isFilterModalOpen && (
          <ModalFilterBuilding
            state={state}
            setState={setState}
            filterOptions={filterOptions}
          />
        )}
      </div>
    </div>
  );
}

export default BuildingPage;
