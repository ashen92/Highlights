import React, { useEffect, useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { getActiveUsersByDay, getUserDistribution } from '@/services/GraphService';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const colors = [
  'rgba(56, 189, 248, 0.7)', // Blue
  'rgba(34, 197, 94, 0.7)', // Green
  'rgba(168, 85, 247, 0.7)', // Purple
  'rgba(251, 191, 36, 0.7)', // Yellow
  'rgba(239, 68, 68, 0.7)', // Red
];

const SkeletonLoader = ({ height }: { height: string }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-lg w-full`}
    style={{ height }}
  />
);

const GeographicDistribution = () => {
  const [userDistribution, setUserDistribution] = useState<any>(null);
  const [peakUsageTimes, setPeakUsageTimes] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const [distributionData, peakData] = await Promise.all([
        getUserDistribution(),
        getActiveUsersByDay(),
      ]);

      // Set user distribution data for the pie chart
      setUserDistribution({
        labels: distributionData.labels,
        datasets: [
          {
            label: 'User Distribution by Country',
            data: distributionData.data,
            backgroundColor: colors,
            borderColor: colors.map((c) => c.replace('0.7', '1.0')),
            borderWidth: 1,
          },
        ],
      });

      // Format the peak data if necessary
      const formattedLabels = peakData.labels.map((timestamp: string) => {
        // If the timestamp is a full date-time, extract the hour part and format it
        const date = new Date(timestamp);
        const hours = date.getHours();
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = `${hours % 12 || 12} ${period}`;
        return formattedHour;
      });

      setPeakUsageTimes({
        labels: formattedLabels, // Use formatted time intervals as labels
        datasets: [
          {
            label: 'Active Users Per Hour',
            data: peakData.data, // Active user count per hour
            backgroundColor: colors.slice(0, peakData.data.length), // Ensure enough colors for each hour
            borderColor: colors.map((c) => c.replace('0.7', '1.0')),
            borderWidth: 1,
          },
        ],
      });
    }

    fetchData();
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg space-y-6 border-l-4 border-blue-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
        Geographic Distribution
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-gradient-to-br from-blue-100 via-teal-100 to-purple-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
          <GlobeAltIcon className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">User Distribution by Country</h3>
          {userDistribution ? (
            <Pie
              data={userDistribution}
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
          ) : (
            <SkeletonLoader height="200px" />
          )}
        </div>

        {/* Peak Usage Times */}
        <div className="bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
          <GlobeAltIcon className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Peak Usage Times (Hourly)</h3>
          {peakUsageTimes ? (
            <Bar
              data={peakUsageTimes}
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
                    title: { display: true, text: 'Hour', color: 'gray' },
                    ticks: { color: 'gray' },
                  },
                  y: {
                    grid: { color: 'rgba(200, 200, 200, 0.3)' },
                    title: { display: true, text: 'Active Users', color: 'gray' },
                    ticks: { color: 'gray' },
                    beginAtZero: true,
                  },
                },
              }}
              height={120}
              width={120}
            />
          ) : (
            <SkeletonLoader height="200px" />
          )}
        </div>
      </div>
    </section>
  );
};

export default GeographicDistribution;
