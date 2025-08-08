import React from 'react';

interface GitIconProps {
  size?: number;
  className?: string;
}

const GitIcon: React.FC<GitIconProps> = ({ size = 24, className = '' }) => {
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
        d="M23.5 11.5L12.5 0.5c-0.5-0.5-1.5-0.5-2 0L8.5 2.5l2.5 2.5c0.5-0.2 1.2-0.1 1.6 0.3 0.4 0.4 0.5 1.1 0.3 1.6l2.4 2.4c0.5-0.2 1.2-0.1 1.6 0.3 0.6 0.6 0.6 1.5 0 2.1s-1.5 0.6-2.1 0c-0.4-0.4-0.5-1.1-0.3-1.6L12 7.6v6.8c0.4 0.2 0.7 0.6 0.7 1.1 0 0.8-0.6 1.5-1.5 1.5s-1.5-0.7-1.5-1.5c0-0.5 0.3-0.9 0.7-1.1V7.6c-0.4-0.2-0.7-0.6-0.7-1.1 0-0.5 0.3-0.9 0.7-1.1L8 3l-7.5 7.5c-0.5 0.5-0.5 1.5 0 2L12 24l11.5-11.5c0.5-0.5 0.5-1.5 0-2z"
        fill="#F05032"
      />
    </svg>
  );
};

export default GitIcon;