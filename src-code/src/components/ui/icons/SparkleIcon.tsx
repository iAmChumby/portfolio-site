import React from 'react';

interface SparkleIconProps {
  className?: string;
  size?: number;
}

const SparkleIcon: React.FC<SparkleIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0l2.4 7.2L22 9.6l-7.6 2.4L12 24l-2.4-7.6L2 14.4l7.6-2.4L12 0z" />
      <path d="M19 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" opacity="0.7" />
      <path d="M5 17l0.5 1.5L7 19l-1.5 0.5L5 21l-0.5-1.5L3 19l1.5-0.5L5 17z" opacity="0.7" />
    </svg>
  );
};

export default SparkleIcon;