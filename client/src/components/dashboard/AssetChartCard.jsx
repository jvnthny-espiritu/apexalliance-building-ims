import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import { ResponsivePie } from '@nivo/pie';

const AssetChartCard = ({ assetData, campuses }) => {
    const [selectedCampus, setSelectedCampus] = useState('all');
    const [isMobile, setIsMobile] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedChart, setSelectedChart] = useState('all');

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
        setShowDropdown(false); // Hide dropdown after selection
    };

    const filteredData = selectedCampus === 'all' 
        ? {
            category: assetData.categoryData || [],
            condition: assetData.conditionData || [],
            status: assetData.statusData || [],
        }
        : {
            category: (assetData.categoryData || []).filter(item => item.campus === selectedCampus),
            condition: (assetData.conditionData || []).filter(item => item.campus === selectedCampus),
            status: (assetData.statusData || []).filter(item => item.campus === selectedCampus),
        };


    return (
        <div className='w-full p-4 md:p-7 border-primary border-4 border-opacity-50 rounded-lg shadow-lg bg-white'>
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
                        className='p-2 border border-primary rounded-lg text-sm md:text-base bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                    >
                        <option value='all'>All Campus</option>
                        {campuses.map(campus => (
                            <option key={campus._id} value={campus.name}>{campus.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <div className='flex justify-center mb-4'>
                <button 
                    onClick={() => setSelectedChart('all')} 
                    className={`p-2 mx-2 rounded-lg ${selectedChart === 'all' ? ' text-primary text-opacity-100' : 'text-primary text-opacity-50'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setSelectedChart('categoryData')} 
                    className={`p-2 mx-2 rounded-lg ${selectedChart === 'categoryData' ? ' text-primary text-opacity-100' : 'text-primary text-opacity-50'}`}
                >
                    Category
                </button>
                <button 
                    onClick={() => setSelectedChart('conditionData')} 
                    className={`p-2 mx-2 rounded-lg ${selectedChart === 'conditionData' ? ' text-primary text-opacity-100' : 'text-primary text-opacity-50'}`}
                >
                    Condition
                </button>
                <button 
                    onClick={() => setSelectedChart('statusData')} 
                    className={`p-2 mx-2 rounded-lg ${selectedChart === 'statusData' ? ' text-primary text-opacity-100' : 'text-primary text-opacity-50'}`}
                >
                    Status
                </button>
            </div>
            <div style={{ height: 400, width: '100%', position: 'relative' }}>
                {selectedChart === 'all' && (
                    <>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                            <ResponsivePie
                                data={filteredData.category}
                                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                                innerRadius={0.775}
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
                            />
                        </div>
                        <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', zIndex: 2 }}>
                            <ResponsivePie
                                data={filteredData.condition}
                                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                                innerRadius={0.7}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={{ scheme: 'category10' }}
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
                            />
                        </div>
                        <div style={{ position: 'absolute', top: '20%', left: '20%', right: '20%', bottom: '20%', zIndex: 3 }}>
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
                            />
                        </div>
                    </>
                )}
                {selectedChart === 'categoryData' && (
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
                )}
                {selectedChart === 'conditionData' && (
                    <ResponsivePie
                        data={filteredData.condition}
                        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                        innerRadius={0}
                        padAngle={0.7}
                        cornerRadius={3}
                        colors={{ scheme: 'category10' }}
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
                )}
                {selectedChart === 'statusData' && (
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
                )}
            </div>
        </div>
    );
};

export default AssetChartCard;