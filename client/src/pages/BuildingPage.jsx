import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import BuildingCard from '../components/BuildingCard';
import api from '../services/api';

function BuildingPage() {
  const { user } = useSelector((state) => state.auth);
  const [buildings, setBuildings] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(user.campus);
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/campus');
        const data = response.data;
        const campusNames = data.map(campus => [campus.name, campus._id]);
        setCampuses(campusNames);
      } catch (error) {
        console.error('Error fetching campuses:', error);
        setError('Error fetching campuses');
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
        let apiUrl = '/building?';
        if (selectedPurpose) {
          apiUrl += `&purpose=${selectedPurpose}`;
        }
        if (selectedCampus) {
          apiUrl += `&campus=${selectedCampus}`;
        }
        const response = await api.get(apiUrl);
        setBuildings(response.data);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setError('Error fetching buildings');
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, [selectedPurpose, selectedCampus]);

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuildingClick = (building) => {
    navigate(`/rooms/${building.id}`);
  };

  return (
    <div className="building-dashboard overflow-y-auto h-screen">
      <div className="flex lg:fixed bg-primary justify-between items-center p-5 h-20 pb-5 md:p-17 lg:p-5 w-screen">
        <h1 className="font-bold text-2xl text-white mb-3 md:mb-0 md:mr-5 my-auto">Building Catalog
        <div className="flex flex-wrap left-10 text-sm mt-10 lg:hidden font-normal">
          <div className="relative space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 pl-8 focus:outline-none focus:border-blue-500 text-black"
            />
            <AiOutlineSearch className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex sm:ml-4 md:ml-4 mb-4 space-x-4">
            <PurposeFilter onChange={setSelectedPurpose} />
            <CampusFilter campuses={campuses} selectedCampus={selectedCampus} onChange={setSelectedCampus} />
          </div>
         </div>
        </h1>
        
        
        <div className="flex fixed items-center space-x-4 right-10 hidden lg:flex">
          <PurposeFilter onChange={setSelectedPurpose} />
          <CampusFilter campuses={campuses} selectedCampus={selectedCampus} onChange={setSelectedCampus} />
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
      <div className="flex flex-wrap md:justify-center lg:justify-normal mt-16 mx-8">
        {filteredBuildings.length === 0 && (
          <p className="text-white">No buildings found.</p>
        )}
        {filteredBuildings.map((building, index) => (
          <div className="flex-none mx-2 md:mb-4" key={index}>
            <BuildingCard building={building} onClick={() => handleBuildingClick(building)} />
          </div>  
        ))}
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
