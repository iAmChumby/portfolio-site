'use client';

import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

interface ProximityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  proximityRadius?: number;
}

const ProximityCard = forwardRef<HTMLDivElement, ProximityCardProps>(({ 
  className, 
  children, 
  proximityRadius = 250, // Reduced default radius for tighter spotlight
  ...props 
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useImperativeHandle(ref, () => cardRef.current as HTMLDivElement);
  
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if cursor is "near" the card (within proximityRadius of the border)
      // We can check if the cursor is within the rect expanded by proximityRadius
      const isNear = 
        x >= -proximityRadius && 
        x <= rect.width + proximityRadius &&
        y >= -proximityRadius && 
        y <= rect.height + proximityRadius;

      if (isNear) {
        setPosition({ x, y });
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => handleMouseMove(e));
    };

    window.addEventListener('mousemove', onMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [proximityRadius]);

  return (
    <div 
      ref={cardRef} 
      className={cn("relative rounded-[inherit]", className)} 
      {...props}
    >
      {/* Spotlight Border */}
      <div
        className="absolute inset-0 pointer-events-none z-10 w-full h-full rounded-[inherit] border border-green-500"
        style={{
          opacity,
          WebkitMaskImage: `radial-gradient(${proximityRadius}px circle at ${position.x}px ${position.y}px, black, transparent)`,
          maskImage: `radial-gradient(${proximityRadius}px circle at ${position.x}px ${position.y}px, black, transparent)`,
          transition: 'opacity 0.2s ease',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
});

ProximityCard.displayName = 'ProximityCard';

export default ProximityCard;
