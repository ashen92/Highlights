import React from 'react';
import { Squares2X2Icon, ArrowUpIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Sample data for Line chart (Revenue Tracking)
const revenueTrackingData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Revenue ($)',
            data: [5000, 7000, 8000, 7500, 9500, 10000, 12000],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
        },
    ],
};

// Sample data for additional revenue metrics
const churnRateData = [0.05, 0.04, 0.03, 0.06, 0.05, 0.03, 0.04]; // Churn rate over time
const arpuData = [15, 18, 20, 22, 25, 30, 32]; // ARPU over time

const RevenueTracking = () => {
    return (
        <section className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Revenue Tracking</h2>

            {/* Container for charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Revenue Growth Chart */}
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow-lg h-[350px] overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Squares2X2Icon className="w-10 h-10 text-indigo-500 mb-4" />
                        <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">Revenue Growth</h3>
                        <div style={{ height: '250px' }}> {/* Set fixed height for chart */}
                            <Line
                                data={revenueTrackingData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: 'top', labels: { color: '#4B5563' } },
                                        tooltip: { backgroundColor: '#4B5563' },
                                    },
                                    scales: {
                                        x: {
                                            grid: { color: '#E5E7EB' },
                                            ticks: { color: '#4B5563' },
                                        },
                                        y: {
                                            grid: { color: '#E5E7EB' },
                                            ticks: { color: '#4B5563' },
                                        },
                                    },
                                }}
                                height={250} // Set fixed height for the chart
                            />
                        </div>
                    </div>
                </div>

                {/* Churn Rate */}
                <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-xl shadow-lg h-[350px] overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-full">
                        < ArrowUpIcon className="w-10 h-10 text-red-500 mb-4" />
                        <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">Churn Rate</h3>
                        <div style={{ height: '250px' }}>
                            <Line
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'Churn Rate (%)',
                                            data: churnRateData,
                                            borderColor: 'rgb(255, 99, 132)',
                                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                            tension: 0.1,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: 'top', labels: { color: '#4B5563' } },
                                        tooltip: { backgroundColor: '#4B5563' },
                                    },
                                    scales: {
                                        x: {
                                            grid: { color: '#E5E7EB' },
                                            ticks: { color: '#4B5563' },
                                        },
                                        y: {
                                            grid: { color: '#E5E7EB' },
                                            ticks: { color: '#4B5563' },
                                        },
                                    },
                                }}
                                height={250}
                            />
                        </div>
                    </div>
                </div>

                {/* ARPU (Average Revenue Per User) */}
                <div className="bg-gradient-to-r from-teal-100 to-teal-200 p-6 rounded-xl shadow-lg h-[350px] overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-full">
                        <ArrowTrendingUpIcon className="w-10 h-10 text-teal-500 mb-4" />
                        <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">Average Revenue Per User (ARPU)</h3>
                        <div style={{ height: '250px' }}>
                            <Line
                                data={{
                                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                                    datasets: [
                                        {
                                            label: 'ARPU ($)',
                                            data: arpuData,
                                            borderColor: 'rgb(75, 192, 192)',
                                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                            tension: 0.1,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: true, position: 'top', labels: { color: '#4B5563' } },
                                        tooltip: { backgroundColor: '#4B5563' },
                                    },
                                    scales: {
                                        x: {
                                            grid: { color: '#E5E7EB' },
                                            ticks: { color: '#4B5563' },
                                        },
                                        y: {
                                            grid: { color: '#E5E7EB' },
                                            ticks: { color: '#4B5563' },
                                        },
                                    },
                                }}
                                height={250}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

const SubscriptionPlans = () => {
    return (
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">Subscription Plans</h2>

            {/* Top Performing Subscription Plans Section */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-6 rounded-xl mb-8 shadow-lg">
                <h3 className="text-lg font-medium mb-4 text-gray-800 text-center">Top Performing Subscription Plans</h3>


                {/* Grid layout for detailed plan info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Basic Plan */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <p className="font-semibold text-xl text-gray-800">Basic Plan</p>
                        <p className="text-sm text-gray-500">Revenue: $25,000</p>
                        <p className="text-sm text-gray-500">Number of Users: 1,500</p>
                        <p className="text-sm text-gray-500">Conversion Rate: 3%</p>
                        <p className="text-sm text-gray-500">Churn Rate: 5%</p>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <p className="font-semibold text-xl text-gray-800">Premium Plan</p>
                        <p className="text-sm text-gray-500">Revenue: $35,000</p>
                        <p className="text-sm text-gray-500">Number of Users: 2,200</p>
                        <p className="text-sm text-gray-500">Conversion Rate: 5%</p>
                        <p className="text-sm text-gray-500">Churn Rate: 3%</p>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <p className="font-semibold text-xl text-gray-800">Enterprise Plan</p>
                        <p className="text-sm text-gray-500">Revenue: $17,500</p>
                        <p className="text-sm text-gray-500">Number of Users: 1,000</p>
                        <p className="text-sm text-gray-500">Conversion Rate: 7%</p>
                        <p className="text-sm text-gray-500">Churn Rate: 2%</p>
                    </div>

                </div>
            </div>
        </section>
    );
};

const AnalyticsDashboard = () => {
    return (
        <div>
            <RevenueTracking />
            <SubscriptionPlans />
        </div>
    );
};

export default AnalyticsDashboard;
