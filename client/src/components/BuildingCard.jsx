import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import api from "../services/api";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";
import EditBuildingModal from "../components/modals/EditBuildingModal";
import useRole from "../hooks/useRole";

const BuildingCard = ({ building, onDelete }) => {
  const { _id, name, campus, yearBuilt, numberOfFloors, facilities } = building;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [facilityColorMap, setFacilityColorMap] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [facilityDropdownVisible, setFacilityDropdownVisible] = useState(false);
  const isAdmin = useRole(["admin"]);
  const isStaff = useRole(["staff"]);

  useEffect(() => {
    const facilityColors = [
      "bg-facilities-1",
      "bg-facilities-2",
      "bg-facilities-3",
      "bg-facilities-4",
      "bg-facilities-5",
    ];

    const colorMap = {};
    const facilityNames = Array.from(new Set(facilities));

    facilityNames.forEach((facility, index) => {
      colorMap[facility] = facilityColors[index % facilityColors.length];
    });

    setFacilityColorMap(colorMap);
  }, [facilities]);

  const toggleDropdown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(false);
    setShowEditModal(true);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setDropdownVisible(false);
    setShowDeleteModal(true);
  };

  const toggleFacilityDropdown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setFacilityDropdownVisible(!facilityDropdownVisible);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(`/api/buildings/${_id}`);
      if (response.status === 200) {
        console.log("API delete success:", response.data);
        onDelete(_id);
        setSuccessMessage(
          response.data.message || "Building successfully deleted."
        );
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      console.error("Delete error:", error.response || error.message);
      setApiError(error.response?.data?.error || "Failed to delete building.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleModalClose = () => {
    setShowEditModal(false);
  };

  return (
    <div className="w-[350px] h-[280px] md:h-[200px] my-8 md:my-15 flex flex-col relative">
      <div className="bg-white rounded-xl shadow-lg flex-shrink-0 flex flex-col h-full border border-darkGray">
        <Link
          to={`/catalog/rooms/${_id}`}
          className="p-3 md:p-5 flex flex-col flex-grow"
        >
          <div className="building-name text-black text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3">
            <span className="flex items-center justify-between">
              <span className="text-black">{name}</span>
              {(isAdmin || isStaff) && (
              <span
                onClick={toggleDropdown}
                className="relative cursor-pointer"
              >
                <BsThreeDotsVertical className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2" />
                {dropdownVisible && (
                  <ul
                    className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <li
                      onClick={handleEdit}
                      className="font-light text-base px-2 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                    >
                      Edit
                    </li>
                    {isAdmin && (
                      <li
                        onClick={handleDeleteClick}
                        className="font-light text-base px-2 py-2 hover:bg-red-500 hover:text-white cursor-pointer"
                      >
                        Delete
                      </li>
                    )}
                  </ul>
                )}
              </span>
              )}
            </span>
          </div>
          <div className="text-darkGray font-body text-sm md:text-base lg:text-[14px] mt-2 gap-2 flex-grow">
            <p className="flex justify-between font-bold">
              Campus: <span className="font-normal">{campus.name}</span>
            </p>
            <p className="flex justify-between font-bold">
              Year of Completion:{" "}
              <span className="font-normal">{yearBuilt}</span>
            </p>
            <p className="flex justify-between font-bold">
              No. of Floors:{" "}
              <span className="font-normal">{numberOfFloors}</span>
            </p>
            <p
              className="flex justify-between font-bold cursor-pointer"
              onClick={toggleFacilityDropdown}
            >
              Facilities:
              <span className="font-normal ml-2 text-blue-600">
                {facilityDropdownVisible ? "Unshow" : "Show"}
              </span>
            </p>
            {facilityDropdownVisible && (
              <ul className="ml-3 mt-2 absolute z-20 w-[290px]">
              {" "}
                {facilities && facilities.length > 0 ? (
                  facilities.map((facility, index) => (
                    <li
                      key={index}
                      className={`building-use rounded-full mt-1 md:mt-2 text-center text-white shadow-md hover:shadow-lg ${
                        facilityColorMap[facility] || "bg-primary"
                      }`}
                    >
                      {facility}
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500">No facilities found.</li>
                )}
              </ul>
            )}
          </div>
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-md z-20">
          {successMessage}
          <button
            onClick={() => setSuccessMessage("")}
            className="ml-4 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* API Error Message */}
      {apiError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded shadow-md z-20">
          {apiError}
          <button
            onClick={() => setApiError("")}
            className="ml-4 text-lg font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Edit Building Modal */}
      <EditBuildingModal
        isOpen={showEditModal}
        toggleModal={handleModalClose}
        building={building}
        facilities={facilities}
        onBuildingUpdated={() => {
          setSuccessMessage("Building successfully updated.");
          setShowEditModal(false);
        }}
      />
    </div>
  );
};

export default BuildingCard;
