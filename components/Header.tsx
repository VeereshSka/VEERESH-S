
import React from 'react';
import type { Profile } from '../types';

interface HeaderProps {
  title: string;
  profile: Profile;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, profile, theme, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h2>
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring">
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="ml-4 flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={profile.avatarUrl}
            alt="User avatar"
          />
          <div className="ml-2 hidden sm:block">
            <p className="text-sm font-medium text-gray-800 dark:text-white">{profile.name}</p>
            <p className="text-xs text-gray-500">{profile.title}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
