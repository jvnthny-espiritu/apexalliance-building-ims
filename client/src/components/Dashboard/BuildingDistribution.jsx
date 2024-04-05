import React from 'react';
import ReactEcharts from "echarts-for-react"; 

export default function BuildingDistribution() {
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
              data: [
                { value: 1048, name: 'Alangilan' },
                { value: 735, name: 'Pablo Borbon' },
                { value: 580, name: 'ARASOF-Nasugbu' },
                { value: 484, name: 'Balayan' },
                { value: 300, name: 'Lemery' },
                { value: 1048, name: 'Mabini' },
                { value: 735, name: 'JPLPC-Malvar' },
                { value: 580, name: 'Lipa' },
                { value: 484, name: 'Rosario' },
                { value: 300, name: 'San Juan' },
                { value: 484, name: 'Lobo' }
              ],
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
}