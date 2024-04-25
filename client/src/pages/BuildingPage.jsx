import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import BuildingCard from '../components/BuildingCard';

function BuildingPage() {
  const [buildings, setBuildings] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const response = await fetch('http://localhost:5050/api/buildings');
        const data = await response.json();
        const uniqueCampuses = [...new Set(data.map(building => building.campus))];
        setCampuses(uniqueCampuses);
      } catch (error) {
        console.error('Error fetching campuses:', error);
      }
    };

    fetchCampuses();
  }, []);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        let apiUrl = 'http://localhost:5050/api/buildings';
        if (selectedPurpose) {
          apiUrl = `http://localhost:5050/api/filtering/buildings?purpose=${selectedPurpose}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        setBuildings(data);
      } catch (error) {
        console.error('Error fetching buildings:', error);
      }
    };

    fetchBuildings();
  }, [selectedPurpose]);

  const filteredBuildings = buildings.filter(building => {
    if (selectedCampus && selectedPurpose) {
      return building.campus === selectedCampus && building.purpose.includes(selectedPurpose);
    } else if (selectedCampus) {
      return building.campus === selectedCampus;
    } else if (selectedPurpose) {
      return building.purpose.includes(selectedPurpose);
    } else {
      return true;
    }
  }).filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.purpose.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingClick = (building) => {
    navigate(`/rooms/${building.id}`);
  };

  return (
    <div className="building-dashboard overflow-y-auto h-screen">
      <div className="flex flex-col md:flex-row bg-gray-800 justify-between items-center p-5">
        <h1 className="font-bold text-2xl text-white mb-3 md:mb-0 md:mr-5">Building Catalog</h1>
        <div className="flex items-center space-x-4">
          <PurposeFilter onChange={setSelectedPurpose} />
          <CampusFilter campuses={campuses} onChange={setSelectedCampus} />
          <div className="relative">
            <input
              type="text"
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
            />
            <AiOutlineSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center mt-5 mx-5">
        {filteredBuildings.length === 0 && (
          <p className="text-white">No buildings found.</p>
        )}
        {filteredBuildings.map((building, index) => (
          <div className="flex-none mx-2 mb-4" key={index}>
            <BuildingCard building={building} onClick={() => handleBuildingClick(building)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CampusFilter({ campuses, onChange }) {
  return (
    <div className="flex items-center space-x-2">
      <select
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Campuses</option>
        {campuses.map((campus, index) => (
          <option key={index} value={campus}>
            {campus}
          </option>
        ))}
      </select>
    </div>
  );
}

function PurposeFilter({ onChange }) {
  const handlePurposeChange = (e) => {
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
      </select>
    </div>
  );
}

export default BuildingPage;
