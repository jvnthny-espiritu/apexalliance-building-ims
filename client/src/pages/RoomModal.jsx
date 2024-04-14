import React from "react";

const RoomModal = ({ room, toggleModal }) => {
  const colors = {
    laboratory: "bg-purple-600",
    classroom: "bg-green-500",
    administrative: "bg-pink-500",
    available: "bg-blue-500",
    notavailable: "bg-green-500",
  };

  const useIsPredefined = room.use && colors.hasOwnProperty(room.use);
  const statusIsPredefined = room.status && colors.hasOwnProperty(room.status);

  // Constants for table data
  const assetsData = [
    { name: "Armchair", description: "Plastic", quantity: 60 },
    { name: "Table", description: "Wooden", quantity: 1 },
    { name: "Whiteboard", description: "...", quantity: 2 },
    { name: "Fire Extinguisher", description: "...", quantity: 2 },
  ];

  const equipmentsData = [
    {
      name: "Aircon",
      description: "...",
      quantity: 2,
      consumption: "0 watts",
      status: "...",
    },
    {
      name: "Light Bulb",
      description: "...",
      quantity: 4,
      consumption: "0 watts",
      status: "...",
    },
  ];

  // Function to render table rows
  const renderRows = (data) => {
    return data.map((item, index) => (
      <tr
        key={index}
        className="text-center bg-white"
      >
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.quantity}</td>
        {item.consumption && <td>{item.consumption}</td>}
        {item.status && <td>{item.status}</td>}
      </tr>
    ));
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-primary bg-opacity-50">
      <div className="relative bg-primary text-white p-8 rounded-lg max-w-xl w-full">
        <button
          className="absolute top-0 right-5 m-2 text-white text-xl cursor-pointer"
          onClick={toggleModal}
        >
          x
        </button>
        <h2 className="text-5xl font-bold mb-4">{room.name}</h2>
        <div className="mb-4">
          <p className="mb-2"> Dimension: {room.dimension}</p>
          <div className="flex flex-wrap">
            <p className="mr-2">Use</p>
            <p
              className={`px-3 text-center mb-2 mr-2 rounded-xl ${
                useIsPredefined ? colors[room.use] : ""
              }`}
            >
             {room.use}
            </p>
            </div>
          <div className="flex flex-wrap">
            <p className="mr-2">Status</p>
            <p
              className={`px-3 text-center mb-2 rounded-xl ${
                statusIsPredefined ? colors[room.status] : ""
              }`}
            >
               {room.status}
            </p>
          </div>
        </div>

        <hr className="border-white w-full mt-4 mb-4" />
        <p className="text- mt-4 text-4xl">Assets</p>
        <div className="mt-4 overflow-auto">
        <table className="text-black w-full">
          <tbody>
            <tr className="bg-white uppercase bg-opacity-50">
              <th scope className="col px-6 py-2 text-white">
                Name
              </th>
              <th scope className="col px-6 py-2 text-white">
                Description
              </th>
              <th scope className="col px-6 py-2 text-white">
                Quantity
              </th>
            </tr>
            {renderRows(assetsData)}
          </tbody>
        </table>
      </div>
      <div className="mt-4 overflow-auto">
      <table className="text-black w-full">
        <tbody>
          <tr className="bg-blue-500 uppercase bg-opacity-50 ">
            <th scope className="col px-6 py-2 text-white">
              Name
            </th>
            <th scope className="col px-6 py-2 text-white">
              Description
            </th>
            <th scope className="col px-6 py-2 text-white">
              Quantity
            </th>
            <th scope className="col px-6 py-2 text-white">
              Consumption
            </th>
            <th scope className="col px-6 py-2 text-white">
              Status
            </th>
          </tr>
          {renderRows(equipmentsData)}
        </tbody>
      </table>
    </div>
      </div>
    </div>
  );
};

export default RoomModal;
