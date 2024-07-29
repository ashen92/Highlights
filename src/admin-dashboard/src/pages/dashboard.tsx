import { useState } from 'react';
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
} from '@heroicons/react/24/outline';

interface Tip {
  id: number;
  text: string;
}

const sampleTips: Tip[] = [
  { id: 1, text: 'Tip 1: Stay hydrated throughout the day.' },
  { id: 2, text: 'Tip 2: Regular exercise improves productivity.' },
  { id: 3, text: 'Tip 3: Prioritize your tasks for the day.' },
];

const Dashboard = () => {
  const [tips, setTips] = useState<Tip[]>(sampleTips);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = tips.filter(tip =>
    tip.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Overview Summary */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Overview Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <GlobeAltIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Active Users</h3>
              <p className="text-2xl font-bold">567</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ServerIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Recent Activities</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <BellIcon className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">System Health</h3>
              <p className="text-2xl font-bold">Good</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports and Analytics */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reports and Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ChartBarIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">User Statistics</h3>
              {/* Placeholder for charts */}
              <p className="text-gray-500">Graphs and charts here.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Usage Trends</h3>
              {/* Placeholder for insights */}
              <p className="text-gray-500">Usage trends and insights here.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ServerIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Error Logs</h3>
              {/* Placeholder for error logs */}
              <p className="text-gray-500">Recent errors and issues here.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Center */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Notification Center</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <BellIcon className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Alerts</h3>
              {/* Placeholder for alerts */}
              <p className="text-gray-500">Critical system alerts here.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <MagnifyingGlassIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Messages</h3>
              {/* Placeholder for messages */}
              <p className="text-gray-500">Manage your messages here.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Issue Tracking */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Issue Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ExclamationCircleIcon className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Reported Issues</h3>
              {/* Placeholder for issues */}
              <p className="text-gray-500">List of reported issues here.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ChartBarIcon className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Issue Statistics</h3>
              {/* Placeholder for issue stats */}
              <p className="text-gray-500">Graphical representation of issues.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Graphs and Charts */}
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Graphs and Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ChartBarIcon className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Activity Graphs</h3>
              {/* Placeholder for activity graphs */}
              <p className="text-gray-500">Visual representations of user activity.</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <ChartBarIcon className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-lg font-medium">Comparison Charts</h3>
              {/* Placeholder for comparison charts */}
              <p className="text-gray-500">Compare metrics and time periods.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;