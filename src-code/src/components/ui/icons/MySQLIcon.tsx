import React from 'react';

interface MySQLIconProps {
  size?: number;
  className?: string;
}

const MySQLIcon: React.FC<MySQLIconProps> = ({ size = 24, className = '' }) => {
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
        d="M16 8c2 0 4 1 4 3v6c0 2-2 3-4 3H8c-2 0-4-1-4-3v-6c0-2 2-3 4-3h8z"
        fill="#00758F"
      />
      <path
        d="M8 6c-3 0-5 2-5 5v2c0 3 2 5 5 5h8c3 0 5-2 5-5v-2c0-3-2-5-5-5H8z"
        fill="#F29111"
      />
      <ellipse cx="12" cy="12" rx="6" ry="3" fill="#00758F"/>
      <ellipse cx="12" cy="12" rx="4" ry="2" fill="white"/>
      <path
        d="M8 10h8v4H8v-4z"
        fill="#00758F"
      />
      <circle cx="10" cy="12" r="1" fill="white"/>
      <circle cx="14" cy="12" r="1" fill="white"/>
    </svg>
  );
};

export default MySQLIcon;