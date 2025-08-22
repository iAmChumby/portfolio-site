import React from 'react';

interface MongoDBIconProps {
  size?: number;
  className?: string;
}

const MongoDBIcon: React.FC<MongoDBIconProps> = ({ size = 24, className = '' }) => {
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
        d="M12 2C8 2 5 5.5 5 10c0 3 1.5 5.5 3.5 7.5L12 22l3.5-4.5C17.5 15.5 19 13 19 10c0-4.5-3-8-7-8z"
        fill="#47A248"
      />
      <path
        d="M12 4c2.5 0 4.5 2.5 4.5 5.5 0 2-1 3.5-2.5 5L12 18l-2-3.5c-1.5-1.5-2.5-3-2.5-5C7.5 6.5 9.5 4 12 4z"
        fill="#4DB33D"
      />
      <path
        d="M12 6c1.5 0 2.5 1.5 2.5 3 0 1-0.5 2-1.5 3L12 14l-1-2c-1-1-1.5-2-1.5-3 0-1.5 1-3 2.5-3z"
        fill="#58AA50"
      />
      <ellipse cx="12" cy="9" rx="1" ry="2" fill="#3F8A3E"/>
    </svg>
  );
};

export default MongoDBIcon;