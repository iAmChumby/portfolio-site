import React from 'react';

interface RustIconProps {
  size?: number;
  className?: string;
}

const RustIcon: React.FC<RustIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#CE422B"/>
      <path
        d="M12 6l2 2-2 2-2-2 2-2z"
        fill="white"
      />
      <path
        d="M8 10l2 2-2 2-2-2 2-2z"
        fill="white"
      />
      <path
        d="M16 10l2 2-2 2-2-2 2-2z"
        fill="white"
      />
      <path
        d="M12 14l2 2-2 2-2-2 2-2z"
        fill="white"
      />
      <circle cx="12" cy="12" r="2" fill="#CE422B"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  );
};

export default RustIcon;