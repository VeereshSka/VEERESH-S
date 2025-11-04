import React, { useState } from 'react';
import { getDiagnosis, findNearbyFacilities } from '../services/geminiService';
import type { MedicalFacility, DiagnosisResult } from '../types';

const DiagnosisAssistant: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<DiagnosisResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [facilities, setFacilities] = useState<MedicalFacility[] | null>(null);
  const [findingFacilities, setFindingFacilities] = useState(false);
  const [locationError, setLocationError] = useState('');

  const commonSymptoms = ['Fever', 'Headache', 'Chills', 'Muscle Pain', 'Cough', 'Shortness of Breath', 'Sore Throat', 'Nausea', 'Fatigue'];

  const handleSymptomClick = (symptom: string) => {
    setSymptoms(prev => {
        if (!prev) return symptom;
        // A simple check to avoid adding duplicate symptoms from tags
        if (prev.toLowerCase().includes(symptom.toLowerCase())) return prev;
        return `${prev}, ${symptom}`;
    });
  };

  const handleAnalysis = async () => {
    if (!symptoms.trim()) {
      setError('Please enter patient symptoms.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await getDiagnosis(symptoms);
      setAnalysis(result);
    } catch (e) {
      setError('Failed to get analysis. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFindClinics = () => {
    if (!symptoms.trim()) {
      setError('Please enter symptoms to find clinics.');
      return;
    }
    setError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setFindingFacilities(true);
    setLocationError('');
    setFacilities(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await findNearbyFacilities(symptoms, { latitude, longitude });
          setFacilities(result);
        } catch (e) {
          setLocationError('Could not find clinics. Please try again.');
          console.error(e);
        } finally {
          setFindingFacilities(false);
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enable location permissions.');
        setFindingFacilities(false);
        console.error(error);
      }
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">AI Diagnosis & Clinic Finder</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Describe the patient's symptoms below, or select from the common symptoms to get started.
      </p>
      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="w-full h-28 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="e.g., High fever, persistent dry cough, headache..."
        aria-label="Patient Symptoms"
      />
      <div className="mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Click to add common symptoms:</p>
        <div className="flex flex-wrap gap-2">
            {commonSymptoms.map(symptom => (
                <button 
                    key={symptom} 
                    onClick={() => handleSymptomClick(symptom)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                    aria-label={`Add symptom: ${symptom}`}
                >
                    {symptom}
                </button>
            ))}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
            onClick={handleAnalysis}
            disabled={loading || !symptoms.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            )}
            {loading ? 'Analyzing...' : 'Get AI Analysis'}
        </button>
        <button
            onClick={handleFindClinics}
            disabled={findingFacilities || !symptoms.trim()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {findingFacilities && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {findingFacilities ? 'Finding...' : 'Find Nearby Clinics'}
        </button>
      </div>
      
      {(analysis || facilities || locationError || findingFacilities) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-y-auto flex-1 space-y-6">
            {analysis && analysis.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Possible Conditions:</h4>
                <ul className="mt-3 space-y-3">
                    {analysis.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.disease}</span>
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">{item.category}</span>
                        </li>
                    ))}
                </ul>
              </div>
            )}
             {analysis?.length === 0 && !loading && (
                 <p className="text-base text-gray-500 dark:text-gray-400 mt-2">No specific conditions could be identified from the symptoms provided.</p>
            )}
            
            {locationError && <p className="text-red-500 text-base">{locationError}</p>}
            
            {facilities && facilities.length > 0 && (
                <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Suggested Clinics & PHCs:</h4>
                <ul className="mt-3 space-y-3">
                    {facilities.map((facility, index) => (
                    <li key={index}>
                        <a 
                        href={facility.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                </div>
            )}

            {facilities?.length === 0 && !findingFacilities && (
                <p className="text-base text-gray-500 dark:text-gray-400 mt-2">Could not find specific clinics for the entered symptoms. Please try again with different terms.</p>
            )}
        </div>
      )}

    </div>
  );
};

export default DiagnosisAssistant;