import React, { useState } from 'react';
import { getPrognosis } from '../services/geminiService';
import type { PrognosisResult } from '../types';

const PrognosisPredictor: React.FC = () => {
    const [formData, setFormData] = useState({
        symptoms: '',
        age: '',
        gender: 'Male' as 'Male' | 'Female' | 'Other',
        heartRate: '',
        spO2: '',
        temperature: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<PrognosisResult | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const isFormValid = () => {
        return formData.symptoms.trim() && formData.age && formData.heartRate && formData.spO2 && formData.temperature;
    }

    const handleSubmit = async () => {
        if (!isFormValid()) {
            setError('Please fill in all patient data fields.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const prognosisInput = {
                symptoms: formData.symptoms,
                age: parseInt(formData.age),
                gender: formData.gender,
                vitals: {
                    heartRate: parseInt(formData.heartRate),
                    spO2: parseInt(formData.spO2),
                    temperature: parseFloat(formData.temperature),
                }
            };
            const response = await getPrognosis(prognosisInput);
            setResult(response);
        } catch (e) {
            setError('Failed to get prognosis. The AI model may be overloaded. Please try again later.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">AI Prognosis Predictor</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Enter patient data to predict the final diagnosis and a recommended solution.
            </p>
            <div className="space-y-4">
                 <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className="w-full h-24 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Describe patient symptoms..."
                />
                <div className="grid grid-cols-2 gap-4">
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <fieldset className="p-3 border rounded-lg border-gray-200 dark:border-gray-600">
                    <legend className="px-2 text-sm font-medium text-gray-600 dark:text-gray-300">Patient Vitals</legend>
                    <div className="grid grid-cols-3 gap-3 mt-1">
                        <input type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} placeholder="HR (bpm)" className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                        <input type="number" name="spO2" value={formData.spO2} onChange={handleInputChange} placeholder="SpO2 (%)" className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                        <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleInputChange} placeholder="Temp (°C)" className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"/>
                    </div>
                </fieldset>
            </div>
             {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <button
                onClick={handleSubmit}
                disabled={loading || !isFormValid()}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {loading ? 'Analyzing...' : 'Predict Prognosis'}
            </button>

            {result && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-y-auto flex-1 space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Predicted Condition:</h4>
                        <div className="flex justify-between items-center mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                           <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{result.predictedCondition}</span>
                           <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confidence: <span className="font-bold text-lg">{result.confidenceScore}%</span></span>
                        </div>
                    </div>
                     <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Recommended Solution:</h4>
                        <p className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono text-sm">{result.recommendedSolution}</p>
                    </div>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-2">
                        Disclaimer: This is an AI-generated prediction. Always verify with a qualified medical professional before making any clinical decisions.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PrognosisPredictor;
