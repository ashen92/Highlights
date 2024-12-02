import React from 'react';
import {
  ShieldExclamationIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample data for Successful vs Failed Login Attempts
const loginAttemptsData = {
  labels: ['Successful Logins', 'Failed Logins'],
  datasets: [
    {
      label: 'Login Attempts',
      data: [120, 30], // Replace with actual data from backend
      backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1,
    },
  ],
};

// Sample data for Location-based login attempts
const loginAttemptsByLocationData = {
  labels: ['USA', 'Canada', 'UK', 'Germany', 'India', 'Australia'],
  datasets: [
    {
      label: 'Login Attempts',
      data: [50, 20, 35, 10, 45, 30],
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
};

const SecurityMetrics = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Successful vs Failed Login Attempts */}
      <section className="bg-white p-6 rounded-lg shadow-xl mb-8 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-indigo-500 pb-2">Login Attempts</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-1/2">
            <Bar
              data={loginAttemptsData}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'bottom' } },
                maintainAspectRatio: false,
              }}
              height={200}
            />
          </div>
        </div>
      </section>

      {/* Unusual Activity Patterns Section */}
      <section className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">Unusual Activity Patterns</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-100 p-4 rounded-lg shadow-md flex items-center hover:bg-indigo-200 transition duration-300">
            <GlobeAltIcon className="w-8 h-8 text-indigo-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Unusual Locations</h3>
              <p className="text-gray-600">Login attempts from uncommon locations</p>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center hover:bg-yellow-200 transition duration-300">
            <ShieldExclamationIcon className="w-8 h-8 text-yellow-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">High Login Attempts</h3>
              <p className="text-gray-600">Significant login activity detected</p>
            </div>
          </div>
        </div>

        {/* Location-based login attempts chart */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Login Attempts by Location</h3>
          <Bar
            data={loginAttemptsByLocationData}
            options={{
              responsive: true,
              plugins: { legend: { display: true, position: 'bottom' } },
              maintainAspectRatio: false,
            }}
            height={200}
          />
        </div>
      </section>
    </div>
  );
};

export default SecurityMetrics;
