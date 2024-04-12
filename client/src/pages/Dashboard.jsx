import React from 'react';
import BuildingDistribution from '../components/Dashboard/BuildingDistribution'; 
import RoomTypeDistribution from '../components/Dashboard/RoomTypeDistribution';

export default function Dashboard() {
	return (
	  <div className='flex-grow h-full px-10 pb-10'>
		<div className='flex h-20 p-5 pb-5 items-center'>
			<span className='font-mono font-semibold text-xl'>Dashboard</span>
		</div>
		<div className='flex'>
			<div className='flex-col'>
				<div className='w-[700px] h-96 p-5 bg-primary rounded-lg mb-5'>
					<BuildingDistribution />
				</div>
				<div className='w-[700px] h-96 p-5 bg-primary rounded-lg'>
					<RoomTypeDistribution />
				</div>
			</div>
			<div className='flex-col flex-grow ml-5'>
				<div className='flex h-52 text-white justify-evenly'>
					<div className='flex w-1/3 bg-primary rounded-lg items-center justify-center'>
						<span>Total No of Buildings</span>
					</div>
					<div className='flex w-1/3 bg-primary rounded-lg items-center justify-center mx-5'>
						<span>Total No of Rooms</span>
					</div>
					<div className='flex w-1/3 bg-primary rounded-lg items-center justify-center'>
						<span>Total No of Assets</span>
					</div>
				</div>
			</div>
		</div>
	  </div>
	);
  }