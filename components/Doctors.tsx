import React, { useState, useMemo } from 'react';
import type { Doctor } from '../types';

const specialistDoctors: Doctor[] = [
  // Mangalore Doctors
  { id: 'D001', name: 'Dr. Anjali Rao', specialty: 'Cardiology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'Mangalore', phone: '+919876543210' },
  { id: 'D002', name: 'Dr. Prakash Kamath', specialty: 'Orthopedics', status: 'On Call', avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg', location: 'Mangalore', phone: '+919876543211' },
  { id: 'D003', name: 'Dr. Vidya Shenoy', specialty: 'Pediatrics', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg', location: 'Mangalore', phone: '+919876543212' },
  { id: 'D004', name: 'Dr. Rajesh Alva', specialty: 'Neurology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', location: 'Mangalore', phone: '+919876543213' },
  { id: 'D005', name: 'Dr. Suma Shetty', specialty: 'Dermatology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg', location: 'Mangalore', phone: '+919876543214' },
  { id: 'D006', name: 'Dr. Ganesh Pai', specialty: 'Gastroenterology', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/men/6.jpg', location: 'Mangalore', phone: '+919876543215' },
  { id: 'D013', name: 'Dr. Arjun Shetty', specialty: 'Urology', status: 'On Call', avatarUrl: 'https://randomuser.me/api/portraits/men/13.jpg', location: 'Mangalore', phone: '+919876543216' },
  { id: 'D014', name: 'Dr. Meera Fernandes', specialty: 'Rheumatology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/14.jpg', location: 'Mangalore', phone: '+919876543217' },
  { id: 'D015', name: 'Dr. Nithin Bhandary', specialty: 'Oncology', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/men/15.jpg', location: 'Mangalore', phone: '+919876543218' },
  { id: 'D016', name: "Dr. Prema D'Souza", specialty: 'Nephrology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/16.jpg', location: 'Mangalore', phone: '+919876543219' },


  // Shivamogga Doctors
  { id: 'D007', name: 'Dr. B. M. Suresh', specialty: 'Orthopedics', status: 'On Call', avatarUrl: 'https://randomuser.me/api/portraits/men/7.jpg', location: 'Shivamogga', phone: '+919876543220' },
  { id: 'D008', name: 'Dr. Asha Kirana', specialty: 'Gynecology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/8.jpg', location: 'Shivamogga', phone: '+919876543221' },
  { id: 'D009', name: 'Dr. Girish H', specialty: 'ENT', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/men/9.jpg', location: 'Shivamogga', phone: '+919876543222' },
  { id: 'D010', name: 'Dr. Vinayaka K. S.', specialty: 'Pediatrics', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/10.jpg', location: 'Shivamogga', phone: '+919876543223' },
  { id: 'D011', name: 'Dr. M. G. Bhat', specialty: 'General Medicine', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/men/11.jpg', location: 'Shivamogga', phone: '+919876543224' },
  { id: 'D012', name: 'Dr. G. Kodandaram', specialty: 'Cardiology', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/men/12.jpg', location: 'Shivamogga', phone: '+919876543225' },
  { id: 'D017', name: 'Dr. S. P. Hegde', specialty: 'General Surgery', status: 'On Call', avatarUrl: 'https://randomuser.me/api/portraits/men/17.jpg', location: 'Shivamogga', phone: '+919876543226' },
  { id: 'D018', name: 'Dr. Nagaraj Naik', specialty: 'Dermatology', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/men/18.jpg', location: 'Shivamogga', phone: '+919876543227' },
  { id: 'D019', name: 'Dr. Shruthi Sharma', specialty: 'Psychiatry', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/women/19.jpg', location: 'Shivamogga', phone: '+919876543228' },
  { id: 'D020', name: 'Dr. Chetan Kumar', specialty: 'Pulmonology', status: 'On Call', avatarUrl: 'https://randomuser.me/api/portraits/men/20.jpg', location: 'Shivamogga', phone: '+919876543229' },
  { id: 'D021', name: 'Dr. Santosh Kumar', specialty: 'Neurology', status: 'Available', avatarUrl: 'https://randomuser.me/api/portraits/men/21.jpg', location: 'Shivamogga', phone: '+919876543230' },
  { id: 'D022', name: 'Dr. Poornima K.', specialty: 'Gynecology', status: 'Busy', avatarUrl: 'https://randomuser.me/api/portraits/women/22.jpg', location: 'Shivamogga', phone: '+919876543231' },
];


const statusColors: { [key in Doctor['status']]: { bg: string; text: string; dot: string } } = {
  Available: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
  'On Call': { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
  Busy: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

const DoctorCard: React.FC<{ doctor: Doctor; onBookAppointment: (doctor: Doctor) => void }> = ({ doctor, onBookAppointment }) => {
    const color = statusColors[doctor.status];
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden text-center flex flex-col">
            <div className="p-6">
                <img className="w-28 h-28 rounded-full mx-auto ring-4 ring-gray-200 dark:ring-gray-700" src={doctor.avatarUrl} alt={doctor.name} />
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
                <p className="text-blue-500 dark:text-blue-400 font-medium">{doctor.specialty}</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                   </svg>
                   {doctor.location}
                </p>
                <div className={`mt-3 inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${color.bg} ${color.text}`}>
                  <span className={`h-2.5 w-2.5 rounded-full mr-2 ${color.dot}`}></span>
                  {doctor.status}
                </div>
            </div>
            <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-700/50 flex space-x-2">
                <button 
                    onClick={() => onBookAppointment(doctor)}
                    className="flex-1 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 text-sm rounded-lg transition-colors">
                    Book Appointment
                </button>
                <a 
                    href={`tel:${doctor.phone}`}
                    className="flex-1 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 text-sm rounded-lg transition-colors flex items-center justify-center space-x-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>Call</span>
                </a>
            </div>
        </div>
    );
};

interface DoctorsProps {
  onBookAppointment: (doctor: Doctor) => void;
}

const Doctors: React.FC<DoctorsProps> = ({ onBookAppointment }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<'All' | Doctor['status']>('All');
    const [locationFilter, setLocationFilter] = useState('All');

    const specialties = useMemo(() => ['All', ...Array.from(new Set(specialistDoctors.map(d => d.specialty)))], []);
    const statuses: Array<'All' | Doctor['status']> = ['All', 'Available', 'On Call', 'Busy'];
    const locations = useMemo(() => ['All', 'Mangalore', 'Shivamogga'], []);


    const filteredDoctors = useMemo(() => {
        return specialistDoctors.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = specialtyFilter === 'All' || doctor.specialty === specialtyFilter;
            const matchesStatus = statusFilter === 'All' || doctor.status === statusFilter;
            const matchesLocation = locationFilter === 'All' || doctor.location === locationFilter;
            return matchesSearch && matchesSpecialty && matchesStatus && matchesLocation;
        });
    }, [searchTerm, specialtyFilter, statusFilter, locationFilter]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Doctor Directory</h2>
            
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="lg:col-span-1">
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search by Name/Specialty</label>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g., Dr. Rao or Cardiology"
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Specialty</label>
                         <select
                            id="specialty"
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Location</label>
                         <select
                            id="location"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
                        <div className="flex space-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                            {statuses.map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`w-full py-1.5 text-sm font-semibold rounded-md transition-colors ${statusFilter === status ? 'bg-blue-500 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={onBookAppointment} />)
                ) : (
                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Doctors Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Doctors;