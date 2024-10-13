import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ResponsiveBar } from '@nivo/bar';

const RoomChartCard = ({ campuses, roomDistribution }) => {
    const [selectedCampus, setSelectedCampus] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Check if the screen is mobile
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
        setShowDropdown(false); // Hide dropdown after selection
    };

    const filteredRooms = selectedCampus === 'all' 
        ? roomDistribution 
        : roomDistribution.filter(room => room.campus === selectedCampus);

    const chartData = selectedCampus === 'all'
        ? filteredRooms.reduce((acc, room) => {
            const existingCampus = acc.find(item => item.campus === room.campus);
            if (existingCampus) {
                existingCampus[room.purpose] = (existingCampus[room.purpose] || 0) + room.count;
            } else {
                acc.push({ campus: room.campus, [room.purpose]: room.count });
            }
            return acc;
        }, [])
        : filteredRooms.reduce((acc, room) => {
            const existingBuilding = acc.find(item => item.building === room.building);
            if (existingBuilding) {
                existingBuilding[room.purpose] = room.count;
            } else {
                acc.push({ building: room.building, [room.purpose]: room.count });
            }
            return acc;
        }, []);

    const keys = [...new Set(roomDistribution.map(room => room.purpose))];

    return (
        <div className='w-full p-4 md:p-7 border-primary border-4 border-opacity-50 rounded-lg shadow-lg bg-white'>
            <div className='flex flex-row w-full justify-between items-center mb-4'>
                <p className='text-lg md:text-xl font-semibold'>Room Distribution</p>
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
                        className='p-2 border border-primary rounded-lg text-sm md:text-base bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                    >
                        <option value='all'>All Campus</option>
                        {campuses.map(campus => (
                            <option key={campus._id} value={campus.name}>{campus.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <div className='h-[300px] md:h-[500px]'>
                <ResponsiveBar
                    data={chartData}
                    keys={keys}
                    indexBy={selectedCampus === 'all' ? 'campus' : 'building'}
                    margin={{ top: 40, right: 60, bottom: 80, left: 60 }}
                    padding={0.2}
                    groupMode='grouped'
                    colors={{ scheme: 'nivo' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: window.innerWidth < 768 ? 45 : 0, 
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Count',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    legends={[
                        {
                            dataFrom: 'keys',
                            anchor: 'top',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: -40,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default RoomChartCard;