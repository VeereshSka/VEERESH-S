
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import Pharmacy from './components/Pharmacy';
import Settings from './components/Settings';
import type { Page, Doctor, Profile } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [doctorToBook, setDoctorToBook] = useState<Doctor | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: 'Asha Sharma',
    title: 'Community Health Officer',
    email: 'asha.sharma@ruralcare.org',
    phone: '+91 (987) 654-3210',
    avatarUrl: 'https://randomuser.me/api/portraits/women/60.jpg',
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setDoctorToBook(doctor);
    setCurrentPage('Appointments');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Patients':
        return <Patients />;
      case 'Doctors':
        return <Doctors onBookAppointment={handleBookAppointment} />;
      case 'Appointments':
        return <Appointments doctorToBook={doctorToBook} />;
      case 'Pharmacy':
        return <Pharmacy />;
      case 'Settings':
        return <Settings profile={profile} setProfile={setProfile} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={currentPage} profile={profile} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;