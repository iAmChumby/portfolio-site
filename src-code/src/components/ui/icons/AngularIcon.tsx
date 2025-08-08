import React from 'react';

interface AngularIconProps {
  className?: string;
  size?: number;
}

const AngularIcon: React.FC<AngularIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2L2 7l1.5 13L12 22l8.5-2L22 7 12 2zm0 2.5l6.5 11.5h-2l-1.3-2.5H8.8L7.5 16h-2L12 4.5zm0 3.5L9.5 12h5L12 8z" />
    </svg>
  );
};

export default AngularIcon;