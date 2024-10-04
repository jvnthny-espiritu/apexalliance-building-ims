import React, { useState, useEffect } from 'react';
import ReactEcharts from "echarts-for-react"; 
import api from '../../services/api';

const RoomTypeDistribution = () => {
    const [roomData, setRoomData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/dashboard/metrics/rooms');
                setRoomData(response.data.roomPurposeDistribution);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };
        fetchData();
    }, []);

    const roomTypes = ['Administrative', 'Classroom', 'Laboratory', 'Library', 'Canteen', 'Clinic', 'Others'];
    const series = roomTypes.map(roomType => ({
      name: roomType,
      type: 'bar',
      stack: 'total',
      data: Object.keys(roomData).map(campus => roomData[campus][roomType.toLowerCase()] || 0),
      barWidth: '20%'
    }));

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '<b>{a0}<b/><br />No. of Rooms: {c0}'
        },
        legend: {
            orient: 'horizontal',
            left: 'right',
            textStyle: {
              fontWeight: 'bold'
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
                    fontWeight: 'bold'
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
