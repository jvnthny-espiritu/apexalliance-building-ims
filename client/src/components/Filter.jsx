import React from "react";

function Filter({ options, selectedValue, onChange, placeholder }) {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedValue}
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">{placeholder}</option>
        {options.map(([label, value], index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Filtermobile({ options, selectedValue, onChange, placeholder }) {
	return (
	  <div className="w-full bg-white">
		<div className="max-h-[200px] overflow-y-auto border border-gray-300 rounded-md bg-white relative z-10">
		  {/* Placeholder for "All" */}
		  <div
			className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
			  selectedValue === "all" ? "bg-blue-100 font-semibold" : ""
			}`}
			onClick={() => onChange("all")}
		  >
			{placeholder}
		  </div>
  
		  {/* Render Dropdown Options */}
		  {options.map(([label, value], index) => (
			<div
			  key={index}
			  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
				selectedValue === value ? "bg-blue-100 font-semibold" : ""
			  }`}
			  onClick={() => onChange(value)}
			>
			  {label}
			</div>
		  ))}
		</div>
	  </div>
	);
  }

export {Filtermobile} ;
export default Filter;