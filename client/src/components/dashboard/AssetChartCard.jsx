import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ResponsivePie } from '@nivo/pie';

const AssetChartCard = ({ assetData, campuses }) => {
    const [selectedCampus, setSelectedCampus] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCampusChange = (event) => {
        setSelectedCampus(event.target.value);
        setShowDropdown(false); 
    };

    const transformDataForChart = (data, selectedCampus) => {
        return data.map(item => {
            const filteredCampuses = selectedCampus === 'all' ? item.campuses : item.campuses.filter(campus => campus.campus === selectedCampus);
            const total = filteredCampuses.reduce((sum, campus) => sum + campus.count, 0);
            return {
                id: item.category || item.condition || item.status,
                label: item.category || item.condition || item.status,
                value: total
            };
        }).filter(item => item.value > 0);
    };

    const filteredData = {
        category: transformDataForChart(assetData.categoryDistribution || [], selectedCampus),
        status: transformDataForChart(assetData.statusDistribution || [], selectedCampus),
    };

    return (
        <div className='w-full p-4 md:p-7 border-primary border-4 rounded-lg shadow-lg bg-white'>
            <div className='flex flex-row w-full justify-between items-center mb-4'>
                <p className='text-lg md:text-xl font-semibold'>Asset Distribution</p>
                {isMobile ? (
                    <div className='relative'>
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)} 
                            className='p-2 rounded-lg text-primary opacity-50 focus:opacity-100 focus:outline-none focus:border-transparent flex items-center'
                        >
                            <FaFilter />
                        </button>
                        {showDropdown && (
                            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10'>
                                <div className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${selectedCampus === 'all' ? 'bg-gray-200' : ''}`} onClick={() => handleCampusChange({ target: { value: 'all' } })}>
                                    All Campus
                                </div>
                                {campuses.map(campus => (
                                    <div key={campus._id} className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${selectedCampus === campus.name ? 'bg-gray-200' : ''}`} onClick={() => handleCampusChange({ target: { value: campus.name } })}>
                                        {campus.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <select 
                        onChange={handleCampusChange} 
                        value={selectedCampus} 
                        className='p-2 border border-black rounded-lg text-sm md:text-base bg-white text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                    >
                        <option value='all'>All Campus</option>
                        {campuses.map(campus => (
                            <option key={campus._id} value={campus.name}>{campus.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center mb-4`}>
                <div style={{ height: 400, width: isMobile ? '100%' : '50%', position: 'relative' }}>
                    <p className='text-center font-semibold mb-2'>Category Distribution</p>
                    <ResponsivePie
                        data={filteredData.category}
                        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                        innerRadius={0}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors={{ scheme: 'nivo' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        enableArcLabels={false}
                        arcLinkLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        arcLinkLabelsLinkColor={{ from: 'color' }}
                        arcLinkLabelsOffset={4}
                        arcLinkLabelsStraightLength={10}
                        arcLinkLabelsDiagonalLength={16}
                        theme={{
                            labels: {
                                text: {
                                    fontWeight: 'bold',
                                },
                            },
                        }}
                        tooltip={({ datum }) => (
                            <div style={{ padding: '5px', background: '#fff', border: '1px solid #ccc' }}>
                                <strong>{datum.id}</strong>: {datum.value}
                            </div>
                        )}
                    />
                </div>
                <div style={{ height: 400, width: isMobile ? '100%' : '50%', position: 'relative' }}>
                    <p className='text-center font-semibold mb-2'>Status Distribution</p>
                    <ResponsivePie
                        data={filteredData.status}
                        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                        innerRadius={0}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors={{ scheme: 'set3' }}
                        borderWidth={1}
                        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        enableArcLabels={false}
                        arcLinkLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                        arcLinkLabelsLinkColor={{ from: 'color' }}
                        arcLinkLabelsOffset={4}
                        arcLinkLabelsStraightLength={10}
                        arcLinkLabelsDiagonalLength={16}
                        theme={{
                            labels: {
                                text: {
                                    fontWeight: 'bold',
                                },
                            },
                        }}
                        tooltip={({ datum }) => (
                            <div style={{ padding: '5px', background: '#fff', border: '1px solid #ccc' }}>
                                <strong>{datum.id}</strong>: {datum.value}
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssetChartCard;