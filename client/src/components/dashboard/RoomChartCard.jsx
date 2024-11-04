import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ResponsiveBar, Bar } from '@nivo/bar';

const RoomChartCard = ({ campuses, roomDistribution }) => {
    const [selectedCampus, setSelectedCampus] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const chartContainerRef = useRef();

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

    const calculateTextWidth = (text, font = '12px Arial') => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    };

    const legendItems = keys.map(key => ({
        id: key,
        label: key,
        width: calculateTextWidth(key) + 20
    }));

    const maxLegendItemWidth = Math.max(...legendItems.map(item => item.width));

    // Calculate the minimum width for the chart based on the number of bars
    const minWidth = isMobile ? chartData.length * 150 : Math.max(1200, chartData.length * 25);

    const props = {
        data: chartData,
        height: 500,
        keys: keys,
        margin: ['bottom', 'left', 'right', 'top'].reduce(
            (acc, key) => ({ ...acc, [key]: 50 }),
            {}
        ),
        colors: { scheme: 'spectral' },
        width: minWidth,
        indexBy: selectedCampus === 'all' ? 'campus' : 'building',
        groupMode: 'grouped',
    };

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
            <div className='flex h-[500px]'>
                <div className='h-full'>
                    <Bar
                        {...props}
                        width={50}
                        // data={chartData}
                        // keys={keys}
                        layers={['axes']}
                        // indexBy={selectedCampus === 'all' ? 'campus' : 'building'}
                        // margin={{ top: 40, right: 40, bottom: 40, left: 50 }}
                        // padding={0.2}
                        // groupMode='grouped'
                        // colors={{ scheme: 'nivo' }}
                        // borderWidth={1}
                        // borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                        // axisTop={null}
                        // axisRight={null}
                        axisBottom={null}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Count',
                            legendPosition: 'middle',
                            legendOffset: -40
                        }}
                        enableLabel={false}
                        // labelSkipWidth={12}
                        // labelSkipHeight={12}
                        // labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        // legends={[
                        //     {
                        //         dataFrom: 'keys',
                        //         anchor: 'bottom-right',
                        //         direction: 'column',
                        //         justify: false,
                        //         translateX: 0,
                        //         translateY: 0,
                        //         itemsSpacing: 0,
                        //         itemWidth: maxLegendItemWidth,
                        //         itemHeight: 15,
                        //         itemTextColor: '#999',
                        //         itemDirection: 'left-to-right',
                        //         itemOpacity: 1,
                        //         symbolSize: 15,
                        //         symbolShape: 'square',
                        //         effects: [
                        //             {
                        //                 on: 'hover',
                        //                 style: {
                        //                     itemTextColor: '#000'
                        //                 }
                        //             }
                        //         ]
                        //     }
                        // ]}
                    />
                </div>
                <div className='w-full h-full overflow-x-auto' ref={chartContainerRef}>
                    <div style={{ minWidth: `${minWidth}px` }}>
                        <Bar
                            {...props}
                            margin={{ ...props.margin, right:0, left: 0 }}
                            padding={isMobile ? 0.1 : 0.2}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0, 
                            }}
                            axisLeft={null}
                            enableLabel={false}
                        />
                    </div>
                </div>
                <div className='ml-2 lg:ml-0 h-full'>
                    <Bar
                        {...props}
                        margin={{ ...props.margin, right: 0, left: 0 }}
                        width={maxLegendItemWidth}
                        layers={['legends']}
                        enableLabel={false}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 0,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemWidth: maxLegendItemWidth,
                                itemHeight: 15,
                                itemTextColor: '#999',
                                itemDirection: 'left-to-right',
                                itemOpacity: 1,
                                symbolSize: 15,
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
                    />
                </div>
            </div>
        </div>
    );
};

export default RoomChartCard;