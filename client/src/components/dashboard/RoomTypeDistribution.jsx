import React, { useState, useEffect } from 'react';
import ReactEcharts from "echarts-for-react"; 
import api from '../../services/api';

const RoomTypeDistribution = () => {
    const [roomData, setRoomData] = useState({});
    console.log(roomData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/room-distribution');
                setRoomData(response.data);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchData();
    }, []);

    const series = Object.keys(roomData).map(campus => ({
        name: campus,
        type: 'bar',
        stack: 'a',
        data: [
            roomData[campus].administrative || 0,
            roomData[campus].classroom || 0,
            roomData[campus].laboratory || 0
        ],
        barWidth: '20%'
    }));

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
