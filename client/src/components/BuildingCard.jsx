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


const BuildingData = () => {
  const buildings = [
    {
      buildingName: 'CICS Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CEAFA Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CIT Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CAFAD Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CICS Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CEAFA Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CIT Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    {
      buildingName: 'CAFAD Building',
      year: 1998,
      numStory: 5,
      totalRooms: 32,
      uses: ['Classroom', 'Laboratory', 'Administrative'],
      imgBuilding: '/'
    },
    
  ];

  return (
    <div className="building-dashboard flex justify-center overflow-y-auto h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-5 mx-20">
        {buildings.map((building, index) => (
          <BuildingCard
            key={index}
            buildingName={building.buildingName}
            year={building.year}
            numStory={building.numStory}
            totalRooms={building.totalRooms}
            uses={building.uses}
            imgBuilding={building.imgBuilding}
          />
        ))}
      </div>
    </div>
  );
};

export default BuildingData;
