import React from 'react';

interface LightningIconProps {
  className?: string;
  size?: number;
}

const LightningIcon: React.FC<LightningIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
};

export default LightningIcon;