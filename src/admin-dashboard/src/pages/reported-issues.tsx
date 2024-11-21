import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { deleteIssue, fetchIssues,  } from '@/services/api'; 

interface ReportedIssue {
  id: number;
  title: string;
  description: string;
  userId: string;
  dueDate: string;
 
}

const ReportedIssues = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [issues, setIssues] = useState<ReportedIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<ReportedIssue | null>(null);

  useEffect(() => {
    // Fetch issues from the API when the component mounts
    const loadIssues = async () => {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    loadIssues();
  }, []);

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    
  );

  const handleDelete = async (id: number) => {
    try {
        await deleteIssue(id);
        setIssues(issues.filter(issue => issue.id !== id)); // Remove the deleted issue from the state
        if (selectedIssue && selectedIssue.id === id) { // Corrected the condition
            setSelectedIssue(null); // Clear the selected issue if it was deleted
        }
    } catch (error) {
        console.error("Error deleting issue:", error);
    }
};


  return (
    <div className="p-6 space-y-6">
      <section className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reported Issues</h2>
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By(User Id)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map(issue => (
                <tr key={issue.id} onClick={() => setSelectedIssue(issue)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(issue.dueDate).toISOString().slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-600 cursor-pointer" title="View Details" />
                    <TrashIcon 
                      className="w-5 h-5 text-red-600 cursor-pointer" 
                      title="Delete" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering row click event
                        handleDelete(issue.id);
                      }} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedIssue && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Issue Details</h3>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">Titmmle: {selectedIssue.title}</p>
              <p className="text-sm font-medium text-gray-900">Description: {selectedIssue.description}</p>
              <p className="text-sm font-medium text-gray-900">Reported By(User Id): {selectedIssue.userId}</p>
              <p className="text-xs text-gray-500 mt-2">
                Timestamp: {new Date(selectedIssue.dueDate).toISOString().slice(0, 10)}
              </p>              
              </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReportedIssues;
