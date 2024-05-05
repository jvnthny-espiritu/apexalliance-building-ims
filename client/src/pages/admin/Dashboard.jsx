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

              // const roomsResponse = await api.get('/dashboard/total-rooms');
              // setTotalRooms(roomsResponse.data.Rooms);

              const assetsResponse = await api.get('/dashboard/total-assets');
              setTotalAssets(assetsResponse.data.totalAssets);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
      fetchData();
  }, []);

    return (
        <div className='flex-grow h-full p-5'>
            <div className='flex h-20 w-full p-5 pb-5 rounded-lg items-center bg-primary text-white'>
                <h1 className='font-bold text-2xl'>Dashboard</h1>
            </div>
            <div className='flex mt-2'>
                <div className='flex-col'>
                    <div className='flex-col flex-grow'>
                        <div className='flex h-52 text-white justify-evenly w-[640px] mb-2'>
                            <div className='flex w-1/3 bg-primary rounded-lg items-center justify-center'>
                              <span>Total No of Buildings: {totalBuildings}</span>
                            </div>
                            <div className='flex w-1/3 mx-2 bg-primary rounded-lg items-center justify-center'>
                              <span>Total No of Rooms: {totalRooms}</span>
                            </div>
                            <div className='flex w-1/3 bg-primary rounded-lg items-center justify-center'>
                              <span>Total No of Assets: {totalAssets}</span>
                            </div>
                        </div>
                    </div>
                    <div className='w-[640px] h-96 p-5 bg-primary rounded-lg mb-2'>
                      <BuildingDistribution />
                    </div>
                    <div className='w-[640px] h-96 p-5 bg-primary rounded-lg'>
                      {/* <RoomTypeDistribution /> */}
                      UNAVAILABLE
                    </div>
                </div>
                <div>
                  <ActivityLog />
                </div>
            </div>
        </div>
    );
}
