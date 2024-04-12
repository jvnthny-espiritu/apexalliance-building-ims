import React from 'react';
import ReactEcharts from "echarts-for-react"; 

export default function RoomTypeDistribution() {
	var series = [
		{
		  data: [5, 7, 8, 6, 9, 10, 5, 6, 7, 8, 9],
		  type: 'bar',
		  stack: 'a',
		  name: 'Administrative',
		  barWidth: '20%'
		},
		{
		  data: [20, 25, 30, 35, 40, 45, 50, 20, 25, 30, 35],
		  type: 'bar',
		  stack: 'a',
		  name: 'Classroom',
		  barWidth: '20%'
		},
		{
		  data: [10, 15, 10, 15, 20, 25, 10, 15, 10, 15, 20],
		  type: 'bar',
		  stack: 'a',
		  name: 'Laboratory',
		  barWidth: '20%'
		}
	  ];
	const stackInfo = {};
	  for (let i = 0; i < series[0].data.length; ++i) {
		for (let j = 0; j < series.length; ++j) {
		  const stackName = series[j].stack;
		  if (!stackName) {
			continue;
		  }
		  if (!stackInfo[stackName]) {
			stackInfo[stackName] = {
			  stackStart: [],
			  stackEnd: []
			};
		  }
		  const info = stackInfo[stackName];
		  const data = series[j].data[i];
		  if (data && data !== '-') {
			if (info.stackStart[i] == null) {
			  info.stackStart[i] = j;
			}
			info.stackEnd[i] = j;
		  }
		}
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
		  data: ['Alangilan', 'Pablo Borbon', 'ARASOF-Nasugbu', 'Balayan', 'Lemery', 'Mabini', 'JPLPC-Malvar', 'Lipa', 'Rosario', 'San Juan', 'Lobo'],
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
}