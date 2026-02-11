import React, { useState } from 'react';
import { Patient } from '../types';
import { HerbIllustration } from './icons/HerbIllustration';

interface OnlineBookingProps {
    onBookAppointment: (patientData: Omit<Patient, 'id' | 'lastVisit'>, appointmentDate: string) => void;
}

export const OnlineBooking: React.FC<OnlineBookingProps> = ({ onBookAppointment }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [condition, setCondition] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !age || !email || !condition || !appointmentDate) {
            alert("Please fill in all required fields.");
            return;
        }
        onBookAppointment(
            { name, age: parseInt(age), gender, email, phone, condition, history: 'First visit from online booking.' },
            appointmentDate
        );
        setIsSubmitted(true);
    };
    
    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-4 bg-brand-surface rounded-xl shadow-lg border border-gray-200 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-text-primary mb-4">Thank You!</h2>
                <p className="text-lg text-text-secondary mb-6">Your appointment request for <strong className="text-brand-primary">{new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> has been received. We will contact you shortly to confirm the details.</p>
                <p className="text-sm text-gray-500">You will be redirected to the appointment calendar shortly.</p>
            </div>
        )
    }

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Book Your First Consultation</h2>
                <p className="text-lg text-text-secondary">Take the first step towards holistic wellness.</p>
            </div>
            <div className="max-w-2xl mx-auto bg-brand-surface p-8 rounded-xl shadow-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Full Name *</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Age *</label>
                            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address *</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Gender *</label>
                            <select value={gender} onChange={e => setGender(e.target.value as any)} className="mt-1 block w-full px-3 py-2 border bg-brand-background border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent">
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Preferred Date *</label>
                             <input type="date" value={appointmentDate} min={today} onChange={e => setAppointmentDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Primary Health Concern *</label>
                        <textarea value={condition} onChange={e => setCondition(e.target.value)} rows={4} placeholder="Please briefly describe the main reason for your visit..." className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-brand-accent text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md transform hover:scale-105">Book Appointment</button>
                </form>
            </div>
        </div>
    );
};