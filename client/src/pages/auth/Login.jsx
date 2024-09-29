import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { login } from '../../_actions/authActions';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/img/building.jpg';
import logo from '../../assets/img/logo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    try {
      const actionResult = await dispatch(login({ username, password }));
      if (actionResult.success) {
        localStorage.setItem('token', actionResult.token);
        const user = jwtDecode(actionResult.token);
        dispatch({ type: 'SET_USER', payload: user });  
        navigate('/');
      } else {
        setErrorMessage(
          <>
            Incorrect username or password.
            <br />
            Please try again.
          </>
        );
      }
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error.response ? error.response.data : error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-20"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm z-[1]" />
      <div className="bg-white opacity-85 px-20 py-44 pt-16 pb-20 rounded-lg shadow-lg relative" style={{ zIndex: 2, minHeight: '480px' }}>
        <div className="max-w-md">
          <div className="flex justify-center">
            <img src={logo} className="h-12 w-12 sm:h-15 sm:w-15 absolute top-0 my-5" />
            <div className="ml-2 flex items-center mt-4">
              <h2 className="text-center text-lg md:text-xl lg:text-2xl font-extrabold text-primary">
                Building inventory
              </h2>
            </div>
          </div>
          <h2 className="text-center text-xs md:text-lg lg:text-xl font-normal text-black mb-6">
            Enter your details to sign in <br /> to your account
          </h2>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px flex flex-col items-center">
              <div className="mb-4 w-full">
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text" 
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl relative block px-3 py-2 bg-transparent border border-black placeholder-gray-500 text-black focus:outline-none focus:ring-primary focus:border-primary focus:border-4 focus:z-10 sm:text-sm w-full"
                  placeholder="Username"
                />
              </div>
              <div className="w-full">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl relative block px-3 py-2 bg-transparent border border-black placeholder-gray-500 text-black focus:outline-none focus:ring-indigo-500 focus:border-primary focus:border-4 focus:z-10 sm:text-sm w-full"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="group relative flex w-full justify-center py-2 px-4 text-sm font-medium rounded-xl text-white bg-primary-light hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log In 
              </button>
            </div>
          </form>
        </div>
        <div className='mt-3'>
        {errorMessage && (
              <div className="text-center text-primary-light text-sm font-semibold">
                {errorMessage}
              </div>
            )}
        </div>
      </div>
      <div
        className="text-center text-white text-xs font-semibold"
        style={{ position: 'absolute', bottom: '7%', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
      >
        <h2>Copyright ©apexalliance 2024 </h2>
      </div>
    </div>
  );
};

export default Login;
