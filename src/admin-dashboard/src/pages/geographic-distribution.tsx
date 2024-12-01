import React from 'react';
import { GlobeAltIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Enhanced color palette for better visuals
const colors = {
  blue: 'rgba(56, 189, 248, 0.7)',
  green: 'rgba(34, 197, 94, 0.7)',
  purple: 'rgba(168, 85, 247, 0.7)',
  orange: 'rgba(251, 191, 36, 0.7)',
  red: 'rgba(239, 68, 68, 0.7)',
  teal: 'rgba(45, 212, 191, 0.7)',
};

// Sample data for Pie chart (User Distribution by Region)
const userDistributionData = {
  labels: ['North America', 'Europe', 'Asia', 'Africa', 'South America'],
  datasets: [
    {
      label: 'User Distribution',
      data: [50, 30, 10, 5, 5],
      backgroundColor: [colors.blue, colors.green, colors.purple, colors.orange, colors.red],
      borderColor: ['#38bdf8', '#22c55e', '#a855f7', '#fb923c', '#ef4444'],
      borderWidth: 1,
      hoverOffset: 8, // Slightly increase the hover effect for better UX
    },
  ],
};

// Sample data for Bar chart (User Engagement by Device)
const deviceEngagementData = {
  labels: ['Mobile', 'Desktop', 'Tablet'],
  datasets: [
    {
      label: 'Engagement (%)',
      data: [70, 20, 10],
      backgroundColor: [colors.teal, colors.blue, colors.orange],
      borderColor: ['#2dd4bf', '#38bdf8', '#fb923c'],
      borderWidth: 1,
    },
  ],
};

const GeographicDistribution = () => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-lg space-y-6 border-l-4 border-blue-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">Geographic Distribution</h2>

      {/* Responsive layout for both graphs side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* User Distribution by Region */}
        <div className="bg-gradient-to-br from-blue-100 via-teal-100 to-purple-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
          <GlobeAltIcon className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Distribution</h3>
          <Pie
            data={userDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: { boxWidth: 10, padding: 15 },
                },
              },
            }}
            height={120}
            width={120}
          />
        </div>

        {/* User Engagement by Device */}
        <div className="bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
          <DevicePhoneMobileIcon className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Engagement by Device</h3>
          <Bar
            data={deviceEngagementData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: { boxWidth: 10, padding: 15 },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: 'gray' },
                },
                y: {
                  grid: { color: 'rgba(200, 200, 200, 0.3)' },
                  ticks: { color: 'gray' },
                  beginAtZero: true,
                },
              },
            }}
            height={120}
            width={120}
          />
        </div>

      </div>
    </section>
  );
};

export default GeographicDistribution;
