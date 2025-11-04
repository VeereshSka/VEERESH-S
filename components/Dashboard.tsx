import React from 'react';
import PrognosisPredictor from './PrognosisPredictor';
import ClinicLocator from './HospitalLocator';
import HospitalBooking from './HospitalBooking';

// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactElement }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
      {icon}
    </div>
  </div>
);


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Registered Patients" value="342" icon={<svg className="h-6 w-6 text-blue-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Available Health Workers" value="14" icon={<svg className="h-6 w-6 text-blue-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg>} />
        <StatCard title="Consultations Today" value="32" icon={<svg className="h-6 w-6 text-blue-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        <StatCard title="Active Home Visits" value="18" icon={<svg className="h-6 w-6 text-blue-500" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <ClinicLocator />
           <HospitalBooking />
        </div>
        <div className="lg:col-span-1">
          <PrognosisPredictor />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
