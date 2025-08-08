import React from 'react';

interface ReactIconProps {
  className?: string;
  size?: number;
}

const ReactIcon: React.FC<ReactIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* React atom nucleus */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      
      {/* React electron orbits */}
      <ellipse 
        cx="12" 
        cy="12" 
        rx="8" 
        ry="3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      <ellipse 
        cx="12" 
        cy="12" 
        rx="8" 
        ry="3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
        transform="rotate(60 12 12)"
      />
      <ellipse 
        cx="12" 
        cy="12" 
        rx="8" 
        ry="3" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
        transform="rotate(-60 12 12)"
      />
    </svg>
  );
};

export default ReactIcon;