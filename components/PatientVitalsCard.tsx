
import React, { useState, useEffect } from 'react';
import type { Patient, PatientVitals, VitalStatus } from '../types';

interface PatientVitalsCardProps {
  initialPatient: Patient;
}

const getStatus = (vitals: PatientVitals): VitalStatus => {
  if (vitals.heartRate > 100 || vitals.heartRate < 60 || vitals.spO2 < 94 || vitals.temperature > 38.0) {
    return 'Critical';
  }
  if (vitals.heartRate > 90 || vitals.spO2 < 96 || vitals.temperature > 37.5) {
    return 'Warning';
  }
  return 'Stable';
};

const statusColors: { [key in VitalStatus]: { bg: string; text: string; dot: string } } = {
  Stable: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
  Warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
  Critical: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

const PatientVitalsCard: React.FC<PatientVitalsCardProps> = ({ initialPatient }) => {
  const [patient, setPatient] = useState<Patient>(initialPatient);

  useEffect(() => {
    const interval = setInterval(() => {
      setPatient(prevPatient => {
        const newVitals: PatientVitals = {
          heartRate: prevPatient.heartRate + Math.floor(Math.random() * 5) - 2,
          spO2: Math.max(90, Math.min(100, prevPatient.spO2 + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.8 ? 1 : 0))),
          temperature: parseFloat((prevPatient.temperature + (Math.random() * 0.4) - 0.2).toFixed(1)),
        };
        const newStatus = getStatus(newVitals);
        return { ...prevPatient, ...newVitals, status: newStatus };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const color = statusColors[patient.status];

  return (
    <div className={`p-5 rounded-xl shadow-md transition-all duration-300 bg-white dark:bg-gray-800 border-l-4 ${color.dot.replace('bg','border')}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg text-gray-800 dark:text-white">{patient.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Room {patient.room}</p>
        </div>
        <div className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center ${color.bg} ${color.text}`}>
          <span className={`h-2 w-2 rounded-full mr-2 ${color.dot}`}></span>
          {patient.status}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Heart Rate</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{patient.heartRate} <span className="text-sm font-normal">bpm</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">SpO2</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{patient.spO2} <span className="text-sm font-normal">%</span></p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Temp</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{patient.temperature.toFixed(1)} <span className="text-sm font-normal">°C</span></p>
        </div>
      </div>
    </div>
  );
};

export default PatientVitalsCard;
