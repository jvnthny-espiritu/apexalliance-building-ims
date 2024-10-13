import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ResponsiveRadialBar } from '@nivo/radial-bar';

const BuildingChartCard = ({ data, campuses }) => {
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

    const filteredData = selectedCampus === 'all' 
        ? data 
        : data.filter(item => item.campus === selectedCampus);

    const chartData = filteredData.map(item => ({
        id: item.campus,
        data: item.facilities.map(facility => ({
            x: facility.facility,
            y: facility.count
        }))
    }));

    return (
        <div className='w-full p-4 md:p-7 border-primary border-4 border-opacity-50 rounded-lg shadow-lg bg-white'>
            <div className='flex flex-row w-full justify-between items-center mb-4'>
                <p className='text-lg md:text-xl font-semibold'>Building Distribution</p>
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
                <ResponsiveRadialBar
                    data={chartData}
                    keys={['y']}
                    indexBy='x'
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    padding={0.2}
                    innerRadius={0.5}
                    cornerRadius={10}
                    colors={{ scheme: 'nivo' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    enableLabel={false}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56,
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

export default BuildingChartCard;