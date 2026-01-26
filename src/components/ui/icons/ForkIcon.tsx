import React from 'react';

interface ForkIconProps {
  size?: number;
  className?: string;
}

const ForkIcon: React.FC<ForkIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M18 9V12C18 13.1046 17.1046 14 16 14H8C6.89543 14 6 13.1046 6 12V9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M12 15V14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default ForkIcon;