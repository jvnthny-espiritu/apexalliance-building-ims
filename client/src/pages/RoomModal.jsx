import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const RoomModal = ({ room, toggleModal }) => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const colors = {
    laboratory: "bg-purple-600",
    classroom: "bg-green-500",
    administrative: "bg-pink-500",
    available: "bg-blue-500",
    notavailable: "bg-green-500",
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        let apiUrl = `http://localhost:5050/api/filtering/assets?roomId=${room._id}`;

        if (selectedType) {
          apiUrl += `&type=${selectedType}`;
        }

        if (selectedCondition) {
          apiUrl += `&condition=${selectedCondition}`;
        }

        if (selectedDate) {
          apiUrl += `&date=${selectedDate}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setAssets(data);
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
      <tr key={index} className="text-center bg-white">
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
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-primary bg-opacity-50">
      <div className="relative bg-primary text-white p-8 rounded-lg max-w-5xl w-full">
        <button
          className="absolute top-0 right-5 m-2 text-white text-xl cursor-pointer"
          onClick={toggleModal}
        >
          x
        </button>
        <h2 className="text-5xl font-bold mb-4">{room.name}</h2>
        <div className="mb-4">
          <p className="mb-2">Dimension: {room.dimension}</p>
          <div className="flex flex-wrap">
            <p className="mr-2">Type:</p>
            <p
              className={`px-3 text-center mb-2 mr-2 rounded-xl ${
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
              className={`px-3 text-center mb-2 rounded-xl ${
                room.status && colors.hasOwnProperty(room.status.toLowerCase())
                  ? colors[room.status.toLowerCase()]
                  : ""
              }`}
            >
              {room.status}
            </p>
          </div>
        </div>

        <hr className="border-white w-full mt-4 mb-4" />
        <p className="text- mt-4 text-4xl">Assets</p>
        <div className="mt-4 overflow-auto">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-md px-10 py-1 pl-10 focus:outline-none focus:border-blue-500 text-black"
            />
            <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

            <div className="flex flex-wrap justify-between mb-4">
              <div className="flex pb-4 pr-4">
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
                >
                  <option value="">All Types</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Appliances">Appliances</option>
                </select>
              </div>
              <div className="flex pb-4">
                <select
                  value={selectedCondition}
                  onChange={handleConditionChange}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
                >
                  <option value="">All Conditions</option>
                  <option value="Working">Working</option>
                  <option value="Not Working">Not Working</option>
                  <option value="Good">Good</option>
                  <option value="Bad">Bad</option>
                </select>
              </div>
              <div className="flex">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
                />
              </div>
            </div>

          {isLoading ? (
            <p className="text-white">Loading...</p>
          ) : (
            <>
              {furnitureAssets.length > 0 && (
                <>
                  <p className="text-xl text-white mb-2">Furniture</p>
                  <table className="text-black w-full">
                    <tbody>
                      <tr className="bg-white uppercase bg-opacity-50">
                        <th scope className="col px-6 py-2 text-white">
                          Name
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Type
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Quantity
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Serial Number
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Purchased Date
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Condition
                        </th>
                      </tr>
                      {renderFurnitureRows(furnitureAssets)}
                    </tbody>
                  </table>
                </>
              )}

              {applianceAssets.length > 0 && (
                <>
                  <p className="text-xl text-white mt-4 mb-2">Appliances</p>
                  <table className="text-black w-full">
                    <tbody>
                      <tr className="bg-white uppercase bg-opacity-50">
                        <th scope className="col px-6 py-2 text-white">
                          Name
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Type
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Quantity
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Serial Number
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Purchased Date
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Condition
                        </th>
                        <th scope className="col px-6 py-2 text-white">
                          Electric Consumption
                        </th>
                      </tr>
                      {renderAppliancesRows(applianceAssets)}
                    </tbody>
                  </table>
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
