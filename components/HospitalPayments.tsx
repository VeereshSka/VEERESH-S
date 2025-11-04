
import React, { useState, useMemo } from 'react';
import type { Invoice } from '../types';

// Mock data for initial state
const initialInvoices: Invoice[] = [
  { id: 'INV-001', patientName: 'John Doe', date: '2024-08-10', amount: 4500.00, status: 'Paid', items: [
      { description: 'Consultation Fee', cost: 500 },
      { description: 'Lab Tests (Blood Work)', cost: 1500 },
      { description: 'Medication', cost: 2500 },
  ]},
  { id: 'INV-002', patientName: 'Jane Smith', date: '2024-08-05', amount: 12500.00, status: 'Due', items: [
      { description: 'Orthopedic Consultation', cost: 800 },
      { description: 'X-Ray', cost: 1200 },
      { description: 'Casting & Supplies', cost: 10500 },
  ]},
  { id: 'INV-003', patientName: 'Robert Brown', date: '2024-07-20', amount: 8000.00, status: 'Overdue', items: [
      { description: 'Neurology Consultation', cost: 1000 },
      { description: 'MRI Scan', cost: 7000 },
  ]},
  { id: 'INV-004', patientName: 'Emily White', date: '2024-08-12', amount: 1200.00, status: 'Paid', items: [
      { description: 'Pediatric Checkup', cost: 600 },
      { description: 'Vaccinations', cost: 600 },
  ]},
];

type InvoiceStatus = 'Paid' | 'Due' | 'Overdue';

const statusColors: { [key in InvoiceStatus]: { bg: string; text: string; dot: string } } = {
  Paid: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
  Due: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
  Overdue: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

const PaymentModal: React.FC<{
  invoice: Invoice;
  onClose: () => void;
  onConfirmPayment: (invoiceId: string) => void;
}> = ({ invoice, onClose, onConfirmPayment }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Invoice Details</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Invoice ID:</span>
          <span className="font-mono text-gray-800 dark:text-gray-200">{invoice.id}</span>
          <span className="font-semibold text-gray-600 dark:text-gray-400">Patient:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{invoice.patientName}</span>
          <span className="font-semibold text-gray-600 dark:text-gray-400">Date:</span>
          <span className="text-gray-800 dark:text-gray-200">{invoice.date}</span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Itemized Bill:</h4>
            <ul className="space-y-1 text-sm">
                {invoice.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                        <span>{item.description}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">₹{item.cost.toLocaleString('en-IN')}</span>
                    </li>
                ))}
            </ul>
             <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 mt-3 pt-3">
                <span className="text-lg font-bold text-gray-800 dark:text-white">Total Amount</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>
        </div>

        {invoice.status !== 'Paid' ? (
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
            <p className="text-gray-500 dark:text-gray-400 text-sm">Scan the code to pay <span className="font-bold text-lg text-gray-800 dark:text-gray-200">₹{invoice.amount.toLocaleString('en-IN')}</span>.</p>
            
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
              onClick={() => onConfirmPayment(invoice.id)} 
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Confirm Payment
            </button>
          </div>
        ) : (
             <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <p className="font-semibold text-lg text-green-800 dark:text-green-300">This invoice has been paid.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const HospitalPayments: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const handleOpenModal = (invoice: Invoice) => {
      setSelectedInvoice(invoice);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setSelectedInvoice(null);
      setIsModalOpen(false);
    };
  
    const handleConfirmPayment = (invoiceId: string) => {
      setInvoices(prevInvoices => 
        prevInvoices.map(inv => 
          inv.id === invoiceId ? { ...inv, status: 'Paid' as 'Paid', date: new Date().toISOString().split('T')[0] } : inv
        )
      );
      handleCloseModal();
    };

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch = invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [invoices, searchTerm, statusFilter]);

    const totals = useMemo(() => {
        const outstanding = invoices
            .filter(inv => inv.status === 'Due' || inv.status === 'Overdue')
            .reduce((sum, inv) => sum + inv.amount, 0);
        
        const paidThisMonth = invoices
            .filter(inv => {
                const invoiceDate = new Date(inv.date);
                const today = new Date();
                return inv.status === 'Paid' &&
                       invoiceDate.getMonth() === today.getMonth() &&
                       invoiceDate.getFullYear() === today.getFullYear();
            })
            .reduce((sum, inv) => sum + inv.amount, 0);
            
        return { outstanding, paidThisMonth };
    }, [invoices]);
    
    const handleDeleteInvoice = (id: string) => {
        if(window.confirm('Are you sure you want to delete this invoice?')) {
            setInvoices(prev => prev.filter(inv => inv.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {isModalOpen && selectedInvoice && (
                <PaymentModal
                    invoice={selectedInvoice}
                    onClose={handleCloseModal}
                    onConfirmPayment={handleConfirmPayment}
                />
            )}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Hospital Payments & Billing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Outstanding Amount</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{totals.outstanding.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
                        </svg>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Paid This Month</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{totals.paidThisMonth.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                 </div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:col-span-2 w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Search by Patient Name or Invoice ID..."
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'All' | InvoiceStatus)}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                 <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Invoice ID</th>
                            <th scope="col" className="px-6 py-3">Patient Name</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                       {filteredInvoices.map(invoice => {
                            const color = statusColors[invoice.status];
                            return (
                                <tr key={invoice.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-mono font-medium text-gray-700 dark:text-gray-300">{invoice.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{invoice.patientName}</td>
                                    <td className="px-6 py-4">{invoice.date}</td>
                                    <td className="px-6 py-4 font-semibold">₹{invoice.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
                                            <span className={`h-2 w-2 rounded-full mr-2 ${color.dot}`}></span>
                                            {invoice.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(invoice)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                          {invoice.status === 'Paid' ? 'View' : 'Pay'}
                                        </button>
                                        <button onClick={() => handleDeleteInvoice(invoice.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredInvoices.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Invoices Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">No invoices match your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalPayments;
