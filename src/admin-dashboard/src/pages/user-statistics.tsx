import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Legend,
} from 'chart.js';
import { getUserGrowth, getNewUsers, getUserCount, getActiveUsersByDay } from '../services/GraphService';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const UserStatistics = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [recentNewUsers, setRecentNewUsers] = useState<number>(0);
  const [userGrowthData, setUserGrowthData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
  const [activeUsersData, setActiveUsersData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total user count
        const userCount = await getUserCount();
        setTotalUsers(userCount);

        // Fetch new users in the last 2 weeks
        const newUsers = await getNewUsers(14);
        setRecentNewUsers(newUsers.length);

        // Fetch user growth data (cumulative)
        const growthData = await getUserGrowth();
        setUserGrowthData({ labels: growthData.labels, data: growthData.data });

        // Fetch active users data by day for the last 7 days
        const activeUsers = await getActiveUsersByDay();
        setActiveUsersData({ labels: activeUsers.labels, data: activeUsers.data });
      } catch (error) {
        console.error('Error fetching user statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                <p className="text-gray-600 text-xl">{loading ? 'Loading...' : totalUsers}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <UserIcon className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-800">New Users (Last 2 Weeks)</h3>
                <p className="text-gray-600 text-xl">{loading ? 'Loading...' : recentNewUsers}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4 border-b-2 border-green-500 pb-2">User Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Line Chart - User Growth */}
            <div className="bg-gradient-to-br from-blue-100 via-teal-100 to-purple-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
              <h3 className="text-lg font-medium mb-2 text-gray-800">User Growth (Monthly)</h3>
              <div className="w-full" style={{ height: '300px' }}>
                <Line
                  data={{
                    labels: userGrowthData.labels,
                    datasets: [
                      {
                        label: 'User Growth',
                        data: userGrowthData.data,
                        borderColor: 'rgba(45, 212, 191, 1)',
                        backgroundColor: 'rgba(45, 212, 191, 0.2)',
                        tension: 0.1,
                        pointBackgroundColor: 'rgba(45, 212, 191, 1)',
                        pointBorderColor: '#2dd4bf',
                        pointRadius: 5,
                        pointHoverRadius: 7,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Bar Chart - Active Users by Day */}
            <div className="bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
              <h3 className="text-lg font-medium mb-2 text-gray-800">Active Users by Day (Last Week)</h3>
              <div className="w-full" style={{ height: '300px' }}>
                <Bar
                  data={{
                    labels: activeUsersData.labels,
                    datasets: [
                      {
                        label: 'Active Users',
                        data: activeUsersData.data,
                        backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                      },
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
