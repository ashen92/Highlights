import React, { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axiosClient from '@/services/AxiosClient';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Define color palette for consistency
const colors = {
  blue: 'rgba(56, 189, 248, 0.7)',
  green: 'rgba(34, 197, 94, 0.7)',
  purple: 'rgba(168, 85, 247, 0.7)',
  orange: 'rgba(251, 191, 36, 0.7)',
  red: 'rgba(239, 68, 68, 0.7)',
};

const UsageTrends = () => {
  const [featureUsageData, setFeatureUsageData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
      hoverOffset: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Feature Usage',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  });

  const userSignupsData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'User Signups',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  useEffect(() => {
    // Fetch feature usage data from the backend
    const fetchFeatureUsageData = async () => {
      try {
        const response = await axiosClient('monitoring/featureUsage').request({
          method: 'GET',
        });
        const data = response.data;

        // Check if the response data is an array
        if (Array.isArray(data)) {
          // Transform API data into chart-compatible format
          const transformedData = {
            labels: data.map((item) => item.feature),
            datasets: [
              {
                label: 'Feature Usage',
                data: data.map((item) => item.number),
                backgroundColor: [
                  colors.blue,
                  colors.green,
                  colors.purple,
                  colors.orange,
                  colors.red,
                ],
                borderColor: [
                  '#38bdf8',
                  '#22c55e',
                  '#a855f7',
                  '#fb923c',
                  '#ef4444',
                ],
                borderWidth: 1,
                hoverOffset: 8,
              },
            ],
          };

          setFeatureUsageData(transformedData);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching feature usage data:', error);
      }
    };

    fetchFeatureUsageData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Usage Trends Section */}
      <section className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-blue-500 pb-2">Usage Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Line Chart - User Signups */}
          <div className="bg-gradient-to-br from-blue-100 via-teal-100 to-purple-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
            <ChartBarIcon className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-gray-800">User Signups</h3>
            <div className="w-full" style={{ height: '300px' }}>
              <Line
                data={userSignupsData}
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
          {/* Pie Chart - Feature Usage Distribution */}
          <div className="bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
            <DocumentTextIcon className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-gray-800">Feature Usage Distribution</h3>
            <div className="w-full" style={{ height: '300px' }}>
              <Pie
                data={featureUsageData}
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
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UsageTrends;
