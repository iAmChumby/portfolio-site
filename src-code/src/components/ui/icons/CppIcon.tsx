import React from 'react';

interface CppIconProps {
  size?: number;
  className?: string;
}

const CppIcon: React.FC<CppIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#00599C"/>
      <path
        d="M8 8c-1.5 0-2.5 1-2.5 2.5v3c0 1.5 1 2.5 2.5 2.5h1v-1.5H8c-0.5 0-1-0.5-1-1v-3c0-0.5 0.5-1 1-1h1V8H8z"
        fill="white"
      />
      <path
        d="M12 11h1v2h-1v-2zm2 0h1v2h-1v-2z"
        fill="white"
      />
      <path
        d="M11.5 10v1h3v-1h-3zm0 3v1h3v-1h-3z"
        fill="white"
      />
      <path
        d="M16 11h1v2h-1v-2zm2 0h1v2h-1v-2z"
        fill="white"
      />
      <path
        d="M15.5 10v1h3v-1h-3zm0 3v1h3v-1h-3z"
        fill="white"
      />
    </svg>
  );
};

export default CppIcon;