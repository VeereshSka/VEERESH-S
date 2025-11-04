
import React from 'react';
import type { Page } from '../types';
import { ICONS } from '../constants';


interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  Icon: React.FC<{ className?: string }>;
}> = ({ page, currentPage, setCurrentPage, Icon }) => {
  const isActive = currentPage === page;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentPage(page);
      }}
      className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-500 text-white dark:bg-blue-600'
          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      <Icon className="h-6 w-6" />
      <span className="mx-4 font-medium">{page}</span>
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems: Page[] = ['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Pharmacy'];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">RuralCare Connect</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          {navItems.map((item) => (
            <div key={item} className="mb-2">
              <NavItem
                page={item}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                Icon={ICONS[item]}
              />
            </div>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <NavItem
                page={'Settings'}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                Icon={ICONS['Settings']}
          />
      </div>
    </aside>
  );
};

export default Sidebar;