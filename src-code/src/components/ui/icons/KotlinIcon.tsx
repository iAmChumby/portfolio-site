import React from 'react';

interface KotlinIconProps {
  size?: number;
  className?: string;
}

const KotlinIcon: React.FC<KotlinIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#7F52FF"/>
      <path
        d="M3 3h9l-9 9V3z"
        fill="#F88909"
      />
      <path
        d="M12 3h9v9l-9-9z"
        fill="#E44857"
      />
      <path
        d="M3 12l9-9 9 9-9 9-9-9z"
        fill="#00AFFF"
      />
      <path
        d="M12 12l9-9v18l-9-9z"
        fill="#0D7377"
      />
      <path
        d="M3 12v9h9l-9-9z"
        fill="#40B8C5"
      />
    </svg>
  );
};

export default KotlinIcon;