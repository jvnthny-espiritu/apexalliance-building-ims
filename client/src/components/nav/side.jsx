import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MdDashboard, MdBook, MdSettings, MdExitToApp, MdInfo } from 'react-icons/md';
export default function Sidebar() {
	const [expanded] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleLogout = () => {
		console.log("Logging out...");
		dispatch({ type: 'LOGOUT' });
		localStorage.removeItem('token');
		navigate('/login');	
		
	}
	const linkClasses = 'flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-primary hover:bg-opacity-50 hover:text-black'
	const activeLinkClasses = 'border-l-4 bg-primary bg-opacity-300 transition-colors duration-100 text-white'

	return (
		<div className={`h-screen sticky top-0 transition-width ease-in-out duration-100 font-bold`}>
			<nav className='h-full flex flex-col justify-between bg-white text-darkGray px-4 pt-20 w-60'>
				<div className='mt-5'>
					<ul className='justify-center'>
						<li>
							<NavLink to='/' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Dashboard'>
								<MdDashboard className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "" : "sr-only"}`}>Dashboard</span>
							</NavLink>
						</li>
						<li>
							<NavLink to='/catalog/buildings' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Catalog'>
								<MdBook className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "" : "sr-only"}`}>Catalog</span>
							</NavLink>
						</li>
						<li>
							<NavLink to='/reports' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Reports'>
								<MdInfo className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "" : "sr-only"}`}>Reports</span>
							</NavLink>
						</li>
					</ul>
				</div>
				<div>
					<hr />
					<ul className='mb-5'>
						<li>
							<NavLink to='/settings' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Settings'>
								<MdSettings className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "" : "sr-only"}`}>Settings</span>
							</NavLink>
						</li>
						<li>
						<ul className='sticky'>
							<button onClick={handleLogout} className='flex items-center w-full mt-4 py-2 p-1.5 rounded-lg hover:bg-primary hover:bg-opacity-5'>
								<MdExitToApp className='h-6 w-6 mx-4' />
								<span className={`${expanded ? "" : "sr-only"}`}>Logout</span>
							</button>
							</ul>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	);
}