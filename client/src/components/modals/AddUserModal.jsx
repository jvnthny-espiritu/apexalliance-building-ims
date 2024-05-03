import React, { useState } from "react";

const AddUserModal = ({ toggleModal }) => {
  const [close, setClose] = useState(false);

  const handleClose = () => {
    setClose(true);
    if (typeof toggleModal === "function") {
      toggleModal(); // Call toggleModal to close the modal from the parent component
    }
  };

  const colors = {
    administrator: "border-2 border-indigo-600",
    staff: "border-2 border-red-600",
  };

  // If close is true, don't render the modal
  if (close) return null;

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-primary bg-opacity-50 z-10">
      <div className="relative bg-white text-black p-8 w-full max-w-md md:max-w-3xl lg:max-w-4xl">
        <button
          className="absolute top-0 right-5 m-2 text-black text-xl cursor-pointer"
          onClick={handleClose} // Call handleClose when the "x" button is clicked
        >
          x
        </button>
        <div className="flex flex-col">
          <h2 className="text-black text-xl font-bold mb-4">
            Account Registration
          </h2>
          <hr className="border-b-4 border-black mb-4" />
          <div className="mb-4">
            <div className="flex flex-col mb-4 md:flex-row md:mb-8">
              <div className="flex flex-col w-full md:w-1/2 md:pr-2">
                <label className="text-black">First Name</label>
                <input
                  type="text"
                  className="border-b-2 border-black p-3 outline-none"
                  placeholder=""
                />
              </div>
              <div className="flex flex-col w-full md:w-1/2 md:pl-2">
                <label className="text-black">Last Name</label>
                <input
                  type="text"
                  className="border-b-2 border-black p-3 outline-none"
                />
              </div>
            </div>
            <h2 className="text-black mb-2">Role</h2>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 ${colors.administrator} rounded-lg hover:text-white hover:bg-indigo-500`}
              >
                Administrator
              </button>
              <button
                className={`px-4 py-2 ${colors.staff} rounded-lg hover:text-white hover:bg-red-500`}
              >
                Staff
              </button>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-black">Email</label>
            <input
              type="email"
              className="border-b-2 border-black p-3 outline-none"
            />
          </div>
          <div className="flex flex-col mb-4 md:flex-row md:mb-8">
            <div className="flex flex-col w-full md:w-1/2 md:pr-2">
              <label className="text-black">Password</label>
              <input
                type="text"
                className="border-b-2 border-black p-3 outline-none"
                placeholder=""
              />
            </div>
            <div className="flex flex-col w-full md:w-1/2 md:pl-2">
              <label className="text-black">Confirm Password</label>
              <input
                type="text"
                className="border-b-2 border-black p-3 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="border border-primary text-black text-sm rounded-lg p-2.5 mr-4 hover:bg-primary hover:text-white"
            >
              Submit
            </button>
            <button
              type="button"
              className="border border-primary text-black text-sm rounded-lg p-2.5 hover:bg-primary hover:text-white"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
