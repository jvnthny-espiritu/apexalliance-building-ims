import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import api from "../../services/api.js";

const RoomModal = ({ room, toggleModal }) => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const colors = {
    laboratory: "bg-room-use-laboratory",
    classroom: "bg-room-use-classroom",
    administrative: "bg-room-use-administrative",
    available: "bg-room-use-available",
    notavailable: "bg-room-use-notavailable",
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        let apiUrl = `/room/${room._id}/assets?`;

        if (selectedType) {
          apiUrl += `&type=${selectedType}`;
        }

        if (selectedCondition) {
          apiUrl += `&condition=${selectedCondition}`;
        }

        if (selectedDate) {
          apiUrl += `&date=${selectedDate}`;
        }

        const response = await api.get(apiUrl);
        setAssets(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching assets:", error);
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [room._id, selectedType, selectedCondition, selectedDate]);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const renderFurnitureRows = (data) => {
    return data.map((item, index) => (
      <tr key={index} className="text-center text-black bg-white">
        <td>{item.name}</td>
        <td>{item.type}</td>
        <td>{item.quantity}</td>
        <td>{item.serialNumber}</td>
        <td>{item.purchaseDate}</td>
        <td>{item.condition}</td>
      </tr>
    ));
  };

  const renderAppliancesRows = (data) => {
    return data.map((item, index) => (
      <tr key={index} className="text-center bg-white">
        <td>{item.name}</td>
        <td>{item.type}</td>
        <td>{item.quantity}</td>
        <td>{item.serialNumber}</td>
        <td>{item.purchaseDate}</td>
        <td>{item.condition}</td>
        <td>{item.electricConsumption}</td>
      </tr>
    ));
  };

  const furnitureAssets = filteredAssets.filter(
    (asset) => asset.type === "Furniture"
  );
  const applianceAssets = filteredAssets.filter(
    (asset) => asset.type === "Appliances"
  );

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-darkGray bg-opacity-50">
      <div className="relative bg-white text-darkGray p-6 sm:p-8 rounded-lg w-full max-w-2xl sm:max-w-3xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 sm:top-5 sm:right-5 m-2 text-darkGray text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer hover:text-gray-300 transition duration-200 z-50"
          onClick={toggleModal}
        >
          x
        </button>

        <h2 className="text-3xl text-black sm:text-4xl lg:text-5xl font-bold mb-4">{room.name}</h2>
        <div className="mb-4">
          <p className="mb-2 text-sm sm:text-base">Dimension: {room.dimension}</p>
          <div className="flex flex-wrap">
            <p className="mr-2">Type:</p>
            <p
              className={`px-3 py-1 text-white text-center mb-2 mr-2 rounded-xl ${
                room.type && colors.hasOwnProperty(room.type.toLowerCase())
                  ? colors[room.type.toLowerCase()]
                  : ""
              }`}
            >
              {room.type}
            </p>
          </div>
          <div className="flex flex-wrap">
            <p className="mr-2">Status:</p>
            <p
              className={`px-3 py-1 text-white text-center mb-2 rounded-xl ${
                room.status && colors.hasOwnProperty(room.status.toLowerCase())
                  ? colors[room.status.toLowerCase()]
                  : ""
              }`}
            >
              {room.status}
            </p>
          </div>
        </div>

        <hr className="border-darkGray w-full mt-4 mb-4" />
        <p className=" text-black text-2xl sm:text-3xl lg:text-4xl mt-4">Assets</p>
        <div className="mt-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-darkGray text-black rounded-md px-10 py-1 pl-10 focus:outline-none focus:border-blue-500  w-full"
            />
            <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
            <div className="flex items-center">
              <span className="text-white mr-2">Type:</span>
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className="border border-darkGray rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
              >
                <option value="">All Types</option>
                <option value="Furniture">Furniture</option>
                <option value="Appliances">Appliances</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-white mr-2">Condition:</span>
              <select
                value={selectedCondition}
                onChange={handleConditionChange}
                className="border border-darkGray rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
              >
                <option value="">All Conditions</option>
                <option value="Working">Working</option>
                <option value="Not Working">Not Working</option>
                <option value="Good">Good</option>
                <option value="Bad">Bad</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-white mr-2">Date:</span>
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
              {furnitureAssets.length > 0 && (
                <>
                  <p className="text-lg font-semibold sm:text-xl text-black mb-2">Furniture</p>
                  <div className="overflow-x-auto">
                    <table className="text-black w-full">
                      <tbody>
                        <tr className="bg-primary text-white uppercase">
                          <th scope className="col px-3 sm:px-6 py-2 ">Name</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Type</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Quantity</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Serial Number</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Purchased Date</th>
                          <th scope className="col px-3 sm:px-6 py-2 e">Condition</th>
                        </tr>
                        {renderFurnitureRows(furnitureAssets)}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {applianceAssets.length > 0 && (
                <>
                  <p className="text-lg font-semibold sm:text-xl text-black mt-4 mb-2">Appliances</p>
                  <div className="overflow-x-auto">
                    <table className="text-black w-full">
                      <tbody>
                        <tr className="bg-primary text-white uppercase ">
                          <th scope className="col px-3 sm:px-6 py-2 ">Name</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Type</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Quantity</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Serial Number</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Purchased Date</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Condition</th>
                          <th scope className="col px-3 sm:px-6 py-2 ">Electric Consumption</th>
                        </tr>
                        {renderAppliancesRows(applianceAssets)}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {filteredAssets.length === 0 && (
                <p className="text-white">No assets found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
