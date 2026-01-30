'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  
  const { scrollY } = useScroll()
  
  // Spring configuration for the "ease-out" feel
  const springConfig = {
    damping: 15,
    stiffness: 40,
    mass: 0.1,
    restDelta: 0.001
  }

  const smoothY = useSpring(scrollY, springConfig)
  
  // Invert the scroll for the inertia effect
  const y = useTransform(smoothY, (value) => -value)

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    // Polling height for dynamic content
    const interval = setInterval(handleResize, 1000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      <div style={{ height: contentHeight }} />
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="fixed top-0 left-0 w-full overflow-hidden will-change-transform"
      >
        {children}
      </motion.div>
    </>
  )
}
