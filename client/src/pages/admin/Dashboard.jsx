import React, { useState, useEffect } from 'react';
import BuildingDistribution from '../../components/dashboard/BuildingDistribution'; 
import RoomTypeDistribution from '../../components/dashboard/RoomTypeDistribution';
import ActivityLog from '../../components/dashboard/ActivityLog';
import api from '../../services/api';

export default function Dashboard() {
    const [totalBuildings, setTotalBuildings] = useState(null);
    const [totalRooms, setTotalRooms] = useState(null);
    const [totalAssets, setTotalAssets] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const buildingsResponse = await api.get('/dashboard/total-buildings');
              setTotalBuildings(buildingsResponse.data.Buildings);

              const roomsResponse = await api.get('/dashboard/total-rooms');
              setTotalRooms(roomsResponse.data.Rooms);

              const assetsResponse = await api.get('/dashboard/total-assets');
              setTotalAssets(assetsResponse.data.totalAssets);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
  }, []);

  return (
    <div className='mb-24 md:mb-0'>
      <div className='flex-grow h-full'> 
        <div className='flex w-auto fixed top-0 z-10'>
          <div className="flex lg:fixed bg-primary justify-between items-center p-5 h-20 pb-5 md:p-17 lg:p-5 w-screen ">
              <h1 className='font-bold text-2xl text-white mb-3 md:mb-5 md:mr-5 my-auto'>Dashboard</h1>
          </div>
        </div>
      </div>
      <div className='w-auto mt-24 md:mt-24 mx-5 flex flex-col md:flex-row'>
        <div className='grow flex-col'>
          <div className='flex-col flex-grow'>
            <div className='flex h-52 gap-2 justify-evenly w-full mb-2'>
              <div className='flex flex-col w-full md:w-1/3 items-center justify-center'>
                <p className='text-5xl'>{totalBuildings || '???'}</p>
                <p className="text-xs sm:text-base">Total No of Buildings</p>
              </div>
              <div className='flex flex-col w-full md:w-1/3 items-center justify-center'>
                <p className='text-5xl'>{totalRooms || '???'}</p>
                <p className="text-xs sm:text-sm">Total No of Rooms</p>
              </div>
              <div className='flex flex-col w-full md:w-1/3 items-center justify-center'>
                <p className='text-5xl'>{totalAssets || '???'}</p>
                <p className="text-xs sm:text-base">Total No of Assets</p>
              </div>
            </div>
          </div>
          <div className='shrink w-auto h-auto p-5 mb-2'>
            <div>
              <span className='font-bold font-body text-lg'>Buidling Distribution</span>
            </div>
            <hr className='border-black' />
            <BuildingDistribution />
          </div>
          <div className='shrink w-auto h-auto p-5 mb-2'>
            <div>
              <span className='font-bold font-body text-lg'>Room Distribution</span>
            </div>
            <hr className='border-black' />
            <RoomTypeDistribution />
          </div>
        </div>
        <div className="relative flex-none right-0 md:ml-5 mt-1 md:mt-0 w-auto sm:w-auto">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}