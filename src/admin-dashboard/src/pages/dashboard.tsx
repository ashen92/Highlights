import { useState } from 'react';
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

interface Tip {
  id: number;
  text: string;
}

const sampleTips: Tip[] = [
  { id: 1, text: 'Tip 1: Stay hydrated throughout the day.' },
  { id: 2, text: 'Regular exercise improves productivity.' },
  { id: 3, text: 'Prioritize your tasks for the day.' },
];

const Dashboard = () => {
  const [tips, setTips] = useState<Tip[]>(sampleTips);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = tips.filter(tip =>
    tip.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
     {/* Overview Summary
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Overview Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/users" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <GlobeAltIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Total Users</h3>
                <p className="text-gray-500">All Users</p>
              </div>
            </div>
          </Link>
          <Link href="/active-users" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <UserIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Active Users</h3>
                <p className="text-2xl font-bold"></p>
              </div>
            </div>
          </Link>
        </div>
      </section>  */}

      {/* Reports and Analytics */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reports and Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/user-statistics" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <ChartBarIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">User Statistics</h3>
                <p className="text-gray-500">Graphs and charts here.</p>
              </div>
            </div>
          </Link>
          <Link href="/usage-trends" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <DocumentTextIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Usage Trends</h3>
                <p className="text-gray-500">Usage trends and insights here.</p>
              </div>
            </div>
          </Link>
          
          {/* Geographic Distribution */}
          <Link href="/geographic-distribution" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <GlobeAltIcon className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Geographic Distribution</h3>
                <p className="text-gray-500">User distribution and peak usage times.</p>
              </div>
            </div>
          </Link>
          
          {/* Security Metrics */}
          <Link href="/security-metrics" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <ExclamationCircleIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Security Metrics</h3>
                <p className="text-gray-500">Failed login attempts and unusual activity.</p>
              </div>
            </div>
          </Link>
          
          {/* Revenue Metrics
          <Link href="/revenue-metrics" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <ChartBarIcon className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Revenue Metrics</h3>
                <p className="text-gray-500">Monthly recurring revenue and conversion rates.</p>
              </div>
            </div>
          </Link> */}
        </div>
      </section>

      {/* Notification Center */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Notification Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/alerts" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <BellIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Alerts</h3>
                <p className="text-gray-500">Critical system alerts here.</p>
              </div>
            </div>
          </Link>
          <Link href="/messages" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <MagnifyingGlassIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Messages</h3>
                <p className="text-gray-500">Manage your messages here.</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Issue Tracking */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Issue Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/reported-issues" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <ExclamationCircleIcon className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Reported Issues</h3>
                <p className="text-gray-500">List of reported issues here.</p>
              </div>
            </div>
          </Link>
          <Link href="/issue-statistics" className="no-underline">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center">
              <ChartBarIcon className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium">Issue Statistics</h3>
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
