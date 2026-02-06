import React, { useState, useMemo } from 'react';
import { Appointment, Patient } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';

interface AppointmentSchedulerProps {
    patients: Patient[];
    appointments: Appointment[];
    onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
    onRemoveAppointment: (appointmentId: string) => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ patients, appointments, onAddAppointment, onRemoveAppointment }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [patientId, setPatientId] = useState('');
    const [notes, setNotes] = useState('');

    const appointmentsByDate = useMemo(() => {
        const map = new Map<string, Appointment[]>();
        appointments.forEach(app => {
            const date = app.date;
            if (!map.has(date)) {
                map.set(date, []);
            }
            map.get(date)!.push(app);
        });
        return map;
    }, [appointments]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = Array.from({ length: startDay }, (_, i) => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))
    );
    
    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };
    
    const handleAddAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedDate || !patientId) {
            alert("Please select a date and a patient.");
            return;
        }
        const patientName = patients.find(p => p.id === patientId)?.name || 'Unknown';
        onAddAppointment({
            patientId,
            patientName,
            date: selectedDate.toISOString().split('T')[0],
            notes
        });
        setPatientId('');
        setNotes('');
    };

    const selectedDayAppointments = selectedDate ? appointmentsByDate.get(selectedDate.toISOString().split('T')[0]) || [] : [];
    
    return (
        <div>
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Appointment Scheduler</h2>
                <p className="text-lg text-text-secondary">Manage your clinic's calendar.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-brand-surface p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="font-bold p-2 rounded-md hover:bg-gray-100">&lt;</button>
                        <h3 className="text-xl font-bold text-text-primary">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => changeMonth(1)} className="font-bold p-2 rounded-md hover:bg-gray-100">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm text-text-secondary">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-semibold p-2">{day}</div>)}
                        {calendarDays.map((day, index) => (
                            <div key={index} className="relative flex justify-center items-center">
                                {day && (
                                    <button 
                                        onClick={() => setSelectedDate(day)}
                                        className={`w-10 h-10 rounded-full transition-colors duration-200 ${selectedDate?.toDateString() === day.toDateString() ? 'bg-brand-primary text-white' : 'hover:bg-brand-background'}`}
                                    >
                                        {day.getDate()}
                                    </button>
                                )}
                                {day && appointmentsByDate.has(day.toISOString().split('T')[0]) && (
                                     <div className="absolute bottom-1 w-1.5 h-1.5 bg-brand-accent rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                     <div className="bg-brand-surface p-6 rounded-xl shadow-lg border border-gray-200 sticky top-28">
                        <h3 className="text-xl font-bold text-text-primary mb-4 border-b pb-2">
                           {selectedDate ? `Schedule for ${selectedDate.toLocaleDateString()}` : 'Select a Date'}
                        </h3>
                        {selectedDate && (
                            <form onSubmit={handleAddAppointment} className="space-y-4 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Patient</label>
                                    <select value={patientId} onChange={e => setPatientId(e.target.value)} className="mt-1 block w-full px-3 py-2 border bg-brand-background border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent" required>
                                        <option value="">Select a patient</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">Notes</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Reason for visit..." className="mt-1 block w-full px-3 py-2 bg-brand-background border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300 shadow-md">Add Appointment</button>
                            </form>
                        )}
                        <div className="mt-6">
                            <h4 className="font-semibold text-text-primary mb-2">{selectedDate ? "Today's Appointments" : "Appointments"}</h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {selectedDayAppointments.length > 0 ? selectedDayAppointments.map(app => (
                                    <div key={app.id} className="bg-brand-background p-3 rounded-md flex justify-between items-start group">
                                        <div>
                                            <p className="font-semibold text-text-primary text-sm">{app.patientName}</p>
                                            <p className="text-xs text-text-secondary">{app.notes}</p>
                                        </div>
                                        <button onClick={() => onRemoveAppointment(app.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" aria-label="Delete appointment">
                                          <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-sm text-text-secondary italic">{selectedDate ? 'No appointments for this day.' : 'Select a day to view appointments.'}</p>
                                )}
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};