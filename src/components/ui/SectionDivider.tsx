'use client';

interface SectionDividerProps {
  variant?: 'wave' | 'dots' | 'gradient' | 'zigzag';
  className?: string;
}

export default function SectionDivider({ 
  variant = 'wave', 
  className = '' 
}: SectionDividerProps) {
  const renderDivider = () => {
    switch (variant) {
      case 'wave':
        return (
          <svg
            className="w-full h-8 text-accent"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            />
          </svg>
        );
      
      case 'dots':
        return (
          <div className="flex justify-center items-center space-x-2 py-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-accent rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      
      case 'gradient':
        return (
          <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent my-8" />
        );
      
      case 'zigzag':
        return (
          <svg
            className="w-full h-6 text-accent"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M0,30 L100,10 L200,30 L300,10 L400,30 L500,10 L600,30 L700,10 L800,30 L900,10 L1000,30 L1100,10 L1200,30" />
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {renderDivider()}
    </div>
  );
}