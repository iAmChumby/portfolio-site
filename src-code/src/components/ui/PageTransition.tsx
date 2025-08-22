'use client'

import { motion, AnimatePresence, MotionConfig, cubicBezier } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useState, useEffect } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

// Hook to detect reduced motion preference
const useLocalReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Optimized animation variants with performance considerations
const createPageVariants = (reducedMotion: boolean) => ({
  initial: {
    opacity: 0,
    y: reducedMotion ? 0 : 12,
    scale: reducedMotion ? 1 : 0.99
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: reducedMotion ? 0.15 : 0.4,
      ease: cubicBezier(0.25, 0.1, 0.25, 1), // Custom easing for smoothness
      opacity: { duration: reducedMotion ? 0.1 : 0.3 },
      y: { duration: reducedMotion ? 0.1 : 0.4 },
      scale: { duration: reducedMotion ? 0.1 : 0.4 }
    }
  },
  out: {
    opacity: 0,
    y: reducedMotion ? 0 : -8,
    scale: reducedMotion ? 1 : 1.01,
    transition: {
      duration: reducedMotion ? 0.1 : 0.25,
      ease: cubicBezier(0.4, 0, 1, 1), // Faster exit
      opacity: { duration: reducedMotion ? 0.05 : 0.2 },
      y: { duration: reducedMotion ? 0.05 : 0.25 },
      scale: { duration: reducedMotion ? 0.05 : 0.25 }
    }
  }
})

const createContentVariants = (reducedMotion: boolean) => ({
  initial: {
    opacity: 0,
    scale: reducedMotion ? 1 : 0.98
  },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: reducedMotion ? 0.1 : 0.35,
      delay: reducedMotion ? 0 : 0.1,
      ease: cubicBezier(0.25, 0.1, 0.25, 1)
    }
  },
  out: {
    opacity: 0,
    scale: reducedMotion ? 1 : 1.02,
    transition: {
      duration: reducedMotion ? 0.05 : 0.2,
      ease: cubicBezier(0.4, 0, 1, 1)
    }
  }
})

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useLocalReducedMotion()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const pageVariants = createPageVariants(prefersReducedMotion)
  const contentVariants = createContentVariants(prefersReducedMotion)

  // Enhanced scroll to top with Lenis integration
  const scrollToTop = () => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return
    
    // Use Lenis if available for smoother scrolling
    const lenis = (window as { lenis?: { scrollTo?: (position: number, options?: { duration?: number; easing?: (t: number) => number }) => void } }).lenis
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 0.8, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
    } else if (typeof document !== 'undefined' && 'scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }

  // Stop Lenis during page transitions to prevent conflicts
  const handleTransitionStart = () => {
    setIsTransitioning(true)
    if (typeof window !== 'undefined') {
      const lenis = (window as { lenis?: { stop?: () => void } }).lenis
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop()
      }
    }
  }

  const handleTransitionComplete = () => {
    setIsTransitioning(false)
    if (typeof window !== 'undefined') {
      const lenis = (window as { lenis?: { start?: () => void } }).lenis
      if (lenis && typeof lenis.start === 'function') {
        // Small delay to ensure smooth transition
        setTimeout(() => lenis.start?.(), 100)
      }
    }
  }

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <div className="relative w-full overflow-hidden">
        <AnimatePresence 
          mode="wait" 
          initial={false}
          onExitComplete={() => {
            scrollToTop()
            handleTransitionComplete()
          }}
        >
          <motion.div
            key={pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            className="w-full min-h-screen"
            onAnimationStart={handleTransitionStart}
            onAnimationComplete={handleTransitionComplete}
            style={{
              // Optimized for GPU acceleration
              willChange: isTransitioning ? 'transform, opacity' : 'auto',
              transform: 'translateZ(0)', // Force GPU layer
              backfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            <motion.div
              variants={contentVariants}
              className="w-full h-full"
              style={{
                willChange: isTransitioning ? 'transform, opacity' : 'auto',
                transform: 'translateZ(0)', // Force GPU layer
                backfaceVisibility: 'hidden'
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}