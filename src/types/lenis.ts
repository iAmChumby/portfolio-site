// Shared type definitions for Lenis smooth scroll library

export interface LenisInstance {
  scrollTo: (target: number, options?: { duration?: number; easing?: (t: number) => number }) => void
  stop: () => void
  start: () => void
  raf: (time: number) => void
  destroy: () => void
}

// Extend Window interface to include lenis
declare global {
  interface Window {
    lenis?: LenisInstance
  }
}