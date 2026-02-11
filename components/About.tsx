import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-brand-surface rounded-xl shadow-lg border border-gray-200 animate-fade-in-up">
      <h2 className="text-4xl font-bold text-text-primary mb-4 text-center">About Dr. Rachitha's Clinic</h2>
      <p className="text-lg text-text-secondary mb-6 text-center">
        A Digital Tool for the Modern Practitioner
      </p>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <p>
          This application serves as a dedicated digital assistant for Dr. Rachitha's Ayurvedic practice. It's designed to seamlessly integrate modern technology with the timeless principles of Ayurveda, making clinic management more efficient and insightful.
        </p>
        <div className="p-6 bg-brand-background rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Key Features</h3>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="font-semibold">Patient Management:</strong> Securely store and manage patient records, histories, and wellness plans in one centralized location.</li>
                <li><strong className="font-semibold">Clinical Decision Support:</strong> Utilize the digital assistant to generate practitioner notes, analyze potential Dosha imbalances, and create foundational wellness plans for review.</li>
                <li><strong className="font-semibold">Ayurvedic Knowledge Hub:</strong> Instantly search a vast database of Ayurvedic herbs, treatments, and concepts to support patient consultations.</li>
                <li><strong className="font-semibold">Appointment Scheduling:</strong> Organize the clinic's calendar with an easy-to-use scheduler, ensuring a smooth workflow.</li>
                <li><strong className="font-semibold">Clinic Intelligence Dashboard:</strong> Visualize key clinic metrics like patient demographics and common conditions with an at-a-glance dashboard.</li>
                 <li><strong className="font-semibold">Online Booking Portal:</strong> Allow new patients to easily book their first consultation through a simple and accessible online form.</li>
            </ul>
        </div>
        <p>
          By handling the administrative and analytical tasks, this tool empowers Dr. Rachitha to focus on what matters most: providing personalized, holistic care to her patients.
        </p>
      </div>
    </div>
  );
};