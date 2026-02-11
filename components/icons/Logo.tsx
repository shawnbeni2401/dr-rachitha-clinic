import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradientTrendy" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#1E40AF' }} /> 
        <stop offset="100%" style={{ stopColor: '#F97316' }} />
      </linearGradient>
    </defs>
    
    <path
      d="M30 85 V 15 H 55 C 70 15, 70 35, 55 35 H 45 V 50 H 55 C 75 50, 90 70, 70 85 L 50 65 M 50 65 C 60 55, 75 40, 90 45 C 95 47, 95 35, 85 30"
      fill="none"
      stroke="url(#logoGradientTrendy)"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);