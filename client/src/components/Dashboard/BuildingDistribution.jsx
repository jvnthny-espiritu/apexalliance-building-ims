import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
	labels: ['Pablo Borbon', 'Alangilan', 'ARASOF-Nasugbu', 'Mabini', 'Balayan', 'Lemery', 'San Juan', 'Rosario', 'Lobo', 'JPLPC-Malvar', 'Lipa'],
	datasets: [
	  {
		label: 'No. of Building',
		data: [12, 19, 3, 5, 2, 3, 10, 4, 5, 2, 9],
		backgroundColor: [
			'rgba(0, 202, 220, .5)',
			'rgba(73, 195, 251, .5)',
			'rgba(101, 166, 250, .5)',
			'rgba(126, 128, 231, .5)',
			'rgba(155, 87, 204, .5)',
			'rgba(187, 16, 157, .5)',
			'rgba(208, 0, 95, .5)',
			'rgba(222, 79, 69, .5)',
			'rgba(247, 145, 80, .5)',
			'rgba(255, 203, 118, .5)',
			'rgba(230, 232, 121, .5)',
		],
		borderColor: [
		  'rgba(0, 202, 220, 1)',
		  'rgba(73, 195, 251, 1)',
		  'rgba(101, 166, 250, 1)',
		  'rgba(126, 128, 231, 1)',
		  'rgba(155, 87, 204, 1)',
		  'rgba(187, 16, 157, 1)',
		  'rgba(208, 0, 95, 1)',
		  'rgba(222, 79, 69, 1)',
		  'rgba(247, 145, 80, 1)',
		  'rgba(255, 203, 118, 1)',
		  'rgba(230, 232, 121, 1)',
		],
		borderWidth: 1,
	  },
	],
  };
  
export default function BuildingDistribution() {
	return <Pie data={data} />;
}