import React, { useEffect, useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getUserDistribution, getNewUsersByLocation } from '@/services/GraphService';

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const colors = [
  'rgba(56, 189, 248, 0.7)', // Blue
  'rgba(34, 197, 94, 0.7)', // Green
  'rgba(168, 85, 247, 0.7)', // Purple
  'rgba(251, 191, 36, 0.7)', // Yellow
  'rgba(239, 68, 68, 0.7)', // Red
];

const SkeletonLoader = ({ height }: { height: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg w-full`} style={{ height }} />
);

const GeographicDistribution = () => {
  const [userDistribution, setUserDistribution] = useState<any>(null);
  const [newUserLocations, setNewUserLocations] = useState<any>(null);
  const [error, setError] = useState<string | null>(null); // To handle errors

  useEffect(() => {
    async function fetchData() {
      try {
        const [distributionData, newUserData] = await Promise.all([
          getUserDistribution(),
          getNewUsersByLocation(), // Fetch new user location data
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

        // Set new user location data for the pie chart
        setNewUserLocations({
          labels: newUserData.labels, // Cities or countries
          datasets: [
            {
              label: 'New Users (Last 2 Weeks)',
              data: newUserData.datasets[0].data, // User counts per location
              backgroundColor: colors,
              borderColor: colors.map((c) => c.replace('0.7', '1.0')),
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError('Failed to load data, please try again later.');
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg space-y-6 border-l-4 border-blue-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
        Geographic Distribution
      </h2>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* User Distribution by Country */}
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
              height={200}
              width={200}
            />
          ) : (
            <SkeletonLoader height="200px" />
          )}
        </div>

        {/* New User Locations */}
        <div className="bg-gradient-to-br from-green-100 via-yellow-100 to-red-100 p-4 rounded-lg flex flex-col items-center shadow-md transition-all hover:shadow-xl">
          <GlobeAltIcon className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">New Users (Last 2 Weeks)</h3>
          {newUserLocations ? (
            <Pie
              data={newUserLocations}
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
              height={200}
              width={200}
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
