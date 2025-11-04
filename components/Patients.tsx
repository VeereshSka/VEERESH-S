
import React, { useState, useMemo } from 'react';
import type { Patient, PatientVitals, VitalStatus } from '../types';

// Mock data, can be expanded or fetched from an API
const initialPatients: Patient[] = [
  { id: 'P001', name: 'John Doe', age: 45, gender: 'Male', room: '301A', heartRate: 78, spO2: 98, temperature: 37.0, status: 'Stable', phone: '555-0101', address: '123 Maple St, Springfield, USA', specialist: 'Dr. Anjali Rao (Cardiology)', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', diagnosisHistory: [
    {
      date: '2024-07-20',
      symptoms: 'Chest pain, shortness of breath, dizziness',
      conditions: [
        { disease: 'Angina Pectoris', category: 'Cardiology' },
        { disease: 'Myocardial Infarction', category: 'Cardiology' },
      ]
    },
    {
      date: '2024-06-15',
      symptoms: 'Fatigue, persistent cough',
      conditions: [
        { disease: 'Common Cold', category: 'General Medicine' },
        { disease: 'Bronchitis', category: 'Respiratory' },
      ]
    }
  ]},
  { id: 'P002', name: 'Jane Smith', age: 62, gender: 'Female', room: '302B', heartRate: 110, spO2: 95, temperature: 38.5, status: 'Warning', phone: '555-0102', address: '456 Oak Ave, Springfield, USA', specialist: 'Dr. Prakash Kamath (Orthopedics)', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', diagnosisHistory: [
      {
        date: '2024-08-01',
        symptoms: 'Swelling in right knee, difficulty walking',
        conditions: [
          { disease: 'Osteoarthritis', category: 'Orthopedics' },
          { disease: 'Torn Meniscus', category: 'Orthopedics' },
        ]
      }
  ]},
  { id: 'P003', name: 'Robert Brown', age: 78, gender: 'Male', room: '303C', heartRate: 55, spO2: 92, temperature: 36.5, status: 'Critical', phone: '555-0103', address: '789 Pine Ln, Springfield, USA', specialist: 'Dr. Rajesh Alva (Neurology)', avatarUrl: 'https://randomuser.me/api/portraits/men/34.jpg' },
  { id: 'P004', name: 'Emily White', age: 34, gender: 'Female', room: '304D', heartRate: 85, spO2: 99, temperature: 37.2, status: 'Stable', phone: '555-0104', address: '101 Birch Rd, Springfield, USA', specialist: 'Dr. Vidya Shenoy (Pediatrics)', avatarUrl: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { id: 'P005', name: 'Michael Johnson', age: 55, gender: 'Male', room: '305E', heartRate: 92, spO2: 97, temperature: 37.1, status: 'Stable', phone: '555-0105', address: '212 Cedar Blvd, Springfield, USA', specialist: 'Dr. Suma Shetty (Dermatology)', avatarUrl: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 'P006', name: 'Sarah Davis', age: 68, gender: 'Female', room: '306F', heartRate: 98, spO2: 96, temperature: 37.8, status: 'Warning', phone: '555-0106', address: '333 Elm Ct, Springfield, USA', specialist: 'Dr. Ganesh Pai (Gastroenterology)', avatarUrl: 'https://randomuser.me/api/portraits/women/50.jpg' },
];

// Re-using logic from PatientVitalsCard for consistency
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

const AddPatientModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Omit<Patient, 'id' | 'status' | 'avatarUrl'> & PatientVitals) => void;
}> = ({ isOpen, onClose, onAddPatient }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    room: '',
    phone: '',
    address: '',
    specialist: '',
    heartRate: 80,
    spO2: 98,
    temperature: 37.0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Check if the target is an input of type 'number' to correctly parse the value.
    const isNumberInput = e.target instanceof HTMLInputElement && e.target.type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumberInput ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient(formData);
    // Reset form for next entry
    setFormData({
        name: '',
        age: 0,
        gender: 'Male',
        room: '',
        phone: '',
        address: '',
        specialist: '',
        heartRate: 80,
        spO2: 98,
        temperature: 37.0,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Patient</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
            </div>
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
                <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
            </div>
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>
             <div>
                <label htmlFor="room" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Room No.</label>
                <input type="text" name="room" id="room" value={formData.room} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
            </div>
            <div>
                <label htmlFor="specialist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Specialist</label>
                <input type="text" name="specialist" id="specialist" value={formData.specialist} onChange={handleChange} placeholder="e.g., Dr. Smith (Cardiology)" required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
            </div>
            <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
            </div>
          </div>
           <fieldset className="p-4 border rounded-lg border-gray-200 dark:border-gray-600">
                <legend className="px-2 text-sm font-medium text-gray-700 dark:text-gray-300">Initial Vitals</legend>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <div>
                        <label htmlFor="heartRate" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Heart Rate (bpm)</label>
                        <input type="number" name="heartRate" id="heartRate" value={formData.heartRate} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="spO2" className="block text-xs font-medium text-gray-500 dark:text-gray-400">SpO2 (%)</label>
                        <input type="number" name="spO2" id="spO2" value={formData.spO2} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="temperature" className="block text-xs font-medium text-gray-500 dark:text-gray-400">Temperature (°C)</label>
                        <input type="number" step="0.1" name="temperature" id="temperature" value={formData.temperature} onChange={handleChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                    </div>
                 </div>
           </fieldset>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Save Patient</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PatientDetailModal: React.FC<{ patient: Patient; onClose: () => void; }> = ({ patient, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Patient Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-5">
                            <div className="flex flex-col items-center">
                                <img className="h-28 w-28 rounded-full object-cover ring-4 ring-blue-500/50" src={patient.avatarUrl} alt={patient.name} />
                                <h3 className="text-2xl font-bold mt-4 text-gray-800 dark:text-white">{patient.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{patient.id} &bull; Room {patient.room}</p>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-600 dark:text-gray-400">Age:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{patient.age}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-600 dark:text-gray-400">Gender:</span>
                                    <span className="text-gray-800 dark:text-gray-200">{patient.gender}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-600 dark:text-gray-400">Phone:</span>
                                    <a href={`tel:${patient.phone}`} className="text-blue-500 hover:underline">{patient.phone}</a>
                                </div>
                                 <div className="flex flex-col">
                                    <span className="font-semibold text-gray-600 dark:text-gray-400">Address:</span>
                                    <span className="text-gray-800 dark:text-gray-200 text-right">{patient.address}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-600 dark:text-gray-400">Specialist:</span>
                                    <span className="text-gray-800 dark:text-gray-200 text-right">{patient.specialist}</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">AI Diagnosis History</h3>
                            {patient.diagnosisHistory && patient.diagnosisHistory.length > 0 ? (
                                <ul className="space-y-4">
                                    {patient.diagnosisHistory.map((item, index) => (
                                        <li key={index} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold">Symptoms Provided:</span> {item.symptoms}
                                            </p>
                                            <div className="mt-3">
                                                <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">Identified Conditions:</p>
                                                <ul className="mt-2 space-y-2">
                                                    {item.conditions.map((cond, cIndex) => (
                                                        <li key={cIndex} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-gray-800 rounded-md">
                                                            <span className="text-gray-800 dark:text-gray-200">{cond.disease}</span>
                                                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300">{cond.category}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                    <p className="text-gray-500 dark:text-gray-400">No AI diagnosis history available for this patient.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Patients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const filteredPatients = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        if (!lowercasedTerm) return patients;

        return patients.filter(patient => 
            patient.name.toLowerCase().includes(lowercasedTerm) ||
            patient.id.toLowerCase().includes(lowercasedTerm) ||
            patient.room.toLowerCase().includes(lowercasedTerm) ||
            (patient.phone && patient.phone.includes(searchTerm)) ||
            (patient.specialist && patient.specialist.toLowerCase().includes(lowercasedTerm))
        );
    }, [patients, searchTerm]);

    const handleAddPatient = (patientData: Omit<Patient, 'id' | 'status' | 'avatarUrl'> & PatientVitals) => {
        const newId = `P${String(Date.now()).slice(-4)}`; // Simple unique ID
        const vitals = { heartRate: patientData.heartRate, spO2: patientData.spO2, temperature: patientData.temperature };
        const newPatient: Patient = {
            id: newId,
            ...patientData,
            ...vitals,
            status: getStatus(vitals),
            avatarUrl: `https://randomuser.me/api/portraits/${patientData.gender === 'Female' ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`
        };
        setPatients(prev => [newPatient, ...prev]);
        setIsModalOpen(false);
    };

    const handleDeletePatient = (patientId: string) => {
        if (window.confirm('Are you sure you want to remove this patient?')) {
            setPatients(prev => prev.filter(p => p.id !== patientId));
        }
    };


    return (
        <div className="space-y-6">
            <AddPatientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddPatient={handleAddPatient} />
            {selectedPatient && <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Patient Management</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    <span>Add New Patient</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                 <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Search patients by name, ID, room, phone, or specialist..."
                    aria-label="Search Patients"
                />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient Profile</th>
                            <th scope="col" className="px-6 py-3">Age</th>
                            <th scope="col" className="px-6 py-3">Room</th>
                            <th scope="col" className="px-6 py-3">Assigned Specialist</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => {
                            const color = statusColors[patient.status];
                            return (
                                <tr key={patient.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-11 w-11 rounded-full object-cover mr-4 flex-shrink-0" src={patient.avatarUrl} alt={patient.name} />
                                            <div>
                                                <div className="font-bold text-base">{patient.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{patient.id} &bull; {patient.gender}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{patient.age}</td>
                                    <td className="px-6 py-4">{patient.room}</td>
                                    <td className="px-6 py-4">{patient.specialist}</td>
                                    <td className="px-6 py-4">
                                         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
                                            <span className={`h-2 w-2 rounded-full mr-2 ${color.dot}`}></span>
                                            {patient.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => setSelectedPatient(patient)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View Details</button>
                                        <button onClick={() => handleDeletePatient(patient.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Patients Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">No patients match your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Patients;