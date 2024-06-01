import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Catégorie 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Catégorie 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Catégorie 3',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: '#BE6DB7',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Catégorie 4',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: '#4D455D',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export function ViewChart({title = ""}) {
  options.plugins.title.text = title
  return <Line options={options} data={data} />;
}
