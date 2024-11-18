import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import api from "../../services/api.js";
import AddButton from "../AddButton"; 
import AddAssetModal from '../modals/AddAssetModal'; 

const RoomModal = ({ room, toggleModal, onAddAsset }) => { 
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAssetModalOpen, setAssetModalOpen] = useState(false); 

  const colors = {
    lab: "bg-room-type-lab",
    storage: "bg-room-type-storage",
    conference: "bg-room-type-conference",
    'Lecture Hall': "bg-room-type-lecture",
    office: "bg-room-type-office",
    available: "bg-room-use-available",
    notavailable: "bg-room-use-notavailable",
    maintenance: "bg-room-use-maintenance",
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        let apiUrl = `/api/assets?room=${room.id}`;
  
        if (selectedCategory) {
          apiUrl += `&category=${selectedCategory}`;
        }
  
        if (selectedReport) {
          apiUrl += `&report=${selectedReport}`;
        }
  
        if (selectedDate) {
          apiUrl += `&date=${selectedDate}`;
        }

        console.log("API URL:", apiUrl); // Debugging: Check the URL being called
  
        const response = await api.get(apiUrl);
        console.log('Fetched assets:', response.data);  // Debug log for fetched assets
        setAssets(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setIsLoading(false);
      }
    };
  
    fetchAssets();
  }, [room.id, selectedCategory, selectedReport, selectedDate]);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Filtered assets:', filteredAssets);  
  console.log('Asset categories:', filteredAssets.map(asset => asset.category));  

  const nonelectricAssets = filteredAssets.filter(
    (asset) => asset.category === "non-electric"  
  );
  const electricAssets = filteredAssets.filter(
    (asset) => asset.category === "electric"  
  );

  console.log('Non-electric assets:', nonelectricAssets);  
  console.log('Electric assets:', electricAssets);  

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const renderNonElectricRows = (data) => {
    console.log(data);
    return data.map((item, index) => (
      <tr key={index} className="text-center text-black bg-white">
        <td>{item.name}</td>
        <td>{item.category}</td>
        <td>{item.report}</td>
        <td>{item.status}</td>
        <td>{item.location?.name || 'N/A'}</td>
        <td>{item.purchaseDate}</td>
        <td>{item.value}</td>
        <td>{item.numberOfUnits}</td>
        <td>
          {item.nonElectricDetails ? (
            <div>
              <p>Material: {item.nonElectricDetails.material}</p>
              <p>Dimensions: {item.nonElectricDetails.dimensions}</p>
              <p>Weight: {item.nonElectricDetails.weight}</p>
            </div>
          ) : (
            'N/A'
          )}
        </td>
      </tr>
    ));
  };  

  const renderElectricRows = (data) => {
    return data.map((item, index) => (
      <tr key={index} className="text-center bg-white">
        <td>{item.name}</td>
        <td>{item.category}</td>
        <td>{item.report}</td>
        <td>{item.status}</td>
        <td>{item.location?.name || 'N/A'}</td>
        <td>{item.purchaseDate}</td>
        <td>{item.value}</td>
        <td>{item.numberOfUnits}</td>
        <td>
          {item.electricDetails ? (
            <div>
              <p>Voltage: {item.electricDetails.voltage}</p>
              <p>Power: {item.electricDetails.power}</p>
              <p>Manufacturer: {item.electricDetails.manufacturer}</p>
              <p>Warranty: {item.electricDetails.warranty}</p>
            </div>
          ) : (
            'N/A'
          )}
        </td>
      </tr>
    ));
  };

  const toggleAssetModal = () => {
    setAssetModalOpen((prev) => !prev);
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50">
      <div className="relative bg-white text-darkGray p-6 sm:p-8 rounded-lg w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <button
          className={`absolute top-3 right-3 sm:top-5 sm:right-5 m-2 text-darkGray text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer hover:text-gray-300 transition duration-200 z-50 ${isAssetModalOpen ? 'hidden' : ''}`}
          onClick={toggleModal}
        >
          x
        </button>

        <h2 className="text-3xl text-black sm:text-4xl lg:text-5xl font-bold mb-4">{room.name}</h2>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <div className="flex flex-wrap">
              <p className="mr-2">Purpose:</p>
              <p
                className={`px-3 py-1 text-white text-center mb-2 mr-2 rounded-xl ${room.purpose && colors.hasOwnProperty(room.purpose.toLowerCase()) ? colors[room.purpose.toLowerCase()] : ""}`}
              >
                {room.purpose}
              </p>
            </div>
            <div className="flex flex-wrap">
              <p className="mr-2">Status:</p>
              <p
                className={`px-3 py-1 text-white text-center mb-2 rounded-xl ${room.status && colors.hasOwnProperty(room.status.toLowerCase()) ? colors[room.status.toLowerCase()] : ""}`}
              >
                {room.status}
              </p>
            </div>
          </div>

          <AddButton onClick={toggleAssetModal} />
        </div>

        <hr className="border-darkGray w-full mt-4 mb-4" />
        <p className="text-black text-2xl sm:text-3xl lg:text-4xl mt-4">Assets</p>
        <div className="mt-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-darkGray text-black rounded-md px-10 py-1 pl-10 focus:outline-none focus:border-blue-500 w-full"
            />
            <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="flex items-center">
              <span className="text-black mr-2">Category:</span>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border border-darkGray rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
              >
                <option value="">All Category</option>
                <option value="non-electronic">Non-electronic</option>
                <option value="electronic">Electronic</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-black mr-2">Report:</span>
              <select
                value={selectedReport}
                onChange={handleReportChange}
                className="border border-darkGray rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
              >
                <option value="">All Reports</option>
                <option value="Working">Working</option>
                <option value="Not Working">Not Working</option>
                <option value="Good">Good</option>
                <option value="Bad">Bad</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-black mr-2">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border border-darkGray rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-black">Loading...</p>
          ) : (
            <>
              {nonelectricAssets.length > 0 && (
                <>
                  <p className="text-lg font-semibold sm:text-xl text-black mb-2">Non-Electric</p>
                  <div className="overflow-x-auto">
                    <table className="text-black w-full">
                      <tbody>
                        <tr className="bg-primary text-white uppercase">
                          <th className="col px-3 sm:px-6 py-2">Name</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Category</th>
                          <th scope className="col px-3 sm:px-6 py-2 e">Report</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Status</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Location</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Purchase Date</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Value</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Number of Units</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Non-Electric Details</th>
                        </tr>
                        {renderNonElectricRows(nonelectricAssets)}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {electricAssets.length > 0 && (
                <>
                  <p className="text-lg font-semibold sm:text-xl text-black mb-2">Electric</p>
                  <div className="overflow-x-auto">
                    <table className="text-black w-full">
                      <tbody>
                        <tr className="bg-primary text-white uppercase">
                          <th className="col px-3 sm:px-6 py-2">Name</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Category</th>
                          <th scope className="col px-3 sm:px-6 py-2 e">Report</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Status</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Location</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Purchase Date</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Value</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Number of Units</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Electric Details</th>
                        </tr>
                        {renderElectricRows(electricAssets)}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <AddAssetModal 
        isOpen={isAssetModalOpen} 
        toggleModal={toggleAssetModal} 
        onAssetAdded={() => {
          setSelectedCategory(''); 
          setSelectedReport(''); 
          setSelectedDate(''); 
          toggleModal();
        }} 
      />  
    </div>
    </div>
  );
};

export default RoomModal;
