import React, { useState, useEffect } from 'react';
import { FaBuilding, FaDoorOpen, FaBox } from 'react-icons/fa';
import TotalMetricCard from '../../components/dashboard/TotalMetricCard';
import BuildingChartCard from '../../components/dashboard/BuildingChartCard';
import RoomChartCard from '../../components/dashboard/RoomChartCard';
import AssetChartCard from '../../components/dashboard/AssetChartCard';
import SummaryCard from '../../components/dashboard/SummaryCard';
import api from '../../services/api';

export default function Dashboard() {
    const [totalMetrics, setTotalMetrics] = useState({ totalAssets: 0, totalBuildings: 0, totalRooms: 0 });
    const [buildingDistribution, setBuildingDistribution] = useState([]);
    const [roomDistribution, setRoomDistribution] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [assetData, setAssetData] = useState({ data1: [], data2: [], data3: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const campusResponse = await api.get('/api/campuses');            const metricsResponse = await api.get('/api/dashboard/metrics/all');
                const buildingDistributionResponse = await api.get('/api/dashboard/metrics/building-distribution');
                const roomDistributionResponse = await api.get('/api/dashboard/metrics/room-distribution');
                const assetDistributionResponse = await api.get('/api/dashboard/metrics/asset-distribution');

                setCampuses(campusResponse.data);
                setTotalMetrics(metricsResponse.data);
                setBuildingDistribution(buildingDistributionResponse.data);
                setRoomDistribution(roomDistributionResponse.data);
                setAssetData(assetDistributionResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='container mx-auto mb-20 lg:mb-auto'>
            <div className='flex flex-col gap-4'>
                <div className='w-auto mt-24 mx-5 flex flex-col md:flex-row'>
                    <div className='grow flex-col'>
                        <div className='flex-col flex-grow'>
                            <div className='flex flex-col lg:flex-row gap-4 w-full'>
                                <TotalMetricCard title="Total No of Buildings" total={totalMetrics.totalBuildings} icon={<FaBuilding />} />
                                <TotalMetricCard title="Total No of Rooms" total={totalMetrics.totalRooms} icon={<FaDoorOpen />} />
                                <TotalMetricCard title="Total No of Assets" total={totalMetrics.totalAssets} icon={<FaBox />} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 mx-5'>
                    <div className='lg:col-span-3'>
                        <BuildingChartCard data={buildingDistribution} campuses={campuses} />
                    </div>
                    <div className='lg:col-span-1'>
                        <SummaryCard />
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mx-5 mb-5'>
                    <div className='col-span-1'>
                        <RoomChartCard campuses={campuses} roomDistribution={roomDistribution} />
                    </div>
                    <div className='col-span-1'>
                        <AssetChartCard assetData={assetData} campuses={campuses} />
                    </div>
                </div>
            </div>
        </div>
    );
}