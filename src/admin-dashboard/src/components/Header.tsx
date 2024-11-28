import { useState } from 'react';
import { Bars3Icon, UserCircleIcon, BellIcon } from '@heroicons/react/24/outline'; // Ensure these icons are correct
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';

const sampleNotifications = [
  { id: 1, title: 'New User Registered', message: 'John Doe has registered as a new user on the platform.', timestamp: '2024-07-28 14:32' },
  { id: 2, title: 'System Update Completed', message: 'The system update to version 2.1.0 has been successfully completed.', timestamp: '2024-07-27 09:15' },
  { id: 3, title: 'Scheduled Downtime', message: 'Server maintenance is scheduled for July 30th, 2024 from 1:00 AM to 3:00 AM.', timestamp: '2024-07-26 16:45' },
];

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setNotificationOpen(!notificationOpen);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <header className={`p-4 flex items-center justify-between shadow-md transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 bg-gray-200 text-gray-800 rounded dark:bg-gray-700 dark:text-gray-100"
          onClick={toggleSidebar}
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle Button
        <button
          className="p-2 bg-gray-200 rounded dark:bg-gray-700"
          onClick={handleDarkModeToggle}
        >
          {darkMode ? (
            <span className="text-gray-800 dark:text-gray-100">🌞</span> // Light mode icon
          ) : (
            <span className="text-gray-800 dark:text-gray-100">🌜</span> // Dark mode icon
          )}
        </button> */}

        {/* Notification Button */}
        <div className="relative">
          <button 
            className="p-2 text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100"
            onClick={toggleNotificationDropdown}
          >
            <BellIcon className="w-6 h-6" />
          </button>
          {notificationOpen && (
            <NotificationDropdown notifications={sampleNotifications} />
          )}
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button 
            className="p-2 text-gray-800 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-100"
            onClick={toggleDropdown}
          >
            <UserCircleIcon className="w-6 h-6" />
          </button>
          {dropdownOpen && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
};

export default Header;
