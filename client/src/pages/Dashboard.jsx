import React from 'react';
import BuildingDistribution from '../components/Dashboard/BuildingDistribution'; 

export default function Dashboard() {
	return (
	  <div className='flex-grow h-full mx-10'>
		<section className='flex h-20 p-5 pb-5 items-center'>
			<span className='font-mono font-semibold text-xl'>Dashboard</span>
		</section>
		<section>
			<div className='w-3/4 h-96 p-5 bg-primary rounded-lg'>
				<BuildingDistribution />
			</div>
		</section>
	  </div>
	);
  }