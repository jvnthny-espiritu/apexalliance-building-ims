//LOGIN PAGE
import React, { useState } from 'react';
import image from '../assets/img/building.jpg';
import { ReactComponent as Logo } from '../assets/img/logo.svg';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to login endpoint
      const response = await axios.post('/api/auth/login', { email: username, password });
      localStorage.setItem('token', response.data.token);
      // Redirect to dashboard upon successful login
      history.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response.data);
      setError('Invalid username or password');
      setPassword('');
    }
  };

  return (
    <div
      style={{ 
        backgroundImage: `url(${image})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative'
      }}
      className="min-h-screen flex items-center justify-center"
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          backdropFilter: 'blur(5px)',
          zIndex: 1 
        }}
      />
      <div className="bg-primary opacity-95 px-20 py-40 pt-16 pb-20 rounded-lg shadow-lg relative" style={{ zIndex: 2 }}>
        <div className="max-w-md">
          <div className="flex justify-center mb-6">
            <Logo className='h-15 w-15 absolute top-0 my-5' />
            <div className="ml-2 flex items-center mt-4">
              <h2 className="text-2xl font-extrabold text-white">Building inventory</h2>
            </div>
          </div>
          <h2 className="text-center text-md font-normal text-white mb-6">Enter your details to sign in <br/> to your account</h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px flex flex-col items-center">
              <div className='mb-4 w-full'>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl relative block px-3 py-2 bg-transparent border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-primary-900 focus:border-gray-500 focus:z-10 sm:text-sm w-full"
                  placeholder="Username"
                />
              </div>
              <div className='w-full'>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl relative block px-3 py-2 bg-transparent border border-white placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-gray-500 focus:z-10 sm:text-sm w-full"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex justify-center mt-4 ">
              <button
                type="submit"
                className="group relative flex w-full justify-center py-2 px-4 border border-white text-sm font-medium rounded-xl text-black bg-white hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='text-center text-white text-xs font-semibold' style={{ position: 'absolute', bottom: '7%', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <h2>Copyright ©apexalliance 2024 </h2>
      </div>
    </div>
  );
}