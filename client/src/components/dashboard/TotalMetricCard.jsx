import React from 'react';

export default function TotalMetricCard({ title, total, icon }) {
	return (
		<div className='flex flex-col w-full min-w-fit items-center justify-center p-10 border-4 border-primary rounded-lg shadow-lg bg-white'>
			{icon && <div className='text-4xl sm:text-5xl lg:text-6xl mb-2'>{icon}</div>}
			<p className='text-4xl sm:text-5xl lg:text-6xl'>{total || '???'}</p>
			<p className="text-xs sm:text-sm md:text-sm lg:text-base">{title}</p>
		</div>
	);
}