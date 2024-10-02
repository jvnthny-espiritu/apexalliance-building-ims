import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import BuildingCard from "../components/BuildingCard";
import AddButton from "../components/AddButton";
import api from "../services/api";

function BuildingPage() {
  const { user } = useSelector((state) => state.auth);
  const [buildings, setBuildings] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(user.campus);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [campuses, setCampuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/campus");
        const data = response.data;
        const campusNames = data.map((campus) => [campus.name, campus._id]);
        setCampuses(campusNames);
      } catch (error) {
        console.error("Error fetching campuses:", error);
        setError("Error fetching campuses");
      } finally {
        setLoading(false);
      }
    };
    fetchCampuses();
  }, []);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
          setLoading(true);
          let apiUrl = "/building?";
          if (selectedPurpose) {
              apiUrl += `purpose=${selectedPurpose}`; // Ensure this line is correct
          }
          if (selectedCampus) {
              apiUrl += `&campus=${selectedCampus}`; // Ensure this line is correct
          }
          
          console.log("Fetching buildings from:", apiUrl); // Debug URL
          const response = await api.get(apiUrl);
          
          console.log("Buildings fetched:", response.data); // Log the fetched buildings
          setBuildings(response.data);
      } catch (error) {
          console.error("Error fetching buildings:", error);
          setError("Error fetching buildings");
      } finally {
          setLoading(false);
      }
  };
  
    fetchBuildings();
  }, [selectedPurpose, selectedCampus]);

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingClick = (building) => {
    navigate(`/rooms/${building.id}`);
  };

  const handleAddBuilding = () => {
    navigate("/add-building"); 
  };

  return (
    <div className="h-screen w-auto pb-20 mt-16">
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex bg-primary justify-between items-center p-1 max-w-screen-auto w-full">
          <h1 className="font-bold text-md text-white">Building Catalog</h1>
          <div className="hidden md:flex items-center space-x-4">
            <PurposeFilter onChange={setSelectedPurpose} />
            <CampusFilter
              campuses={campuses}
              selectedCampus={selectedCampus}
              onChange={setSelectedCampus}
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap ml-3 mt-5 text-sm md:hidden font-normal relative">
        <div className="flex space-x-4 mb-4 sticky top-0">
          <div className="relative">
            <AiOutlineSearch className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
            />
          </div>
        </div>
        <div className="flex sm:ml-4 md:ml-4 mb-4 space-x-4">
          <PurposeFilter onChange={setSelectedPurpose} />
          <CampusFilter
            campuses={campuses}
            selectedCampus={selectedCampus}
            onChange={setSelectedCampus}
          />
        </div>
      </div>
      <div className="relative mx-8 md:mt-24">
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <AddButton onClick={handleAddBuilding} />
        </div>
        <div className="flex flex-wrap">
                {filteredBuildings.length === 0 ? (
                    <p className="text-white">No buildings found for the selected filters.</p>
                ) : (
                    filteredBuildings.map((building, index) => (
                        <div className="flex-none mx-2 md:mb-4" key={index}>
                            <BuildingCard
                                building={building}
                                onClick={() => handleBuildingClick(building)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
}

function CampusFilter({ campuses, selectedCampus, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedCampus}
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Campuses</option>
        {campuses.map(([name, id], index) => (
          <option key={index} value={id}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

function PurposeFilter({ onChange }) {
  const handlePurposeChange = (e) => {
    console.log("Selected Purpose:", e.target.value); 
    onChange(e.target.value);
};

  return (
    <div className="flex items-center space-x-2">
      <select
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={handlePurposeChange}
      >
        <option value="">All Purposes</option>
        <option value="Classroom">Classroom</option>
        <option value="Laboratory">Laboratory</option>
        <option value="Administrative">Administrative</option>
        <option value="Library">Library</option>
        <option value="Auditorium">Auditorium</option>
      </select>
    </div>
  );
}

export default BuildingPage;
