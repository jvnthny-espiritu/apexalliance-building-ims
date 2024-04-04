import React from 'react';
import { MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

const BuildingCard = ({ buildingName, year, numStory, totalRooms, uses, imgBuilding }) => {
  return (
    <div className="building-card card flex-shrink-0 w-full">
      <Link to={'/'} className="card-content p-5 flex flex-col">
        <div className='rounded-xl overflow-hidden'>
          <img src={imgBuilding} alt={`${buildingName}`} />
        </div>
        <div className='building-name text-white text-[24px] font-black font-nunito-sans'>
          <span className="flex items-center">
            {buildingName}
            <MdEdit className="w-6 h-6 ml-2" />
          </span>
        </div>
        <div className='building-details text-white font-nunito-sans text-[14px] mt-3 gap-2'>
          <p>Year of Completion: <span className="ml-1">{year}</span></p>
          <p>No. of Stories: <span className="ml-10">{numStory}</span></p>
          <p>Total No. of Rooms: <span className="ml-1">{totalRooms}</span></p>
          <p>Uses:</p>
          <ul className="ml-10">
            {uses.map((use, index) => (
              <li key={index} className={`building-use rounded-full mt-2 text-center shadow-md hover:shadow-lg ${
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
  );
};


export default BuildingCard;
