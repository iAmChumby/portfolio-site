import React from 'react';

interface CSharpIconProps {
  size?: number;
  className?: string;
}

const CSharpIcon: React.FC<CSharpIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#239120"/>
      <path
        d="M8 8c-1.5 0-2.5 1-2.5 2.5v3c0 1.5 1 2.5 2.5 2.5h1v-1.5H8c-0.5 0-1-0.5-1-1v-3c0-0.5 0.5-1 1-1h1V8H8z"
        fill="white"
      />
      <path
        d="M13 9v1h1V9h1v1h1V9h-3zm0 2v1h1v-1h1v1h1v-1h-3zm0 2v1h1v-1h1v1h1v-1h-3z"
        fill="white"
      />
      <path
        d="M17 9v1h1V9h1v1h1V9h-3zm0 2v1h1v-1h1v1h1v-1h-3zm0 2v1h1v-1h1v1h1v-1h-3z"
        fill="white"
      />
    </svg>
  );
};

export default CSharpIcon;