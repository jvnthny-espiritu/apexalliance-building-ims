import React, { useState } from 'react';
import BuildingCard from '../components/BuildingCard';


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

export default function BuildingPage() {
  return (
    <div className="building-dashboard overflow-y-auto h-screen">
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap justify-center items-center mt-5 mx-5">
          {buildings.map((building, index) => (
            <div className="flex-none mx-2 mb-4" key={index}>
              <BuildingCard
                buildingName={building.buildingName}
                year={building.year}
                numStory={building.numStory}
                totalRooms={building.totalRooms}
                uses={building.uses}
                imgBuilding={building.imgBuilding}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}