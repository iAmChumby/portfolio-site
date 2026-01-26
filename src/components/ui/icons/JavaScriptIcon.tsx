import React from 'react';

interface JavaScriptIconProps {
  size?: number;
  className?: string;
}

const JavaScriptIcon: React.FC<JavaScriptIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#F7DF1E"/>
      <path
        d="M12.5 16.5c0 1.5-1 2.5-2.5 2.5s-2.5-1-2.5-2.5V12h1.5v4.5c0 0.5 0.5 1 1 1s1-0.5 1-1V12h1.5v4.5z"
        fill="#000"
      />
      <path
        d="M16.5 19c-1.5 0-2.5-1-2.5-2.5h1.5c0 0.5 0.5 1 1 1s1-0.5 1-1c0-0.5-0.5-1-1-1h-1v-1.5h1c0.5 0 1-0.5 1-1s-0.5-1-1-1s-1 0.5-1 1h-1.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 0.5-0.2 1-0.5 1.3 0.3 0.3 0.5 0.8 0.5 1.3 0 1.5-1 2.4-2.5 2.4z"
        fill="#000"
      />
    </svg>
  );
};

export default JavaScriptIcon;