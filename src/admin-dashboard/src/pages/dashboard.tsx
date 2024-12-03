import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ServerIcon,
  BellIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import axiosClient from '@/services/AxiosClient';

interface FeatureUsage {
  feature: string;
  number: number;
}

const Dashboard = () => {
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch feature usage metrics from backend
    const fetchFeatureUsage = async () => {
      try {
        setLoading(true);
        const response = await axiosClient('monitoring').get('/featureUsage');
        setFeatureUsage(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureUsage();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      {/* System Overview */}
      <section className="p-6 rounded-lg shadow-xl bg-gradient-to-r from-indigo-400 via-indigo-600 to-gray-800 text-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">System Overview</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featureUsage.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-gray-100 hover:shadow-xl"
              >
                <ServerIcon className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <h3 className="text-md font-medium text-gray-900">{feature.feature}</h3>
                  <p className="text-gray-500 text-sm">{feature.number} entries</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Other sections (Reports, Analytics, etc.) */}
      <section className="p-6 rounded-lg shadow-xl bg-gradient-to-r from-teal-400 to-blue-500 text-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Reports and Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/user-statistics" className="no-underline hover:scale-105 transform transition">
            <div className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-green-100 hover:shadow-xl">
              <ChartBarIcon className="w-8 h-8 text-teal-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">User Statistics</h3>
                <p className="text-gray-500">Graphs and charts here.</p>
              </div>
            </div>
          </Link>
          <Link href="/usage-trends" className="no-underline hover:scale-105 transform transition">
            <div className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-teal-100 hover:shadow-xl">
              <DocumentTextIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Usage Trends</h3>
                <p className="text-gray-500">Usage trends and insights here.</p>
              </div>
            </div>
          </Link>

          {/* Geographic Distribution */}
          <Link href="/geographic-distribution" className="no-underline hover:scale-105 transform transition">
            <div className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-yellow-100 hover:shadow-xl">
              <GlobeAltIcon className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Geographic Distribution</h3>
                <p className="text-gray-500">User distribution.</p>
              </div>
            </div>
          </Link>

          {/* Security Metrics */}
          <Link href="/security-metrics" className="no-underline hover:scale-105 transform transition">
            <div className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-red-100 hover:shadow-xl">
              <ExclamationCircleIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Security Metrics</h3>
                <p className="text-gray-500">Failed login attempts and unusual activity.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Issue Tracking */}
      <section className="p-6 rounded-lg shadow-xl bg-gradient-to-r from-red-500 via-red-900 to-gray-800 text-white">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Issue Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/reported-issues" className="no-underline hover:scale-105 transform transition">
            <div className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-red-100 hover:shadow-xl">
              <ExclamationCircleIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Reported Issues</h3>
                <p className="text-gray-500">List of reported issues here.</p>
              </div>
            </div>
          </Link>
          <Link href="/issue-statistics" className="no-underline hover:scale-105 transform transition">
            <div className="bg-white p-4 rounded-lg flex items-center shadow-md hover:bg-blue-100 hover:shadow-xl">
              <ChartBarIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Issue Statistics</h3>
                <p className="text-gray-500">Graphical representation of issues.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
