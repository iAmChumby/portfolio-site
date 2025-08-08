import React from 'react';

interface RubyIconProps {
  size?: number;
  className?: string;
}

const RubyIcon: React.FC<RubyIconProps> = ({ size = 24, className = '' }) => {
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
        d="M12 3l3 3-3 6-3-6 3-3z"
        fill="#CC342D"
      />
      <path
        d="M9 6l3 6-6 3 3-9z"
        fill="#A91401"
      />
      <path
        d="M15 6l-3 6 6 3-3-9z"
        fill="#A91401"
      />
      <path
        d="M6 15l6-3 3 6-9-3z"
        fill="#CC342D"
      />
      <path
        d="M18 15l-6-3-3 6 9-3z"
        fill="#CC342D"
      />
      <path
        d="M12 12l-3 6 3 3 3-3-3-6z"
        fill="#FDD9D7"
      />
    </svg>
  );
};

export default RubyIcon;