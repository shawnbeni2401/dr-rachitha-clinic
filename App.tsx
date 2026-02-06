import React, { useState, useEffect } from 'react';
import AyurvedicSearch from './components/AyurvedicSearch';
import { PatientManager } from './components/PatientManager';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { UsersIcon } from './components/icons/UsersIcon';
import { Logo } from './components/icons/Logo';
import { Dashboard } from './components/Dashboard';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { CalendarIcon } from './components/icons/CalendarIcon';
import { AppointmentScheduler } from './components/AppointmentScheduler';
import { Patient, Appointment } from './types';
import { About } from './components/About';
import { InfoIcon } from './components/icons/InfoIcon';
import { mockPatients, mockAppointments } from './data/mockData';
import { OnlineBooking } from './components/OnlineBooking';
import { UserPlusIcon } from './components/icons/UserPlusIcon';
import { MenuIcon } from './components/icons/MenuIcon';
import { CloseIcon } from './components/icons/CloseIcon';

type View = 'dashboard' | 'search' | 'patients' | 'appointments' | 'about' | 'online-booking';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const storedPatients = localStorage.getItem('ayurvedic_patients');
    if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
    } else {
        setPatients(mockPatients);
        updateLocalStorage('ayurvedic_patients', mockPatients);
    }

    const storedAppointments = localStorage.getItem('ayurvedic_appointments');
    if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
    } else {
        setAppointments(mockAppointments);
        updateLocalStorage('ayurvedic_appointments', mockAppointments);
    }
  }, []);

  const updateLocalStorage = (key: string, data: any[]) => {
      localStorage.setItem(key, JSON.stringify(data));
  };

  const addPatient = (patientData: Omit<Patient, 'id'| 'lastVisit'>) => {
      const newPatient: Patient = {
          ...patientData,
          id: new Date().toISOString(),
          lastVisit: new Date().toLocaleDateString(),
      };
      const updatedPatients = [...patients, newPatient].sort((a, b) => a.name.localeCompare(b.name));
      setPatients(updatedPatients);
      updateLocalStorage('ayurvedic_patients', updatedPatients);
      return newPatient;
  };

  const removePatient = (patientId: string) => {
      const updatedPatients = patients.filter(p => p.id !== patientId);
      setPatients(updatedPatients);
      updateLocalStorage('ayurvedic_patients', updatedPatients);
      
      const updatedAppointments = appointments.filter(a => a.patientId !== patientId);
      setAppointments(updatedAppointments);
      updateLocalStorage('ayurvedic_appointments', updatedAppointments);
  };
  
  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
      const newAppointment: Appointment = {
          ...appointmentData,
          id: new Date().toISOString(),
      };
      const updatedAppointments = [...appointments, newAppointment].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAppointments(updatedAppointments);
      updateLocalStorage('ayurvedic_appointments', updatedAppointments);
  };

  const removeAppointment = (appointmentId: string) => {
      const updatedAppointments = appointments.filter(a => a.id !== appointmentId);
      setAppointments(updatedAppointments);
      updateLocalStorage('ayurvedic_appointments', updatedAppointments);
  };
  
  const handleNewBooking = (patientData: Omit<Patient, 'id' | 'lastVisit'>, appointmentDate: string) => {
    const newPatient = addPatient(patientData);
    addAppointment({
      patientId: newPatient.id,
      patientName: newPatient.name,
      date: appointmentDate,
      notes: "First Consultation (Online Booking)"
    });
    setActiveView('appointments');
  };

  const NavButton: React.FC<{
    view: View;
    label: string;
    icon: React.ReactNode;
    variant?: 'primary' | 'default';
    onClick?: () => void;
  }> = ({ view, label, icon, variant = 'default', onClick }) => {
    const isActive = activeView === view;
    const baseClasses = "relative flex items-center justify-start gap-3 w-full px-4 py-3 text-md font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent rounded-lg";
    
    let variantClasses = '';
    if (variant === 'primary') {
      variantClasses = 'bg-brand-accent text-white hover:bg-orange-600 shadow-sm';
    } else {
      variantClasses = isActive
        ? 'bg-brand-primary text-white shadow-sm'
        : 'text-text-secondary hover:text-brand-primary hover:bg-blue-100';
    }
    
    return (
      <button
        onClick={() => {
            setActiveView(view);
            if (onClick) onClick();
        }}
        className={`${baseClasses} ${variantClasses}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-brand-background text-text-primary print-container">
      <header className="bg-brand-surface/80 backdrop-blur-lg p-4 shadow-sm sticky top-0 z-20 border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <Logo className="h-16 w-16" />
             <div>
              <h1 className="text-xl lg:text-3xl font-bold text-brand-primary whitespace-nowrap">
                Dr. Rachitha's Clinic
              </h1>
              <p className="text-sm text-text-secondary hidden sm:block">Vira Ayurveda Clinic</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md text-text-primary hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              aria-label="Open navigation menu"
            >
              <MenuIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 print:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-brand-surface shadow-xl z-40 transform transition-transform duration-300 ease-in-out print:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-brand-primary">Menu</h2>
                  <button 
                      onClick={() => setIsMenuOpen(false)} 
                      className="p-2 rounded-full hover:bg-gray-200"
                      aria-label="Close navigation menu"
                  >
                      <CloseIcon className="h-6 w-6" />
                  </button>
              </div>
              <nav className="flex flex-col gap-3">
                  <NavButton view="online-booking" label="Online Booking" icon={<UserPlusIcon className="w-5 h-5" />} variant="primary" onClick={() => setIsMenuOpen(false)} />
                  <NavButton view="dashboard" label="Dashboard" icon={<DashboardIcon className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                  <NavButton view="patients" label="Patients" icon={<UsersIcon className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                  <NavButton view="appointments" label="Appointments" icon={<CalendarIcon className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                  <NavButton view="search" label="Knowledge Hub" icon={<BookOpenIcon className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
                  <div className="border-t my-2"></div>
                  <NavButton view="about" label="About" icon={<InfoIcon className="w-5 h-5" />} onClick={() => setIsMenuOpen(false)} />
              </nav>
          </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0">
        <div className={`${activeView === 'dashboard' ? 'block animate-fade-in-up' : 'hidden'} print:hidden`}>
          <Dashboard patients={patients} appointments={appointments} />
        </div>
         <div className={`${activeView === 'patients' ? 'block animate-fade-in-up' : 'hidden'} print:block`}>
          <PatientManager 
            initialPatients={patients} 
            onAddPatient={addPatient}
            onRemovePatient={removePatient}
          />
        </div>
        <div className={`${activeView === 'appointments' ? 'block animate-fade-in-up' : 'hidden'} print:hidden`}>
          <AppointmentScheduler 
            patients={patients}
            appointments={appointments}
            onAddAppointment={addAppointment}
            onRemoveAppointment={removeAppointment}
          />
        </div>
        <div className={`${activeView === 'search' ? 'block animate-fade-in-up' : 'hidden'} print:hidden`}>
          <AyurvedicSearch />
        </div>
        <div className={`${activeView === 'about' ? 'block animate-fade-in-up' : 'hidden'} print:hidden`}>
          <About />
        </div>
        <div className={`${activeView === 'online-booking' ? 'block animate-fade-in-up' : 'hidden'} print:hidden`}>
          <OnlineBooking onBookAppointment={handleNewBooking} />
        </div>
      </main>

       <footer className="bg-brand-surface text-center py-5 mt-8 border-t border-gray-200 print:hidden">
        <p className="text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} Dr. Rachitha's Clinic
        </p>
      </footer>
    </div>
  );
};

export default App;