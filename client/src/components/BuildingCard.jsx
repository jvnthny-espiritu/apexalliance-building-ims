import React from 'react';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

const BuildingCard = ({ buildingName, year, numStory, totalRooms, uses, imgBuilding }) => {
  return (
    <div className="w-[300px] h-[150px] my-20">
      <div className="bg-primary rounded-xl shadow-lg flex-shrink-0">
      <Link to={'/catalog/room'} className="p-3 md:p-5 flex flex-col">
        <div className='building-name text-white text-[24px] md:text-2xl lg:text-[24px] font-black font-body mt-3'>
          <span className="flex items-center">
            {buildingName}
            <MdEdit className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-2" />
          </span>
        </div>
        <div className='building-details text-white font-body text-sm md:text-base lg:text-[14px] mt-2 gap-2'>
          <p>Year of Completion: <span className="ml-1">{year}</span></p>
          <p>No. of Stories: <span className="ml-1 md:ml-10">{numStory}</span></p>
          <p>Total No. of Rooms: <span className="ml-1">{totalRooms}</span></p>
          <p>Uses:</p>
          <ul className="ml-1 md:ml-3">
            {uses.map((use, index) => (
              <li key={index} className={`building-use rounded-full mt-1 md:mt-2 text-center shadow-md hover:shadow-lg ${
                index === 0 ? 'bg-[#00B178]' :
                  index === 1 ? 'bg-[#712EE1]' :
                    'bg-[#F02556]'
                }`}>
                {use}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </div>
    </div>
    
  );
};

export default BuildingCard;
