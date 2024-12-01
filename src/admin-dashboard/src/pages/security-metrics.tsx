import React from 'react';
import {
  ShieldExclamationIcon,
  GlobeAltIcon,
  ClockIcon,
  UserCircleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// Sample data for Failed Login Attempts by User
const failedLoginAttemptsByUserData = {
  labels: ['Admin', 'User1', 'User2', 'Guest', 'SuperUser'],
  datasets: [
    {
      label: 'Failed Login Attempts',
      data: [15, 5, 30, 10, 3],
      backgroundColor: 'rgba(255, 99, 132, 0.7)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

// Sample data for Failed Login Attempts by Day
const failedLoginAttemptsByDayData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  datasets: [
    {
      label: 'Failed Login Attempts by Day',
      data: [5, 12, 8, 10, 7, 15, 4],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
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

// Sample data for Login Times
const loginTimesData = {
  labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
  datasets: [
    {
      label: 'Login Times',
      data: [5, 2, 15, 30, 10, 25],
      backgroundColor: 'rgba(153, 102, 255, 0.7)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    },
  ],
};

// Sample data for Access Frequency
const accessFrequencyData = [
  { user: 'John Doe', frequency: 20 },
  { user: 'Jane Smith', frequency: 5 },
  { user: 'Tom Brown', frequency: 30 },
  { user: 'Alice Johnson', frequency: 10 },
];

// Sample data for Role Change Requests
const roleChangeRequestsData = [
  { user: 'John Doe', role: 'Admin', requestDate: '2024-11-01' },
  { user: 'Jane Smith', role: 'Editor', requestDate: '2024-11-05' },
  { user: 'Tom Brown', role: 'Viewer', requestDate: '2024-11-08' },
];

const SecurityMetrics = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Failed Login Attempts */}
      <section className="bg-white p-6 rounded-lg shadow-xl mb-8 border-l-4 border-indigo-500">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-indigo-500 pb-2">Failed Login Attempts</h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-1/2">
            <Bar
              data={failedLoginAttemptsByUserData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
              }}
              height={200}
            />
          </div>
        </div>
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          <div className="w-full sm:w-3/4 md:w-1/2 lg:w-2/3 xl:w-1/2">
            <Bar
              data={failedLoginAttemptsByDayData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
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
          <div className="bg-pink-100 p-4 rounded-lg shadow-md flex items-center hover:bg-pink-200 transition duration-300">
            <ClockIcon className="w-8 h-8 text-pink-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Off-Hours Logins</h3>
              <p className="text-gray-600">Unusual login times detected</p>
            </div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg shadow-md flex items-center hover:bg-purple-200 transition duration-300">
            <UserCircleIcon className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Frequent Access</h3>
              <p className="text-gray-600">Users with high access frequency</p>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center hover:bg-yellow-200 transition duration-300">
            <ShieldExclamationIcon className="w-8 h-8 text-yellow-600 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-800">Role Change Requests</h3>
              <p className="text-gray-600">Recent high-privilege role changes</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location-based login attempts chart */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Login Attempts by Location</h3>
            <Bar data={loginAttemptsByLocationData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          {/* Login Times chart */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Login Times</h3>
            <Line data={loginTimesData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Access Frequency Table */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Access Frequency</h3>
            <div className="space-y-2">
              {accessFrequencyData.map((user, index) => (
                <div key={index} className="flex justify-between bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition duration-300">
                  <span className="font-medium">{user.user}</span>
                  <span>{user.frequency} times</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role Change Requests Table */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Role Change Requests</h3>
            <div className="space-y-2">
              {roleChangeRequestsData.map((request, index) => (
                <div key={index} className="flex justify-between bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition duration-300">
                  <span className="font-medium">{request.user}</span>
                  <span>{request.role} - {request.requestDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    //</div>
  );
};

export default SecurityMetrics;
