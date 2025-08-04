import React from 'react';

interface MergeIconProps {
  size?: number;
  className?: string;
}

const MergeIcon: React.FC<MergeIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M15 3L21 9L15 15M4 21V9C4 7.89543 4.89543 7 6 7H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MergeIcon;