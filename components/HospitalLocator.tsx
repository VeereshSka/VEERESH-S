import React, { useState } from 'react';
import { findNearbyFacilities } from '../services/geminiService';
import type { MedicalFacility } from '../types';

const HospitalLocator: React.FC = () => {
    const [symptoms, setSymptoms] = useState('');
    const [facilities, setFacilities] = useState<MedicalFacility[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const executeSearch = (searchTerm: string) => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setLoading(true);
        setError('');
        setFacilities(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const results = await findNearbyFacilities(searchTerm, { latitude, longitude });
                    setFacilities(results);
                } catch (e) {
                    setError('Could not find facilities. Please try a different search term or check your connection.');
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable location permissions.');
                setLoading(false);
                console.error(err);
            }
        );
    };

    const handleSymptomSearch = () => {
        executeSearch(symptoms.trim() || 'hospital');
    }

    const handleFindNearest = () => {
        executeSearch('nearest hospital');
    }
        
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Hospital & Clinic Locator</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Find medical facilities near you. For specific needs, enter a symptom or specialty below.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleSymptomSearch()}
                    placeholder="e.g., 'Cardiology' or 'Fever'"
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    aria-label="Symptom or specialty input"
                />
                <button
                    onClick={handleSymptomSearch}
                    disabled={loading}
                    className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                    aria-label="Search for hospitals by symptom"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2">Search</span>
                </button>
            </div>
             <div className="mb-4">
                <button
                    onClick={handleFindNearest}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Find nearest general hospital"
                >
                    {loading ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                    )}
                    <span className="font-semibold">Find Nearest Hospital</span>
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <div className="flex-1 overflow-y-auto border-t border-gray-200 dark:border-gray-700 pt-4">
                {loading && !facilities && <div className="p-4 text-center text-gray-500 dark:text-gray-400">Searching...</div>}
                {facilities && facilities.length > 0 && (
                    <ul className="space-y-3">
                        {facilities.map((facility, index) => (
                            <li key={index}>
                                <a 
                                    href={facility.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-base font-medium text-gray-800 dark:text-gray-200">{facility.title}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
                {facilities?.length === 0 && !loading && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                       <p className="font-semibold">No Results Found</p>
                       <p className="text-sm mt-1">Please try a different search term or check your location settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalLocator;