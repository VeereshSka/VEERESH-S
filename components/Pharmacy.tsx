import React, { useState, useMemo } from 'react';
import type { Medicine } from '../types';

const pharmacyInventory: Medicine[] = [
  // Mangalore Inventory
  { id: 'M001', name: 'Paracetamol 500mg', brand: 'Cipla', stock: 150, price: 1.50, expiryDate: '2026-12-31', location: 'Mangalore' },
  { id: 'M002', name: 'Amoxicillin 250mg', brand: 'Sun Pharma', stock: 80, price: 10.00, expiryDate: '2025-11-30', location: 'Mangalore' },
  { id: 'M003', name: 'Metformin 500mg', brand: 'Lupin', stock: 120, price: 5.25, expiryDate: '2026-08-31', location: 'Mangalore' },
  { id: 'M004', name: 'Atorvastatin 10mg', brand: 'Dr. Reddy\'s', stock: 15, price: 8.00, expiryDate: '2025-09-30', location: 'Mangalore' },
  { id: 'M005', name: 'Omeprazole 20mg', brand: 'Zydus Cadila', stock: 0, price: 7.50, expiryDate: '2025-01-31', location: 'Mangalore' },
  { id: 'M006', name: 'Cetirizine 10mg', brand: 'Glenmark', stock: 200, price: 2.00, expiryDate: '2027-03-31', location: 'Mangalore' },
  { id: 'M007', name: 'Losartan 50mg', brand: 'Aurobindo', stock: 65, price: 9.75, expiryDate: '2026-06-30', location: 'Mangalore' },
  { id: 'M008', name: 'Aspirin 75mg', brand: 'Bayer', stock: 180, price: 1.00, expiryDate: '2027-01-31', location: 'Mangalore' },

  // Shivamogga Inventory
  { id: 'S001', name: 'Ibuprofen 400mg', brand: 'Mankind', stock: 130, price: 2.50, expiryDate: '2026-10-31', location: 'Shivamogga' },
  { id: 'S002', name: 'Azithromycin 500mg', brand: 'Alkem', stock: 70, price: 15.00, expiryDate: '2025-12-31', location: 'Shivamogga' },
  { id: 'S003', name: 'Glimiperide 1mg', brand: 'Torrent', stock: 90, price: 6.00, expiryDate: '2026-07-31', location: 'Shivamogga' },
  { id: 'S004', name: 'Rosuvastatin 20mg', brand: 'Intas', stock: 18, price: 12.50, expiryDate: '2025-08-31', location: 'Shivamogga' },
  { id: 'S005', name: 'Pantoprazole 40mg', brand: 'Abbott', stock: 110, price: 8.75, expiryDate: '2026-02-28', location: 'Shivamogga' },
  { id: 'S006', name: 'Loratadine 10mg', brand: 'Divi\'s', stock: 0, price: 3.00, expiryDate: '2025-05-31', location: 'Shivamogga' },
  { id: 'S007', name: 'Amlodipine 5mg', brand: 'Biocon', stock: 95, price: 4.50, expiryDate: '2027-04-30', location: 'Shivamogga' },
  { id: 'S008', name: 'Clopidogrel 75mg', brand: 'Piramal', stock: 55, price: 11.25, expiryDate: '2026-09-30', location: 'Shivamogga' },
];

type StockStatus = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';

const getStockStatus = (stock: number): Exclude<StockStatus, 'All'> => {
  if (stock === 0) return 'Out of Stock';
  if (stock < 20) return 'Low Stock';
  return 'In Stock';
};

const statusColors: { [key in Exclude<StockStatus, 'All'>]: { bg: string; text: string; dot: string } } = {
  'In Stock': { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
  'Low Stock': { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
  'Out of Stock': { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
};

const Pharmacy: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState<StockStatus>('All');

    const filteredMedicines = useMemo(() => {
        return pharmacyInventory.filter(med => {
            const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || med.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationFilter === 'All' || med.location === locationFilter;
            const matchesStock = stockFilter === 'All' || getStockStatus(med.stock) === stockFilter;
            return matchesSearch && matchesLocation && matchesStock;
        });
    }, [searchTerm, locationFilter, stockFilter]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Pharmacy Inventory</h2>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Search by name or brand..."
                    />
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="All">All Locations</option>
                        <option value="Mangalore">Mangalore</option>
                        <option value="Shivamogga">Shivamogga</option>
                    </select>
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value as StockStatus)}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="All">All Stock Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Medicine</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Stock</th>
                            <th scope="col" className="px-6 py-3">Price (₹)</th>
                            <th scope="col" className="px-6 py-3">Expiry Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.map(med => {
                            const status = getStockStatus(med.stock);
                            const color = statusColors[status];
                            return (
                                <tr key={med.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        <div className="font-bold">{med.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{med.brand}</div>
                                    </td>
                                    <td className="px-6 py-4">{med.location}</td>
                                    <td className="px-6 py-4 font-semibold">{med.stock} units</td>
                                    <td className="px-6 py-4">{med.price.toFixed(2)}</td>
                                    <td className="px-6 py-4">{med.expiryDate}</td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text}`}>
                                            <span className={`h-2 w-2 rounded-full mr-2 ${color.dot}`}></span>
                                            {status}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredMedicines.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Medicines Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pharmacy;