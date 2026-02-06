import { Patient, Appointment } from '../types';

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'Aarav Sharma', age: 45, gender: 'Male', condition: 'Joint Pain (Arthritis)', history: 'Chronic knee pain for 5 years. Takes painkillers occasionally.', lastVisit: '05/15/2024', email: 'aarav.sharma@example.com', phone: '555-0101' },
  { id: 'p2', name: 'Priya Patel', age: 32, gender: 'Female', condition: 'Digestive Issues (IBS)', history: 'Complaints of bloating, gas, and irregular bowel movements. Stress seems to be a trigger.', lastVisit: '06/02/2024', email: 'priya.patel@example.com', phone: '555-0102' },
  { id: 'p3', name: 'Rohan Mehta', age: 58, gender: 'Male', condition: 'High Blood Pressure', history: 'Diagnosed with hypertension 2 years ago. On medication.', lastVisit: '04/28/2024', email: 'rohan.mehta@example.com', phone: '555-0103' },
  { id: 'p4', name: 'Sneha Reddy', age: 28, gender: 'Female', condition: 'Anxiety and Insomnia', history: 'Difficulty falling asleep and experiences frequent panic attacks due to work stress.', lastVisit: '06/10/2024', email: 'sneha.reddy@example.com', phone: '555-0104' },
  { id: 'p5', name: 'Vikram Singh', age: 50, gender: 'Male', condition: 'Type 2 Diabetes', history: 'Managing diabetes with diet and exercise. Looking for holistic support.', lastVisit: '05/21/2024', email: 'vikram.singh@example.com', phone: '555-0105' },
  { id: 'p6', name: 'Anika Gupta', age: 37, gender: 'Female', condition: 'Migraines', history: 'Frequent, severe headaches, especially during hormonal changes.', lastVisit: '06/08/2024', email: 'anika.gupta@example.com', phone: '555-0106' },
  { id: 'p7', name: 'Kiran Desai', age: 65, gender: 'Female', condition: 'General Debility', history: 'Feeling weak and fatigued. Wants to improve overall energy and immunity.', lastVisit: '05/30/2024', email: 'kiran.desai@example.com', phone: '555-0107' },
  { id: 'p8', name: 'Arjun Rao', age: 25, gender: 'Male', condition: 'Acne and Skin Issues', history: 'Persistent acne since teenage years. Has tried various topical treatments.', lastVisit: '06/12/2024', email: 'arjun.rao@example.com', phone: '555-0108' },
];

const generateAppointments = (): Appointment[] => {
    const appointments: Appointment[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const notes = [
        'Follow-up consultation',
        'Initial assessment',
        'Discuss treatment plan',
        'Check on progress',
        'Panchakarma therapy session'
    ];
    
    mockPatients.forEach((patient, index) => {
        // Appointment for today
        if (index < 2) {
             const date = new Date(currentYear, currentMonth, today.getDate());
             appointments.push({
                 id: `app${appointments.length + 1}`,
                 patientId: patient.id,
                 patientName: patient.name,
                 date: date.toISOString().split('T')[0],
                 notes: notes[Math.floor(Math.random() * notes.length)]
             });
        }

        // Appointment in the past this month
        if (index >= 2 && index < 5) {
             const day = Math.max(1, today.getDate() - (index * 2));
             const date = new Date(currentYear, currentMonth, day);
             appointments.push({
                 id: `app${appointments.length + 1}`,
                 patientId: patient.id,
                 patientName: patient.name,
                 date: date.toISOString().split('T')[0],
                 notes: notes[Math.floor(Math.random() * notes.length)]
             });
        }
        
        // Appointment in the future this month
        if (index >= 5) {
            const day = Math.min(28, today.getDate() + (index - 4) * 3);
            const date = new Date(currentYear, currentMonth, day);
            appointments.push({
                 id: `app${appointments.length + 1}`,
                 patientId: patient.id,
                 patientName: patient.name,
                 date: date.toISOString().split('T')[0],
                 notes: notes[Math.floor(Math.random() * notes.length)]
             });
        }
    });

    return appointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const mockAppointments: Appointment[] = generateAppointments();