import React, { useState, useEffect } from 'react';
import ReactEcharts from "echarts-for-react"; 

const RoomTypeDistribution = () => {
    const [roomData, setRoomData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5050/api/dashboard/room-distribution');
                const data = await response.json();
                setRoomData(data);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchData();
    }, []);

    const series = [
        {
            data: [],
            type: 'bar',
            stack: 'a',
            name: 'Administrative',
            barWidth: '20%'
        },
        {
            data: [],
            type: 'bar',
            stack: 'a',
            name: 'Classroom',
            barWidth: '20%'
        },
        {
            data: [],
            type: 'bar',
            stack: 'a',
            name: 'Laboratory',
            barWidth: '20%'
        }
    ];

    if (roomData) {
        Object.entries(roomData).forEach(([campus, types]) => {
            series[0].data.push(types.administrative);
            series[1].data.push(types.classroom);
            series[2].data.push(types.laboratory);
        });
    }

    const option = {
        title: {
            text: 'Room Type Distribution',
            left: 'left',
            textStyle: {
                color: '#ffffff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '<b>{a0}<b/><br />No. of Rooms: {c0}'
        },
        legend: {
            orient: 'horizontal',
            left: 'right',
            textStyle: {
                color: '#ffffff'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: Object.keys(roomData),
            axisLabel: {
                interval: 0,
                rotate: -45,
                textStyle: {
                    fontSize: 10,
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };

    return <ReactEcharts option={option} />;
};

export default RoomTypeDistribution;
