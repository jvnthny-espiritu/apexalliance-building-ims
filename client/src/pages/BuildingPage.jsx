import React from 'react';
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
	  <div className="flex-grow justify-center overflow-y-auto h-screen">
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