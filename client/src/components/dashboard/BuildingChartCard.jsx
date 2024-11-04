import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { useDimensions } from '@nivo/core';

const CustomLayer = ({ centerX, centerY, data, isMobile }) => {
    const totalBuildings = data.length > 0 ? data[0].totalBuildings : 0;

    return (
        <g transform={`translate(${centerX}, ${centerY})`}>
            <text
                y={isMobile ? -25 : -35}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    fontSize: isMobile ? '40px' : '60px',
                    fontWeight: 'bold',
                    fill: '#333',
                }}
            >
                {totalBuildings}
            </text>
            <text
                y={isMobile ? 15 : 25}
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                    fontSize: isMobile ? '10px' : '16px',
                    fill: '#666',
                }}
            >
                Buildings
            </text>
        </g>
    );
};

const calculateTextWidth = (text, font = '12px Arial') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
};

const BuildingChartCard = ({ data, campuses }) => {
    const [selectedCampus, setSelectedCampus] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [legendSize, setLegendSize] = useState(10);
    const chartRef = useRef(null);

    useEffect(() => {
        // Check if the screen is mobile
        const handleResize = () => {
            const isMobileScreen = window.innerWidth <= 768;
            setIsMobile(isMobileScreen);
            setLegendSize(isMobileScreen ? 6 : 10);
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

    const keys = [...new Set(filteredData.flatMap(item => item.facilities.map(facility => facility.facility)))];

    const legendItems = keys.map(key => ({
        id: key,
        label: key,
        width: calculateTextWidth(key) + 20
    }));

    const maxLegendItemWidth = Math.max(...legendItems.map(item => item.width));


    const dimensions = useDimensions(chartRef.current ? chartRef.current.offsetWidth : 0, chartRef.current ? chartRef.current.offsetHeight : 0, { top: 0, right: 0, bottom: 0, left: 0 });
    const centerX = dimensions.innerWidth / 2;
    const centerY = dimensions.innerHeight / 2;

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
            <div className='h-[300px] md:h-[500px]' ref={chartRef}>
                <ResponsiveRadialBar
                    data={chartData}
                    keys={['y']}
                    indexBy='x'
                    margin={{ top: 25, right: 0, bottom: 0, left: 0 }}
                    padding={0.2}
                    innerRadius={isMobile ? (selectedCampus === 'all' ? 0.025 : 0.7) : 0.5}
                    cornerRadius={isMobile ? 5 : 10}
                    colors={{ scheme: 'nivo' }}
                    enableLabel={false}
                    legends={[
                        {
                            anchor: 'top-left',
                            direction: 'column',
                            justify: false,
                            translateX: 0,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemHeight: isMobile ? 6 : 10,
                            itemWidth: maxLegendItemWidth,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: isMobile ? 6 : 10,
                            symbolShape: 'square',
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
                    theme={{
                        "legends": {
                            "text": {
                                "fontSize": legendSize
                            }
                        }
                    }}
                    layers={[
                        'grid',
                        'tracks',
                        'bars',
                        'labels',
                        'legends',
                        (props) => selectedCampus !== 'all' ? <CustomLayer {...props} data={filteredData} centerX={centerX} centerY={centerY} isMobile={isMobile} /> : null
                    ]}
                />
            </div>
        </div>
    );
};

export default BuildingChartCard;