import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logoGradient" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333ea" /> {/* Purple-600 */}
          <stop offset="1" stopColor="#2563eb" /> {/* Blue-600 */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Hexagon (Polygon Network Symbol) */}
      <path 
        d="M16 2L28.1244 9V23L16 30L3.87564 23V9L16 2Z" 
        stroke="url(#logoGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Inner Shield (Security Symbol) */}
      <path 
        d="M16 7L23 10.5V17.5C23 21.875 19.5 23.625 16 24.5C12.5 23.625 9 21.875 9 17.5V10.5L16 7Z" 
        fill="url(#logoGradient)" 
      />
      
      {/* Checkmark/Circuit (AI Verification) */}
      <path 
        d="M12.5 16L15 18.5L19.5 13.5" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};