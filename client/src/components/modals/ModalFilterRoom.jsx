import React from "react";
import { Filtermobile } from "../Filter";

function ModalFilterRoom({ state, setState, filterOptions, applyFilters }) {
  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white border border-gray-300 rounded-xl p-4 shadow-md z-20 h-[250px]">
      <div className="flex justify-end items-center">
        <button
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              isFilterModalOpen: false,
            }))
          }
          className="text-lg font-bold"
        >
          &times;
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {Object.keys(filterOptions).map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 focus:outline-none ${
              state.activeTab === tab
                ? "border-b-2 border-primary text-black"
                : "text-gray-500"
            }`}
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                activeTab: tab,
              }))
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {Object.keys(filterOptions).map(
          (tab) =>
            state.activeTab === tab && (
              <Filtermobile
                key={tab}
                options={filterOptions[tab].options}
                selectedValue={filterOptions[tab].selectedValue}
                onChange={(value) => {
                  setState((prevState) => ({
                    ...prevState,
                    [filterOptions[tab].selectedValueKey]: value,
                  }));
                  applyFilters(
                    tab === "purpose" ? value : state.selectedPurpose,
                    tab === "status" ? value : state.selectedStatus
                  );
                }}
                placeholder={`All ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
              />
            )
        )}
      </div>
    </div>
  );
}

export default ModalFilterRoom;