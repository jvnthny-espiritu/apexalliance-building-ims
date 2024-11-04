import React, { useState, useEffect } from 'react';
import { FaBuilding, FaDoorOpen, FaBox } from 'react-icons/fa';
import TotalMetricCard from '../../components/dashboard/TotalMetricCard';
import BuildingChartCard from '../../components/dashboard/BuildingChartCard';
import RoomChartCard from '../../components/dashboard/RoomChartCard';
import AssetChartCard from '../../components/dashboard/AssetChartCard';
import Card from '../../components/dashboard/Card';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from '@mui/material/Skeleton';

export default function Dashboard() {
    const [totalMetrics, setTotalMetrics] = useState({ totalAssets: 0, totalBuildings: 0, totalRooms: 0 });
    const [buildingDistribution, setBuildingDistribution] = useState([]);
    const [roomDistribution, setRoomDistribution] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [assetData, setAssetData] = useState({ data1: [], data2: [], data3: [] });
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const campusResponse = await api.get('/api/campuses');
                const metricsResponse = await api.get('/api/dashboard/metrics/all');
                const buildingDistributionResponse = await api.get('/api/dashboard/metrics/building-distribution');
                const roomDistributionResponse = await api.get('/api/dashboard/metrics/room-distribution');
                const assetDistributionResponse = await api.get('/api/dashboard/metrics/asset-distribution');
                const auditLogsResponse = await api.get('/api/dashboard/audit-log');

                setCampuses(campusResponse.data);
                setTotalMetrics(metricsResponse.data);
                setBuildingDistribution(buildingDistributionResponse.data);
                setRoomDistribution(roomDistributionResponse.data);
                setAssetData(assetDistributionResponse.data);
                setAuditLogs(auditLogsResponse.data);
            } catch (error) {
                setError('Error fetching data');
                toast.error('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // // Calculate additional insights
    // const topCampus = campuses.reduce((prev, current) => (prev.totalAssets > current.totalAssets) ? prev : current, {});
    // const recentChanges = "No recent changes"; // Placeholder, replace with actual logic if available
    // const averageRoomsPerBuilding = totalMetrics.totalBuildings ? (totalMetrics.totalRooms / totalMetrics.totalBuildings).toFixed(2) : 0;
    // const averageAssetsPerRoom = totalMetrics.totalRooms ? (totalMetrics.totalAssets / totalMetrics.totalRooms).toFixed(2) : 0;

    return (
        <div className='container mx-auto mb-20 lg:mb-auto'>
            <ToastContainer />
            <div className='flex flex-col gap-4'>
                <div className='w-auto mt-24 mx-5 flex flex-col md:flex-row'>
                    <div className='grow flex-col'>
                        <div className='flex-col flex-grow'>
                            <div className='flex flex-col lg:flex-row gap-4 w-full'>
                                {loading ? (
                                    <>
                                        <Skeleton variant="rectangular" height={200} width='100%' />
                                        <Skeleton variant="rectangular" height={200} width='100%' />
                                        <Skeleton variant="rectangular" height={200} width='100%' />
                                    </>
                                ) : (
                                    <>
                                        <TotalMetricCard title="Total No of Buildings" total={totalMetrics.totalBuildings} icon={<FaBuilding />} />
                                        <TotalMetricCard title="Total No of Rooms" total={totalMetrics.totalRooms} icon={<FaDoorOpen />} />
                                        <TotalMetricCard title="Total No of Assets" total={totalMetrics.totalAssets} icon={<FaBox />} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mx-5'>
                    <div className='col-span-1 lg:col-span-2'>
                        {loading ? <Skeleton variant="rectangular" height={300} /> : <BuildingChartCard data={buildingDistribution} campuses={campuses} />}
                    </div>
                    <div className='col-span-1'>
                        {loading ? <Skeleton variant="rectangular" height={300} /> : <Card logs={auditLogs} loading={loading} />}
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mx-5 mb-5'>
                    <div className='col-span-1'>
                        {loading ? <Skeleton variant="rectangular" height={300} /> : <RoomChartCard campuses={campuses} roomDistribution={roomDistribution} />}
                    </div>
                    <div className='col-span-1'>
                        {loading ? <Skeleton variant="rectangular" height={300} /> : <AssetChartCard assetData={assetData} campuses={campuses} />}
                    </div>
                </div>
            </div>
        </div>
    );
}