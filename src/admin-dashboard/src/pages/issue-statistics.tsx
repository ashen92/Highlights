import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { fetchIssues } from '@/services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const IssueStatistics = () => {
  const [issueData, setIssueData] = useState({
    labels: [] as string[],
    datasets: [{
      label: '',
      data: [] as number[],
      backgroundColor: '',
      borderColor: '',
      borderWidth: 1,
    }],
  });

  const [issueCategoryData, setIssueCategoryData] = useState({
    labels: [] as string[],
    datasets: [{
      label: '',
      data: [] as number[],
      backgroundColor: [] as string[],
      borderColor: [] as string[],
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issues = await fetchIssues();
        const issueTitlesCount: { [key: string]: number } = {};

        issues.forEach((issue) => {
          const title = issue.title; 
          
          if (!issueTitlesCount[title]) {
            issueTitlesCount[title] = 0;
          }

          issueTitlesCount[title]++;
        });

        setIssueData({
          labels: Object.keys(issueTitlesCount),
          datasets: [
            {
              label: 'Number of Issues by Title',
              data: Object.values(issueTitlesCount),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setIssueCategoryData({
          labels: Object.keys(issueTitlesCount),
          datasets: [
            {
              label: 'Issue Titles Distribution',
              data: Object.values(issueTitlesCount),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchData();
  }, []);

  if (!issueData || !issueCategoryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Issue Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Issues by Title</h3>
            <Bar data={issueData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                  },
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }} />
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Issue Titles Distribution</h3>
            <Pie data={issueCategoryData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.raw} issues`,
                  },
                },
              },
            }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default IssueStatistics;
