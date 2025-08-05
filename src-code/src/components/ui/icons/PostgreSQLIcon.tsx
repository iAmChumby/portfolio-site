import React from 'react';

interface PostgreSQLIconProps {
  className?: string;
  size?: number;
}

const PostgreSQLIcon: React.FC<PostgreSQLIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* PostgreSQL elephant logo simplified */}
      <path 
        d="M12 2C8.5 2 6 4.5 6 8c0 2 1 3.5 2.5 4.5L8 14c-.5.5-.5 1.5 0 2s1.5.5 2 0l1-1c1 .5 2 .5 3 0l1 1c.5.5 1.5.5 2 0s.5-1.5 0-2l-.5-1.5C18 11.5 19 10 19 8c0-3.5-2.5-6-7-6z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        fill="none"
      />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <circle cx="14" cy="7" r="1" fill="currentColor" />
      <path 
        d="M8 18c0 2 2 4 4 4s4-2 4-4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M12 16v6" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PostgreSQLIcon;