import React from 'react';

interface RedisIconProps {
  size?: number;
  className?: string;
}

const RedisIcon: React.FC<RedisIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="12" cy="8" rx="8" ry="3" fill="#DC382D"/>
      <ellipse cx="12" cy="12" rx="8" ry="3" fill="#C6302B"/>
      <ellipse cx="12" cy="16" rx="8" ry="3" fill="#DC382D"/>
      <path
        d="M4 8v8c0 1.5 3.5 3 8 3s8-1.5 8-3V8c0 1.5-3.5 3-8 3s-8-1.5-8-3z"
        fill="#A41E22"
      />
      <ellipse cx="12" cy="8" rx="6" ry="2" fill="#FFF"/>
      <ellipse cx="12" cy="12" rx="6" ry="2" fill="#FFF"/>
      <ellipse cx="12" cy="16" rx="6" ry="2" fill="#FFF"/>
      <path
        d="M8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"
        fill="#DC382D"
      />
    </svg>
  );
};

export default RedisIcon;