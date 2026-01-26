import React from 'react';

interface PHPIconProps {
  size?: number;
  className?: string;
}

const PHPIcon: React.FC<PHPIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4"/>
      <path
        d="M6 10h2c1 0 1.5 0.5 1.5 1.5S9 13 8 13H7v1H6v-4zm1 1v1h1c0.3 0 0.5-0.2 0.5-0.5S8.3 11 8 11H7z"
        fill="white"
      />
      <path
        d="M10 10h1v1h1v-1h1v4h-1v-1h-1v1h-1v-4zm1 1v1h1v-1h-1z"
        fill="white"
      />
      <path
        d="M15 10h2c1 0 1.5 0.5 1.5 1.5S18 13 17 13h-1v1h-1v-4zm1 1v1h1c0.3 0 0.5-0.2 0.5-0.5S17.3 11 17 11h-1z"
        fill="white"
      />
    </svg>
  );
};

export default PHPIcon;