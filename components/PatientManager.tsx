import React, { useState, useMemo } from 'react';
import { Patient } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { CloseIcon } from './icons/CloseIcon';
import { getPatientInsights, getDoshaAnalysis, generateWellnessPlan } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { PrintIcon } from './icons/PrintIcon';
import { Logo } from './icons/Logo';

const PatientForm: React.FC<{ onAddPatient: (patient: Omit<Patient, 'id' | 'lastVisit'>) => void; }> = ({ onAddPatient }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [condition, setCondition] = useState('');
    const [history, setHistory] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !age || !condition) {
            alert("Please fill in Name, Age, and Condition.");
            return;
        }
        onAddPatient({ name, age: parseInt(age), gender, condition, history, email, phone });
        setName(''); setAge(''); setGender('Male'); setCondition(''); setHistory(''); setEmail(''); setPhone('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-brand-surface rounded-xl shadow-lg space-y-4 border border-gray-200 print:hidden">
            <h3 className="text-xl font-bold text-text-primary">Add New Patient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border bg-brand-background border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Presenting Condition</label>
                    <input type="text" value={condition} onChange={e => setCondition(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required/>
                </div>
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-1">Medical History</label>
                    <textarea value={history} onChange={e => setHistory(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"></textarea>
                </div>
            </div>
           
            <button type="submit" className="w-full bg-brand-accent text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md transform hover:scale-105">Add Patient Record</button>
        </form>
    );
};

interface PatientManagerProps {
    initialPatients: Patient[];
    onAddPatient: (patientData: Omit<Patient, 'id' | 'lastVisit'>) => void;
    onRemovePatient: (patientId: string) => void;
}


export const PatientManager: React.FC<PatientManagerProps> = ({ initialPatients, onAddPatient, onRemovePatient }) => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const [insightError, setInsightError] = useState<string | null>(null);
    
    const [doshaAnalysis, setDoshaAnalysis] = useState<string | null>(null);
    const [isDoshaLoading, setIsDoshaLoading] = useState(false);
    const [doshaError, setDoshaError] = useState<string | null>(null);

    const [wellnessPlan, setWellnessPlan] = useState<string | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);
    const [planError, setPlanError] = useState<string | null>(null);
    
    const filteredPatients = useMemo(() => {
        return initialPatients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [initialPatients, searchTerm]);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setAiInsight(null);
        setInsightError(null);
        setDoshaAnalysis(null);
        setDoshaError(null);
        setWellnessPlan(null);
        setPlanError(null);
    };
    
    const confirmAndRemovePatient = (patientId: string) => {
        if(window.confirm("Are you sure you want to remove this patient record? This will also remove any of their scheduled appointments.")) {
            onRemovePatient(patientId);
            if(selectedPatient?.id === patientId) {
                setSelectedPatient(null);
            }
        }
    };
    
    const handleGetInsight = async () => {
        if (!selectedPatient) return;
        setIsInsightLoading(true);
        setAiInsight(null);
        setInsightError(null);
        try {
            const insight = await getPatientInsights(selectedPatient);
            setAiInsight(insight);
        } catch (err: any) {
            setInsightError(err.message || 'An unknown error occurred.');
        } finally {
            setIsInsightLoading(false);
        }
    };

    const handleGetDosha = async () => {
        if (!selectedPatient) return;
        setIsDoshaLoading(true);
        setDoshaAnalysis(null);
        setDoshaError(null);
        try {
            const analysis = await getDoshaAnalysis(selectedPatient);
            setDoshaAnalysis(analysis);
        } catch (err: any) {
            setDoshaError(err.message || 'An unknown error occurred.');
        } finally {
            setIsDoshaLoading(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (!selectedPatient) return;
        setIsPlanLoading(true);
        setWellnessPlan(null);
        setPlanError(null);
        try {
            const plan = await generateWellnessPlan(selectedPatient);
            setWellnessPlan(plan);
// Fix: Added the missing catch and finally blocks to handle async state updates correctly.
        } catch (err: any) {
            setPlanError(err.message || 'An unknown error occurred.');
        } finally {
            setIsPlanLoading(false);
        }
    };
    
    return (
        <div>
            <div className="text-center mb-10 print:hidden">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Patient Records</h2>
                <p className="text-lg text-text-secondary">Manage patient information securely.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start print:grid-cols-1">
                <div className="lg:col-span-1 lg:sticky lg:top-28 print:hidden">
                    <PatientForm onAddPatient={onAddPatient} />
                </div>
                <div className="lg:col-span-2 print:col-span-1">
                    <div className="p-6 bg-brand-surface rounded-xl shadow-lg border border-gray-200 print:hidden">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-text-secondary mb-1">Search Patients</label>
                            <input
                                type="text"
                                placeholder="Filter by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                            />
                        </div>

                        <h3 className="text-xl font-bold text-text-primary mb-4">Patient List</h3>
                        {filteredPatients.length > 0 ? (
                        <div className="max-h-[65vh] overflow-y-auto pr-2 space-y-3">
                            {filteredPatients.map(p => (
                                <div key={p.id} className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-l-4 group relative ${selectedPatient?.id === p.id ? 'bg-brand-accent-light border-brand-accent shadow-md' : 'bg-brand-background/60 hover:bg-brand-background border-transparent'}`} onClick={() => handleSelectPatient(p)}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-text-primary">{p.name}, {p.age}</p>
                                            <p className="text-sm text-text-secondary">{p.condition}</p>
                                        </div>
                                        <span className="text-xs text-text-secondary bg-gray-200 px-2 py-1 rounded-full">{p.lastVisit}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); confirmAndRemovePatient(p.id); }} className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Delete patient">
                                      <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div className="text-center py-12">
                                <UsersIcon className="mx-auto h-16 w-16 text-gray-300 mb-4"/>
                                <p className="text-text-secondary">{initialPatients.length > 0 ? 'No patients match your search.' : 'No patient records found.'}</p>
                                <p className="text-sm text-gray-400">{initialPatients.length > 0 ? 'Try a different name.' : 'Add a new patient using the form.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 print:bg-transparent print:backdrop-blur-none print:p-0 print:block" onClick={() => setSelectedPatient(null)}>
                    <div className="bg-brand-surface rounded-xl shadow-2xl p-8 w-full max-w-4xl transform transition-all animate-fade-in-up print:shadow-none print:rounded-none print:w-full print:h-full print:max-w-full print:p-12" onClick={e => e.stopPropagation()}>
                        
                         <div className="hidden print:flex items-center gap-4 pb-8 mb-8 border-b">
                            <Logo className="h-20 w-20" />
                            <div>
                                <h1 className="text-3xl font-bold text-brand-primary">Dr. Rachitha's Clinic</h1>
                                <p className="text-lg text-text-secondary">Patient Wellness Plan</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-start">
                             <h3 className="text-3xl font-bold text-text-primary mb-6 print:text-4xl">{selectedPatient.name}</h3>
                             <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors print:hidden">
                                <CloseIcon className="w-6 h-6"/>
                             </button>
                        </div>

                        <div className="space-y-6 text-text-secondary max-h-[70vh] overflow-y-auto pr-4 print:max-h-full print:overflow-visible print:pr-0">
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-brand-background p-3 rounded-lg print:bg-slate-100"><strong className="block text-xs text-gray-500 mb-1">Age</strong> {selectedPatient.age}</div>
                                <div className="bg-brand-background p-3 rounded-lg print:bg-slate-100"><strong className="block text-xs text-gray-500 mb-1">Gender</strong> {selectedPatient.gender}</div>
                                <div className="bg-brand-background p-3 rounded-lg print:bg-slate-100"><strong className="block text-xs text-gray-500 mb-1">Email</strong> {selectedPatient.email || 'N/A'}</div>
                                <div className="bg-brand-background p-3 rounded-lg print:bg-slate-100"><strong className="block text-xs text-gray-500 mb-1">Phone</strong> {selectedPatient.phone || 'N/A'}</div>
                            </div>
                           
                            <div>
                                <strong className="font-semibold text-text-primary">Condition:</strong>
                                <p className="mt-1 p-3 bg-brand-background rounded-lg border border-gray-200 print:bg-transparent print:border-b print:rounded-none">{selectedPatient.condition}</p>
                            </div>
                            <div>
                                <strong className="font-semibold text-text-primary">History:</strong>
                                <p className="mt-1 p-3 bg-brand-background rounded-lg border border-gray-200 whitespace-pre-wrap print:bg-transparent print:border-b print:rounded-none">{selectedPatient.history || 'No history provided.'}</p>
                            </div>
                             
                            <div className="border-t pt-6 mt-6 space-y-6 print:border-t-2">
                                <div id="wellness-plan-section">
                                    <div className="flex justify-between items-center mb-2 print:hidden">
                                        <h4 className="font-semibold text-text-primary">Generated Wellness Plan</h4>
                                        <button onClick={handleGeneratePlan} disabled={isPlanLoading} className="flex items-center gap-2 text-sm bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-sm transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-wait">
                                           <DocumentTextIcon className="w-5 h-5"/> {isPlanLoading ? 'Generating...' : 'Generate Wellness Plan'}
                                        </button>
                                    </div>
                                    <h4 className="hidden print:block text-2xl font-bold text-text-primary mb-4">Generated Wellness Plan</h4>
                                    {isPlanLoading && <div className="text-center p-4 text-text-secondary print:hidden">Generating plan...</div>}
                                    {planError && <div className="bg-red-100 text-red-700 p-3 rounded-lg print:hidden">{planError}</div>}
                                    {wellnessPlan && (
                                        <div className="mt-1 p-4 bg-brand-background rounded-lg border border-gray-200 whitespace-pre-wrap animate-slide-in-down font-mono text-sm print:bg-transparent print:border-none print:p-0 print:font-sans print:text-base">
                                            <div className="text-text-secondary print:text-black">{wellnessPlan.replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold text-text-primary mt-4 mb-2">$1</h3>')}</div>
                                            <p className="text-xs text-gray-500 mt-4 italic font-sans">Disclaimer: This wellness plan is system-generated for practitioner review and is not a substitute for professional medical advice.</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="print:hidden">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-text-primary">Prakriti Analysis</h4>
                                        <button onClick={handleGetDosha} disabled={isDoshaLoading} className="flex items-center gap-2 text-sm bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-sm transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-wait">
                                           <SparklesIcon className="w-5 h-5"/> {isDoshaLoading ? 'Analyzing...' : 'Analyze Prakriti'}
                                        </button>
                                    </div>
                                    {isDoshaLoading && <div className="text-center p-4 text-text-secondary">Loading...</div>}
                                    {doshaError && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{doshaError}</div>}
                                    {doshaAnalysis && (
                                        <div className="mt-1 p-4 bg-blue-50 rounded-lg border border-blue-200 whitespace-pre-wrap animate-slide-in-down">
                                            <p className="text-blue-900">{doshaAnalysis}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="print:hidden">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-text-primary">Assistant's Note</h4>
                                         <button onClick={handleGetInsight} disabled={isInsightLoading} className="flex items-center gap-2 text-sm bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-sm transform hover:scale-105 disabled:bg-opacity-50 disabled:cursor-wait">
                                           <SparklesIcon className="w-5 h-5"/> {isInsightLoading ? 'Generating...' : "Get Assistant's Note"}
                                         </button>
                                    </div>
                                    {isInsightLoading && <div className="text-center p-4 text-text-secondary">Loading...</div>}
                                    {insightError && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{insightError}</div>}
                                    {aiInsight && (
                                        <div className="mt-1 p-4 bg-green-50 rounded-lg border border-green-200 whitespace-pre-wrap animate-slide-in-down">
                                            <p className="text-green-900">{aiInsight}</p>
                                            <p className="text-xs text-green-700 mt-4 italic">Disclaimer: These assistant notes are for informational purposes only and not a substitute for professional medical advice.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                         <div className="flex justify-end gap-4 mt-8 pt-4 border-t print:hidden">
                            <button onClick={() => window.print()} disabled={!wellnessPlan} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-900 transition duration-300 shadow-sm transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">
                                <PrintIcon className="w-5 h-5" /> Print Wellness Plan
                            </button>
                            <button onClick={() => confirmAndRemovePatient(selectedPatient.id)} className="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition duration-300 shadow-sm transform hover:scale-105">
                                Remove Record
                            </button>
                            <button onClick={() => setSelectedPatient(null)} className="bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition duration-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};