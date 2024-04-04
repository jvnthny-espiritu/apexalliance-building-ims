import React from 'react';
// eslint-disable-next-line
import BuildingDistribution from '../components/Dashboard/BuildingDistribution'; 

export default function Dashboard() {
	return (
	  <div className='h-full w-full ml-5'>
		<section className='flex h-20 p-5 pb-5 items-center'>
			<span className='font-mono font-semibold text-xl'>Dashboard</span>
		</section>
		<section>
			<div className='w-80 h-80 p-5 bg-primary rounded-lg'>
				<BuildingDistribution />
			</div>
		</section>
	  </div>
	);
  }