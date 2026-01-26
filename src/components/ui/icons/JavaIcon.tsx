import React from 'react';

interface JavaIconProps {
  size?: number;
  className?: string;
}

const JavaIcon: React.FC<JavaIconProps> = ({ size = 24, className = '' }) => {
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
        d="M8.5 18c0 1.5 1.5 2 3.5 2s3.5-0.5 3.5-2c0-1.5-1.5-2-3.5-2s-3.5 0.5-3.5 2z"
        fill="#ED8B00"
      />
      <path
        d="M7 15.5c0 1.5 2 2.5 5 2.5s5-1 5-2.5c0-1.5-2-2.5-5-2.5s-5 1-5 2.5z"
        fill="#ED8B00"
      />
      <path
        d="M9 13c0-2 1-4 3-4s3 2 3 4v1c0 1-1 2-3 2s-3-1-3-2v-1z"
        fill="#5382A1"
      />
      <path
        d="M10 8c0-1 0.5-2 2-2s2 1 2 2v3c0 1-0.5 2-2 2s-2-1-2-2V8z"
        fill="#5382A1"
      />
      <ellipse cx="12" cy="6" rx="1.5" ry="2" fill="#F58219"/>
      <path
        d="M11 4c0-0.5 0.5-1 1-1s1 0.5 1 1v2c0 0.5-0.5 1-1 1s-1-0.5-1-1V4z"
        fill="#F58219"
      />
    </svg>
  );
};

export default JavaIcon;