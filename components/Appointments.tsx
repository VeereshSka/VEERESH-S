
import React, { useState, useEffect } from 'react';
import type { Appointment, Doctor } from '../types';

const initialAppointments: Appointment[] = [
  { id: 'A001', patientName: 'John Doe', doctorName: 'Dr. Anjali Rao', date: '2024-08-15', time: '10:00 AM', reason: 'Annual Checkup', status: 'Scheduled' },
  { id: 'A002', patientName: 'Jane Smith', doctorName: 'Dr. Prakash Kamath', date: '2024-08-15', time: '11:30 AM', reason: 'Follow-up on fracture', status: 'Scheduled' },
  { id: 'A003', patientName: 'Robert Brown', doctorName: 'Dr. Rajesh Alva', date: '2024-08-16', time: '02:00 PM', reason: 'Consultation for headaches', status: 'Scheduled' },
];

const emptyFormState = {
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    reason: '',
};

interface AppointmentsProps {
    doctorToBook: Doctor | null;
}

const Appointments: React.FC<AppointmentsProps> = ({ doctorToBook }) => {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [formData, setFormData] = useState(emptyFormState);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        // Only pre-fill doctor if coming from the Doctors page and not currently editing
        if (doctorToBook && !editingId) {
            setFormData(prev => ({ ...prev, doctorName: doctorToBook.name }));
        }
    }, [doctorToBook, editingId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleEditAppointment = (appointment: Appointment) => {
        setEditingId(appointment.id);
        setFormData({
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            date: appointment.date,
            time: appointment.time,
            reason: appointment.reason,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(emptyFormState);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patientName || !formData.doctorName || !formData.date || !formData.time) {
            alert('Please fill out all required fields.');
            return;
        }

        if (editingId) {
            setAppointments(prev => prev.map(app => 
                app.id === editingId ? { ...app, ...formData } : app
            ));
        } else {
            const newAppointment: Appointment = {
                id: `A${String(Date.now()).slice(-4)}`,
                ...formData,
                status: 'Scheduled',
            };
            setAppointments(prev => [newAppointment, ...prev]);
        }

        setEditingId(null); // Exit edit mode if we were in it
        setFormData(emptyFormState); // Reset form
    };

    const handleCancelAppointment = (id: string) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            setAppointments(prev => prev.filter(app => app.id !== id));
        }
    };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Appointment Scheduling</h2>

      {/* Appointment Booking Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {editingId ? 'Reschedule Appointment' : 'Book a New Appointment'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Name</label>
            <input type="text" id="patientName" name="patientName" value={formData.patientName} onChange={handleInputChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Doctor's Name</label>
            <input type="text" id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleInputChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
            <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Visit</label>
            <input id="reason" name="reason" value={formData.reason} onChange={handleInputChange} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
          </div>
          <div className="md:col-span-full flex justify-end items-center space-x-3">
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 font-bold py-2 px-6 rounded-lg transition-colors">
                Cancel
              </button>
            )}
             <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                {editingId ? 'Update Appointment' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>

      {/* Scheduled Appointments List */}
       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white p-6">Scheduled Appointments</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient</th>
                            <th scope="col" className="px-6 py-3">Doctor</th>
                            <th scope="col" className="px-6 py-3">Date & Time</th>
                            <th scope="col" className="px-6 py-3">Reason</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{app.patientName}</td>
                                <td className="px-6 py-4">{app.doctorName}</td>
                                <td className="px-6 py-4">{app.date} at {app.time}</td>
                                <td className="px-6 py-4 truncate max-w-xs">{app.reason}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                    <button onClick={() => handleEditAppointment(app)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleCancelAppointment(app.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {appointments.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Appointments Scheduled</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Use the form above to book a new appointment.</p>
                </div>
            )}
      </div>
    </div>
  );
};

export default Appointments;
