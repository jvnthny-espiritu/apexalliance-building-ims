
import React from "react";
import { MdAddCircleOutline } from "react-icons/md";

const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white text-gray border border-gray-600 hover:border-blue-500 px-4 py-2 rounded-md flex items-center"
    >
      <MdAddCircleOutline className="mr-2" />
      Create
    </button>
  );
};

export default AddButton;
