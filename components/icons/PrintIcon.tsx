
import React from 'react';

export const PrintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 3.369m0 0c.07.13.12.263.12.402v10.281m0 0c.48.062.98.096 1.48.096h8.52c.5 0 1-.034 1.48-.096M6.34 16.5A10.527 10.527 0 0112 15c4.012 0 7.527 1.229 9.66 3.25" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" 
    />
  </svg>
);
