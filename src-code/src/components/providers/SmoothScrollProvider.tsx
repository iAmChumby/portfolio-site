'use client'

import { ReactNode, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import type { LenisInstance } from '@/types/lenis'

interface SmoothScrollProviderProps {
  children: ReactNode
  options?: {
    duration?: number
    easing?: (t: number) => number
    direction?: 'vertical' | 'horizontal'
    gestureDirection?: 'vertical' | 'horizontal' | 'both'
    smooth?: boolean
    mouseMultiplier?: number
    smoothTouch?: boolean
    touchMultiplier?: number
    infinite?: boolean
  }
}

export default function SmoothScrollProvider({ 
  children, 
  options = {} 
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      return // Don't initialize smooth scrolling if user prefers reduced motion
    }

    // Initialize Lenis with optimized settings
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
      ...options
    })

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [options])

  // Expose Lenis instance for external control
  useEffect(() => {
    if (lenisRef.current) {
      // Make Lenis instance globally accessible for page transitions
      window.lenis = lenisRef.current as LenisInstance
    }

    return () => {
      if (window.lenis) {
        delete window.lenis
      }
    }
  }, [])

  return <>{children}</>
}