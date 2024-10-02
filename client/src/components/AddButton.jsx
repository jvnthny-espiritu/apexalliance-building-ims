import React from "react";
import { MdAddCircleOutline } from "react-icons/md";
const AddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white font-bold text-darkGray border border-darkGray-600 hover:bg-primary hover:text-white hover:border-red-500 px-4 py-2 rounded-md flex items-center"
    >
      <MdAddCircleOutline className="mr-2 transform scale-125" />
      Create
    </button>
  );
};
export default AddButton;