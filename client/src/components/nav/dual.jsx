import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MdDashboard, MdBook, MdSettings, MdExitToApp, MdInfo } from 'react-icons/md';
import { UserContext } from '../../contexts/UserContext';

export default function NavBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Access userRole from UserContext
    const { userRole } = useContext(UserContext);

    // Log the user role for debugging
    useEffect(() => {
        console.log('User Role:', userRole);
    }, [userRole]); // Logs whenever userRole changes

    const handleLogout = () => {
        console.log("Logging out...");
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    }

    // Common classes
    const linkClasses = 'flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-primary hover:bg-opacity-50 hover:text-black';
    const activeLinkClasses = 'border-l-4 bg-primary bg-opacity-300 transition-colors duration-100 text-white';

    const bottomLinkClasses = 'flex w-full py-1 justify-center items-center py-2 px-4 hover:bg-white hover:bg-opacity-5';
    const activeBottomLinkClasses = 'bg-white bg-opacity-10 transition-colors duration-200';

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className="hidden lg:block h-screen sticky top-0 transition-width ease-in-out duration-100 font-bold">
                <nav className='h-full flex flex-col justify-between bg-white text-darkGray px-4 pt-20 w-60'>
                    <div className='mt-5'>
                        <ul className='justify-center'>
                            {userRole === 'admin' && (
                                <li>
                                    <NavLink to='/' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Dashboard'>
                                        <MdDashboard className='h-6 w-6 mx-4' />
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>
                            )}
                            {/* Catalog is accessible for staff and guests */}
                            {(userRole === 'admin' || userRole === 'staff' || userRole === 'guest') && (
                                <li>
                                    <NavLink to='/catalog/buildings' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Catalog'>
                                        <MdBook className='h-6 w-6 mx-4' />
                                        <span>Catalog</span>
                                    </NavLink>
                                </li>
                            )}
                            {/* Reports visible only for admins */}
                            {userRole === 'admin' && (
                                <li>
                                    <NavLink to='/reports' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Reports'>
                                        <MdInfo className='h-6 w-6 mx-4' />
                                        <span>Reports</span>
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div>
                        <hr />
                        <ul className='mb-5'>
                            {/* Settings visible only for admins */}
                            {userRole === 'admin' && (
                                <li>
                                    <NavLink to='/settings' className={({ isActive }) => isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses} title='Settings'>
                                        <MdSettings className='h-6 w-6 mx-4' />
                                        <span>Settings</span>
                                    </NavLink>
                                </li>
                            )}
                            <li>
                                <button onClick={handleLogout} className='flex items-center w-full mt-4 py-2 p-1.5 rounded-lg hover:bg-primary hover:bg-opacity-5'>
                                    <MdExitToApp className='h-6 w-6 mx-4' />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* Bottom navigation for smaller screens */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full bg-primary text-white flex justify-around z-10">
                {userRole === 'admin' && (
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? `${bottomLinkClasses} ${activeBottomLinkClasses}` : bottomLinkClasses} 
                        end
                    >
                        <div className="flex flex-col items-center">
                            <MdDashboard className="h-6 w-6" />
                            <p className="text-xs">Dashboard</p>
                        </div>
                    </NavLink>
                )}

                {/* Catalog is accessible for staff and guests */}
                {(userRole === 'admin' || userRole === 'staff' || userRole === 'guest') && (
                    <NavLink 
                        to="/catalog/buildings" 
                        className={({ isActive }) => {
                            const isBuildingActive = isActive || location.pathname.startsWith('/catalog/rooms');
                            return isBuildingActive ? `${bottomLinkClasses} ${activeBottomLinkClasses}` : bottomLinkClasses;
                        }}
                    >
                        <div className="flex flex-col items-center">
                            <MdBook className="h-6 w-6" />
                            <p className="text-xs">Catalog</p>
                        </div>
                    </NavLink>
                )}

                <NavLink 
                    to="/reports" 
                    className={({ isActive }) => isActive ? `${bottomLinkClasses} ${activeBottomLinkClasses}` : bottomLinkClasses}
                >
                    {(userRole === 'admin') && (
                        <div className="flex flex-col items-center">
                            <MdInfo className="h-6 w-6" />
                            <p className="text-xs">Reports</p>
                        </div>
                    )}
                </NavLink>

                <NavLink 
                    to="/login" 
                    className={({ isActive }) => isActive ? `${bottomLinkClasses} ${activeBottomLinkClasses}` : bottomLinkClasses}
                >
                    <div className="flex flex-col items-center">
                        <MdExitToApp className="h-6 w-6" />
                        <p className="text-xs">Logout</p>
                    </div>
                </NavLink>
            </div>
        </>
    );
}