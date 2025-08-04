import React from 'react';

interface GoIconProps {
  size?: number;
  className?: string;
}

const GoIcon: React.FC<GoIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#00ADD8"/>
      <path
        d="M7 10c-0.5 0-1 0.5-1 1v2c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1v-2c0-0.5-0.5-1-1-1H7zm0.5 1h1v2h-1v-2z"
        fill="white"
      />
      <path
        d="M12 10c-0.5 0-1 0.5-1 1v2c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1v-2c0-0.5-0.5-1-1-1h-2zm0.5 1h1v2h-1v-2z"
        fill="white"
      />
      <path
        d="M6 8h2v1H6V8zm4 0h2v1h-2V8zm4 0h2v1h-2V8z"
        fill="white"
      />
      <path
        d="M17 10v4h-1v-1h-1v1h-1v-4h1v1h1v-1h1z"
        fill="white"
      />
    </svg>
  );
};

export default GoIcon;