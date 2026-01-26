import React from 'react';

interface HTMLIconProps {
  size?: number;
  className?: string;
}

const HTMLIcon: React.FC<HTMLIconProps> = ({ size = 24, className = '' }) => {
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
        d="M3 2l1.5 18L12 22l7.5-2L21 2H3z"
        fill="#E34F26"
      />
      <path
        d="M12 4v16l6-1.5L19 4H12z"
        fill="#EF652A"
      />
      <path
        d="M6 8h12v2H8v2h8v2H8v2h10v2H6V8z"
        fill="white"
      />
      <path
        d="M12 8v2h6v2h-4v2h4v2h-6v2h8V8h-8z"
        fill="#EBEBEB"
      />
    </svg>
  );
};

export default HTMLIcon;