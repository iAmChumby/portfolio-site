import React from 'react';

interface KubernetesIconProps {
  className?: string;
  size?: number;
}

const KubernetesIcon: React.FC<KubernetesIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6" />
      <path d="M1 12h6m6 0h6" />
      <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24" />
      <path d="M19.78 4.22l-4.24 4.24m-5.08 5.08l-4.24 4.24" />
    </svg>
  );
};

export default KubernetesIcon;