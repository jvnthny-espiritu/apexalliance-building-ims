import React, { useState, useEffect } from 'react';
import BuildingDistribution from '../components/Dashboard/BuildingDistribution'; 
import RoomTypeDistribution from '../components/Dashboard/RoomTypeDistribution';

export default function Dashboard() {
    const [totalBuildings, setTotalBuildings] = useState(null);
    const [totalRooms, setTotalRooms] = useState(null);
    const [totalAssets, setTotalAssets] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buildingsResponse = await fetch('http://localhost:5050/api/dashboard/total-buildings');
                const buildingsData = await buildingsResponse.json();
                setTotalBuildings(buildingsData.Buildings);

                const roomsResponse = await fetch('http://localhost:5050/api/dashboard/total-rooms');
                const roomsData = await roomsResponse.json();
                setTotalRooms(roomsData.Rooms);

                const assetsResponse = await fetch('http://localhost:5050/api/dashboard/total-assets');
                const assetsData = await assetsResponse.json();
                setTotalAssets(assetsData.totalAssets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex-grow h-full px-10 pb-10'>
            <div className='flex h-20 p-5 pb-5 items-center bg-gray-800 text-white'>
                <h1 className='font-bold text-2xl'>Dashboard</h1>
            </div>
            <div className='flex mt-2'>
                <div className='flex-col'>
                    <div className='w-[700px] h-96 p-5 bg-primary rounded-lg mb-5'>
                        <BuildingDistribution />
                    </div>
                    <div className='w-[700px] h-96 p-5 bg-primary rounded-lg'>
                        <RoomTypeDistribution />
                    </div>
                </div>
                <div className='flex-col flex-grow ml-5'>
                    <div className='flex h-52 text-white justify-evenly'>
                        <div className='flex w-1/3 bg-primary rounded-lg items-center justify-center'>
                            <span>Total No of Buildings: {totalBuildings}</span>
                        </div>
                        <div className='flex w-1/3 bg-primary rounded-lg items-center justify-center mx-5'>
                            <span>Total No of Rooms: {totalRooms}</span>
                        </div>
                        <div className='flex w-1/3 bg-primary rounded-lg items-center justify-center'>
                            <span>Total No of Assets: {totalAssets}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
