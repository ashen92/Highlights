import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, ChartLegend);

// Sample data for Line chart (Active Users Over Time)
const activeUsersData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Active Users',
      data: [150, 200, 250, 220, 270, 300, 320],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.3,
    },
  ],
};

// Sample data for Bar chart (Active Users by Day of the Week)
const activeUsersByDayData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      label: 'Active Users',
      data: [120, 150, 170, 180, 200, 220, 250],
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

// Example counts (replace with real data in production)
const totalUsers = 5000;
const recentNewUsers = 120; // New users in the last two weeks

const UserStatistics = () => {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 min-h-screen">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Total Users and Recent New Users */}
        <section className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <UserIcon className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">Total Users</h3>
                <p className="text-gray-600 text-xl">{totalUsers}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <UserIcon className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">New Users (Last 2 Weeks)</h3>
                <p className="text-gray-600 text-xl">{recentNewUsers}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Users Section */}
        <section className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-green-500 pb-2">Active Users Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-gray-800">Active Users Over Time</h3>
              <div className="w-full" style={{ height: '400px' }}>
                <Line
                  data={activeUsersData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true } },
                    scales: {
                      y: { grid: { color: 'rgba(200, 200, 200, 0.2)' } },
                      x: { grid: { color: 'rgba(200, 200, 200, 0.2)' } },
                    },
                  }}
                />
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-gray-800">Active Users by Day</h3>
              <div className="w-full" style={{ height: '400px' }}>
                <Bar
                  data={activeUsersByDayData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: true } },
                    scales: {
                      y: { grid: { color: 'rgba(200, 200, 200, 0.2)' } },
                      x: { grid: { color: 'rgba(200, 200, 200, 0.2)' } },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserStatistics;
