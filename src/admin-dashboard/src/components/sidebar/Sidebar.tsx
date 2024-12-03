import { useState } from 'react';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import SidebarItem from './SidebarItem';

const Sidebar = ({ toggleSidebar, isOpen }: { toggleSidebar: () => void; isOpen: boolean }) => {
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-800 via-blue-900 to-gray-950 text-white z-40 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out rounded-r-lg`}
      >

        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/logo.png" alt="Logo" width={48} height={48} className="w-12 h-12" />
            <span className="text-xl font-semibold">Highlights Admin</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 bg-transparent text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-4">
            <SidebarItem href="/dashboard" icon="home" text="Dashboard" />
            <SidebarItem href="/users" icon="user-group" text="Users" />
            <SidebarItem href="/updatedailytips" icon="pencil" text="Daily Tips" />
            <SidebarItem href="/reported-issues" icon="exclamation-circle" text="Reported Issues" />
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
