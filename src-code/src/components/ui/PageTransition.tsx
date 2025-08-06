'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      mass: 1
    }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      mass: 1
    }
  }
}

const contentVariants = {
  initial: {
    opacity: 0,
    scale: 0.98
  },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      mass: 1
    }
  },
  out: {
    opacity: 0,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      mass: 1
    }
  }
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence 
        mode="wait" 
        initial={false}
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
        <motion.div
          key={pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          className="w-full min-h-screen"
          style={{
            willChange: 'transform, opacity',
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
        >
          <motion.div
            variants={contentVariants}
            className="w-full h-full"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}