import React from 'react';

interface BugIconProps {
  size?: number;
  className?: string;
}

const BugIcon: React.FC<BugIconProps> = ({ size = 24, className = '' }) => {
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
        d="M8 2V5M16 2V5M9 9H15M9 13H15M6 9V8C6 6.89543 6.89543 6 8 6H16C17.1046 6 18 6.89543 18 8V9M6 9H2M6 9V16C6 17.1046 6.89543 18 8 18H16C17.1046 18 18 17.1046 18 16V9M18 9H22M6 13H2M18 13H22M8 22V18M16 22V18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BugIcon;