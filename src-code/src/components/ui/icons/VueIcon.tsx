import React from 'react';

interface VueIconProps {
  size?: number;
  className?: string;
}

const VueIcon: React.FC<VueIconProps> = ({ size = 24, className = '' }) => {
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
        d="M2 4h4l6 10 6-10h4l-10 16L2 4z"
        fill="#4FC08D"
      />
      <path
        d="M6 4h3l3 5 3-5h3l-6 10L6 4z"
        fill="#35495E"
      />
    </svg>
  );
};

export default VueIcon;