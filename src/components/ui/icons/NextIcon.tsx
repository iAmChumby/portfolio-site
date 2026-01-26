import React from 'react';

interface NextIconProps {
  className?: string;
  size?: number;
}

const NextIcon: React.FC<NextIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Next.js logo - simplified version */}
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path 
        d="M8 8l8 8M16 8v8" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NextIcon;