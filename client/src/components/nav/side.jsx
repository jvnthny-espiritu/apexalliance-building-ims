export default function Sidebar() {
	const [expanded, setExpanded] = useState(true);
	const [disableToggle, setDisableToggle] = useState(false);
  
	useEffect(() => {
	  const handleResize = () => {
		if (window.innerWidth <= 1250) {
		  setExpanded(false);
		  setDisableToggle(true);
		} else {
		  setExpanded(true);
		  setDisableToggle(false);
		}
	  };
  
	  window.addEventListener('resize', handleResize);
  
	  return () => {
		window.removeEventListener('resize', handleResize);
	  };
	}, []);
  
	return (
	  <div className={`h-screen sticky top-[80px] transition-width ease-in-out duration-300 ${expanded ? 'w-1/5' : 'w-auto'}`}>
		<nav className='h-full flex flex-col justify-between px-5 bg-white text-gray'>
		  <div>
			<div className='w-full p-4 pb-5 inline-flex justify-between items-center mb-4'>
			  <div className={`inline-flex items-center`}>
				<Logo className={`transition-all ease-in-out ${expanded ? 'h-10 w-10' : 'h-0 w-0'}`} />
				<span className={`transition-all ease-in-out ${expanded ? "px-5 font-mono font-semibold" : "sr-only"}`}>Building Inventory</span>
			  </div>
			  {!disableToggle && (
				<button onClick={() => setExpanded((curr) => !curr)} className='p-1.5 rounded-lg hover:bg-gray-200'>
				  <MdMenu className='h-7 w-7' />
				</button>
			  )}
			</div>
			<hr />
			<ul className='mt-6 justify-center'>
			  <li>
				<NavLink to='/' className={({ isActive }) => isActive ? `flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-gray-200 border-l-4 bg-primary transition-colors duration-200 text-white` : 'flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-gray-200'} title='Dashboard'>
				  <MdDashboard className='h-6 w-6 mx-4' />
				  <span className={`${expanded ? "" : "sr-only"}`}>Dashboard</span>
				</NavLink>
			  </li>
			  <li>
				<NavLink to='/catalog/building' className={({ isActive }) => isActive ? `flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-gray-200 border-l-4 bg-primary transition-colors duration-200 text-white` : 'flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-gray-200'} title='Catalog'>
				  <MdBook className='h-6 w-6 mx-4' />
				  <span className={`${expanded ? "" : "sr-only"}`}>Catalog</span>
				</NavLink>
			  </li>
			</ul>
		  </div>
		  <div>
			<hr />
			<ul className='mb-4'>
			  <li>
				<NavLink to='/settings' className={({ isActive }) => isActive ? `flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-gray-200 border-l-4 bg-primary transition-colors duration-200 text-white` : 'flex items-center mt-4 py-2 p-1.5 rounded-lg rounded-l-none hover:bg-gray-200'} title='Settings'>
				  <MdSettings className='h-6 w-6 mx-4' />
				  <span className={`${expanded ? "" : "sr-only"}`}>Settings</span>
				</NavLink>
			  </li>
			  <li>
				<button onClick={handleLogout} className='flex items-center w-full mt-4 py-2 p-1.5 rounded-lg hover:bg-gray-200'>
				  <MdExitToApp className='h-6 w-6 mx-4' />
				  <span className={`${expanded ? "" : "sr-only"}`}>Logout</span>
				</button>
			  </li>
			</ul>
		  </div>
		</nav>
	  </div>
	);
  }
  