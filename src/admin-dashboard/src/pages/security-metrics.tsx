import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import {
  getLoginAttempts,
  getLoginAttemptsByLocation,
  getBlockedAccounts,
} from '@/services/GraphService';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const colors = [
  'rgba(56, 189, 248, 0.7)', // Blue
  'rgba(34, 197, 94, 0.7)', // Green
  'rgba(168, 85, 247, 0.7)', // Purple
  'rgba(251, 191, 36, 0.7)', // Yellow
  'rgba(239, 68, 68, 0.7)', // Red
];

const SkeletonLoader = ({ height }: { height: string }) => (
  <div className="animate-pulse bg-gray-200 rounded-lg w-full" style={{ height }} />
);

const SecurityMetrics = () => {
  const [loginAttempts, setLoginAttempts] = useState<any>(null);
  const [loginAttemptsByLocation, setLoginAttemptsByLocation] = useState<any>(null);
  const [blockedAccounts, setBlockedAccounts] = useState<number | null>(null);

  const failedLoginAttempts = loginAttempts
    ? loginAttempts.datasets[0].data[1] // Assuming the second index represents failed attempts
    : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoginAttempts(await getLoginAttempts());
      setLoginAttemptsByLocation(await getLoginAttemptsByLocation());
      setBlockedAccounts(await getBlockedAccounts());
    };

    fetchData();
  }, []);

  const metrics = [
    { label: 'Blocked Accounts', value: blockedAccounts },
    { label: 'Failed Login Attempts', value: failedLoginAttempts },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg space-y-6 border-l-4 border-blue-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
        Security Metrics
      </h2>

      {/* Metrics as Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg flex flex-col items-center justify-center text-center shadow-md hover:bg-gray-100 hover:shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-800">{metric.label}</h3>
            <p className="text-2xl font-bold text-blue-500">
              {metric.value !== null ? metric.value : <SkeletonLoader height="20px" />}
            </p>
          </div>
        ))}
      </div>

      {/* Login Attempts by Location Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-green-500 pb-2">
          Login Attempts by Location
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
          {loginAttemptsByLocation ? (
            <Bar
              data={loginAttemptsByLocation}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'bottom' } },
                maintainAspectRatio: false,
              }}
              height={220} // Increased Bar chart height
            />
          ) : (
            <SkeletonLoader height="220px" />
          )}
        </div>
      </div>
    </section>
  );
};

export default SecurityMetrics;
