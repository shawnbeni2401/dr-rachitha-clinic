import React, { useMemo } from 'react';
import { Patient, Appointment } from '../types';
import { UsersIcon } from './icons/UsersIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface DashboardProps {
    patients: Patient[];
    appointments: Appointment[];
}

const StatCard: React.FC<{ title: string; value?: string | number; icon?: React.ReactNode; children?: React.ReactNode }> = ({ title, value, icon, children }) => (
    <div className="bg-brand-surface p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-lg font-semibold text-text-secondary">{title}</h3>
                 {value !== undefined && <p className="text-4xl font-bold text-text-primary">{value}</p>}
            </div>
            {icon && <div className="bg-brand-accent-light p-3 rounded-lg">{icon}</div>}
        </div>
        {children && <div className="mt-2">{children}</div>}
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ patients, appointments }) => {
    const totalPatients = patients.length;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const todaysAppointments = useMemo(() => {
        return appointments.filter(a => a.date === today);
    }, [appointments, today]);

    const genderDistribution = useMemo(() => {
        const counts = { Male: 0, Female: 0, Other: 0 };
        patients.forEach(p => {
            if (p.gender in counts) {
                counts[p.gender]++;
            }
        });
        return counts;
    }, [patients]);

    const commonConditions = useMemo(() => {
        const conditionCounts: { [key: string]: number } = {};
        patients.forEach(p => {
            const condition = p.condition.trim();
            if (condition) {
                conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
            }
        });
        return Object.entries(conditionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [patients]);

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Clinic Intelligence Dashboard</h2>
                <p className="text-lg text-text-secondary">An at-a-glance overview of your clinic's key metrics.</p>
            </div>

            {totalPatients === 0 ? (
                 <div className="text-center py-20 px-4 bg-brand-surface rounded-xl shadow-sm border border-gray-200">
                    <UsersIcon className="mx-auto h-24 w-24 text-gray-300 mb-4"/>
                    <h3 className="text-xl font-semibold text-text-secondary">No Patient Data Available</h3>
                    <p className="text-gray-500 mt-2">Add patients in the 'Patients' tab to see dashboard analytics.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Patients" value={totalPatients} icon={<UsersIcon className="w-8 h-8 text-brand-primary" />} />
                    <StatCard title="Today's Appointments" value={todaysAppointments.length} icon={<CalendarIcon className="w-8 h-8 text-brand-primary" />} />
                    
                    <StatCard title="Gender Distribution">
                        <div className="space-y-2">
                            {Object.entries(genderDistribution).map(([gender, count]) => {
                                // Fix: Explicitly cast count to a Number to prevent type errors in the arithmetic operation.
                                const percentage = totalPatients > 0 ? ((Number(count) / totalPatients) * 100).toFixed(1) : "0.0";
                                return (
                                    <div key={gender}>
                                        <div className="flex justify-between text-sm font-medium text-text-secondary mb-1">
                                            <span>{gender}</span>
                                            <span>{count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </StatCard>

                    <div className="bg-brand-surface p-6 rounded-xl shadow-md border border-gray-200 md:col-span-2 lg:col-span-3">
                        <h3 className="text-lg font-semibold text-text-secondary mb-3">Most Common Conditions</h3>
                        {commonConditions.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {commonConditions.map(([condition, count]) => (
                                    <li key={condition} className="flex justify-between items-center bg-brand-background p-3 rounded-md">
                                        <span className="font-medium text-text-primary text-sm">{condition}</span>
                                        <span className="font-bold text-brand-accent bg-brand-accent-light px-2.5 py-0.5 rounded-full text-sm">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-sm text-text-secondary text-center mt-4">No conditions recorded yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};