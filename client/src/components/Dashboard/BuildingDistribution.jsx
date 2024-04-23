import React, { useState, useEffect } from 'react';
import ReactEcharts from "echarts-for-react"; 

const BuildingDistribution = () => {
    const [buildingData, setBuildingData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5050/api/dashboard/building-distribution');
                const data = await response.json();
                setBuildingData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching building data:', error);
                setError('Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const option = {
        title: {
            text: 'Building Distribution',
            left: 'left',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            textStyle: {
                color: '#ffffff'
            }
        },
        series: [
            {
                name: 'No. of Building',
                type: 'pie',
                label: {
                    color: '#fff'
                },
                center: ['30%', '60%'],
                data: Object.entries(buildingData).map(([campus, count]) => ({ value: count, name: campus })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    return <ReactEcharts option={option} />;
};

export default BuildingDistribution;
