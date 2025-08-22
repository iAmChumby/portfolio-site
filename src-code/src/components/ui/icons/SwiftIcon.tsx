import React from 'react';

interface SwiftIconProps {
  size?: number;
  className?: string;
}

const SwiftIcon: React.FC<SwiftIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#FA7343"/>
      <path
        d="M8 7c2 0 4 1 6 3-1-2-3-3-6-3s-5 1-6 3c1-2 4-3 6-3z"
        fill="white"
      />
      <path
        d="M16 10c0 2-1 4-3 6 2-1 3-3 3-6s-1-5-3-6c2 1 3 4 3 6z"
        fill="white"
      />
      <path
        d="M14 17c-2 0-4-1-6-3 1 2 3 3 6 3s5-1 6-3c-1 2-4 3-6 3z"
        fill="white"
      />
      <path
        d="M6 14c0-2 1-4 3-6-2 1-3 3-3 6s1 5 3 6c-2-1-3-4-3-6z"
        fill="white"
      />
      <circle cx="12" cy="12" r="3" fill="#FA7343"/>
      <circle cx="12" cy="12" r="1.5" fill="white"/>
    </svg>
  );
};

export default SwiftIcon;