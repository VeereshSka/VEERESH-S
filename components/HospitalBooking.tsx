
import React, { useState } from 'react';
import type { HospitalBooking } from '../types';

const initialFormState = {
  patientName: '',
  hospitalName: 'KMC Hospital, Mangalore',
  amount: '',
};

const BookingPaymentModal: React.FC<{
  booking: Omit<HospitalBooking, 'id' | 'bookingDate' | 'status'>;
  onClose: () => void;
  onConfirmPayment: () => void;
}> = ({ booking, onClose, onConfirmPayment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Confirm Booking</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Patient:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{booking.patientName}</span>
          <span className="font-semibold text-gray-600 dark:text-gray-400">Hospital:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{booking.hospitalName}</span>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 mt-3 pt-3">
            <span className="text-lg font-bold text-gray-800 dark:text-white">Booking Amount</span>
            <span className="text-lg font-bold text-gray-800 dark:text-white">₹{Number(booking.amount).toLocaleString('en-IN')}</span>
        </div>

        <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Pay Using QR Code</h3>
            <div className="flex justify-center my-4">
                <div 
                    className="w-56 h-56 rounded-lg bg-cover bg-center border border-gray-200 dark:border-gray-700"
                    style={{ backgroundImage: 'url(https://i.ibb.co/fF01p2D/phonepe-qr.png)' }}
                    role="img"
                    aria-label="Payment QR Code"
                ></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Scan to pay <span className="font-bold text-lg text-gray-800 dark:text-gray-200">₹{Number(booking.amount).toLocaleString('en-IN')}</span> and confirm your booking.</p>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-sm text-left">
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Or Pay via Bank Transfer</p>
                <div className="space-y-1 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Account No:</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">123456789012</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">IFSC Code:</span>
                        <span className="font-mono text-gray-800 dark:text-gray-200">ABCD0123456</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={onConfirmPayment} 
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
                Confirm Payment
            </button>
        </div>
      </div>
    </div>
  );
};

const HospitalBooking: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [bookings, setBookings] = useState<HospitalBooking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Omit<HospitalBooking, 'id' | 'bookingDate' | 'status'> | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.amount || Number(formData.amount) <= 0) {
      setError('Please provide a valid patient name and booking amount.');
      return;
    }
    setError('');
    setCurrentBooking({
      patientName: formData.patientName,
      hospitalName: formData.hospitalName,
      amount: Number(formData.amount),
    });
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!currentBooking) return;

    const newBooking: HospitalBooking = {
        ...currentBooking,
        id: `HB-${Date.now()}`,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
    };

    setBookings(prev => [newBooking, ...prev]);
    setIsModalOpen(false);
    setCurrentBooking(null);
    setFormData(initialFormState);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full flex flex-col">
        {isModalOpen && currentBooking && (
            <BookingPaymentModal 
                booking={currentBooking}
                onClose={() => setIsModalOpen(false)}
                onConfirmPayment={handleConfirmPayment}
            />
        )}
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Book Hospital Admission</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Prepay a booking amount for a patient's admission.
        </p>

        {success ? (
            <div className="flex flex-col items-center justify-center h-full bg-green-50 dark:bg-green-900/30 rounded-lg p-6 text-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h4 className="text-xl font-bold text-green-800 dark:text-green-300">Booking Confirmed!</h4>
                <p className="text-gray-600 dark:text-gray-400">The payment was successful and the booking is complete.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Name</label>
                    <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleInputChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg" />
                </div>
                 <div>
                    <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hospital</label>
                    <select name="hospitalName" id="hospitalName" value={formData.hospitalName} onChange={handleInputChange} className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <option>KMC Hospital, Mangalore</option>
                        <option>AJ Hospital, Mangalore</option>
                        <option>McGAN Hospital, Shivamogga</option>
                        <option>Sarji Hospital, Shivamogga</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Booking Amount (₹)</label>
                    <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleInputChange} required className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg" placeholder="e.g., 5000" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                 <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors">
                    Proceed to Payment
                </button>
            </form>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex-1 flex flex-col">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Bookings</h4>
            {bookings.length > 0 ? (
                <ul className="space-y-3 overflow-y-auto">
                    {bookings.map(booking => (
                        <li key={booking.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-200">{booking.patientName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{booking.hospitalName} &bull; {booking.bookingDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-green-600 dark:text-green-400">₹{booking.amount.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Confirmed</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                    No recent bookings.
                </div>
            )}
        </div>

    </div>
  );
};

export default HospitalBooking;
