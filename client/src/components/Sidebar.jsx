import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdDescription, MdSettings, MdMenu, MdExitToApp } from 'react-icons/md';
import { ReactComponent as Logo } from './logo.svg';



export default function Sidebar() {
	const [expanded, setExpanded] = useState(true);

	const handleLogout = () => {
		console.log("Logging out...");
	};

	const sidebarBaseClasses = 'h-screen transition-width ease-in-out duration-300';
	const sidebarExpandedClasses = 'w-auto';
	const sidebarCollapsedClasses = 'w-auto';

	const linkClasses = 'flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5'
	const activeLinkClasses = 'border-l-4 bg-white bg-opacity-10 transition-colors duration-200'
  
	return (
		<aside className={`${sidebarBaseClasses} ${expanded ? sidebarExpandedClasses : sidebarCollapsedClasses}`}>
			<nav className='h-full flex flex-col justify-between px-5 bg-primary text-white'>
				<div>
					<div className='p-4 pb-5 flex justify-between items-center'>
						<div className={`flex items-center`}>
							<Logo className={`transition-all ease-in-out ${expanded ? 'h-10 w-10' : 'h-0 w-0' }`} />
							<span className={`transition-all ease-in-out ${expanded ? "px-5 font-mono font-semibold text-xl" : "sr-only"}`}>Building Inventory</span>
						</div>
						<button onClick={() => setExpanded((curr) => !curr)} className='p-1.5 rounded-lg hover:bg-white hover:bg-opacity-5'>
							<MdMenu className='h-7 w-7'/>
						</button>
					</div>
					<hr />
					<ul className='mt-5 justify-center'>
						<li>
							<NavLink to='/' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
								<MdDashboard className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "ml-4" : "sr-only"}`}>Dashboard</span>
							</NavLink>
						</li>
						<li>
							<NavLink to='/reports' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
								<MdDescription className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "ml-4" : "sr-only"}`}>Reports</span>
							</NavLink>
						</li>
					</ul>
				</div>
				<div>
					<hr />
					<ul className='mb-4'>
						<li>
							<NavLink to='/settings' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses}>
								<MdSettings className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "ml-4" : "sr-only"}`}>Settings</span>
							</NavLink>
						</li>
						<li>
							<button onClick={handleLogout} className='flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-white hover:bg-opacity-5'>
								<MdExitToApp className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "ml-4" : "sr-only"}`}>Logout</span>
							</button>
						</li>
					</ul>
				</div>
			</nav>
		</aside>
	);
}