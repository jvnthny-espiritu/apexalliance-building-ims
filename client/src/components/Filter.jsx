import React from "react";

function Filter({ options, selectedValue, onChange, placeholder }) {
  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedValue}
        className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 text-black"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
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
	  <div className="bg-white">
		<div className=" border border-gray-300 rounded-md">
		  {/* Optional Placeholder Display */}
		  <div className="px-2 py-1 font-bold">{placeholder}</div>
  
		  {/* Dropdown options rendered directly */}
		  {options.map(([label, value], index) => (
			<div
			  key={index}
			  className={`px-2 py-1 hover:bg-primary-light cursor-pointer ${
				selectedValue === value ? "bg-primary-dark font-semibold" : ""
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