"use client"

import { useEffect, useState } from "react"

interface OrigamiHeartProps {
  onAnimationComplete: () => void
}

export function OrigamiHeart({ onAnimationComplete }: OrigamiHeartProps) {
  const [animationStage, setAnimationStage] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 500),
      setTimeout(() => setAnimationStage(2), 1500),
      setTimeout(() => setAnimationStage(3), 2500),
      setTimeout(() => setAnimationStage(4), 3500),
      setTimeout(() => onAnimationComplete(), 4500),
    ]

    return () => timers.forEach(clearTimeout)
  }, [onAnimationComplete])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Floating particles background */}
      <div 
        className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${
          animationStage >= 4 ? "opacity-0" : "opacity-100"
        }`}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Left curtain with left heart half */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-background transition-transform duration-1000 ease-in-out flex items-center justify-end ${
          animationStage >= 4 ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Left half of heart */}
        <div
          className="relative w-48 h-72 md:w-64 md:h-96 origin-right transition-all duration-700 ease-out"
          style={{
            transform: animationStage >= 1 ? "rotateY(0deg)" : "rotateY(-90deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="[stop-color:oklch(0.65_0.2_10)]" />
                <stop offset="100%" className="[stop-color:oklch(0.55_0.2_10)]" />
              </linearGradient>
            </defs>
            <path
              d="M100,30 Q100,0 70,0 Q40,0 40,30 Q40,60 100,120 L100,30"
              fill="url(#leftGradient)"
              className={`transition-all duration-500 ${animationStage >= 2 ? "opacity-100" : "opacity-70"}`}
            />
            {/* Fold lines */}
            <path
              d="M100,30 L60,60 L100,120"
              fill="none"
              stroke="oklch(0.5 0.2 10)"
              strokeWidth="0.5"
              className={`transition-opacity duration-300 ${animationStage >= 2 ? "opacity-30" : "opacity-0"}`}
            />
          </svg>
          
          {/* Pulsing glow behind left half */}
          <div
            className={`absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl transition-all duration-1000 ${
              animationStage >= 3 ? "scale-150 opacity-60" : "scale-100 opacity-30"
            }`}
          />
        </div>
      </div>
      
      {/* Right curtain with right heart half */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-background transition-transform duration-1000 ease-in-out flex items-center justify-start ${
          animationStage >= 4 ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Right half of heart */}
        <div
          className="relative w-48 h-72 md:w-64 md:h-96 origin-left transition-all duration-700 ease-out"
          style={{
            transform: animationStage >= 1 ? "rotateY(0deg)" : "rotateY(90deg)",
            transformStyle: "preserve-3d",
            transitionDelay: "200ms",
          }}
        >
          <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-lg">
            <defs>
              <linearGradient id="rightGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="[stop-color:oklch(0.60_0.2_10)]" />
                <stop offset="100%" className="[stop-color:oklch(0.50_0.2_10)]" />
              </linearGradient>
            </defs>
            <path
              d="M0,30 Q0,0 30,0 Q60,0 60,30 Q60,60 0,120 L0,30"
              fill="url(#rightGradient)"
              className={`transition-all duration-500 ${animationStage >= 2 ? "opacity-100" : "opacity-70"}`}
            />
            {/* Fold lines */}
            <path
              d="M0,30 L40,60 L0,120"
              fill="none"
              stroke="oklch(0.45 0.2 10)"
              strokeWidth="0.5"
              className={`transition-opacity duration-300 ${animationStage >= 2 ? "opacity-30" : "opacity-0"}`}
            />
          </svg>
          
          {/* Pulsing glow behind right half */}
          <div
            className={`absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl transition-all duration-1000 ${
              animationStage >= 3 ? "scale-150 opacity-60" : "scale-100 opacity-30"
            }`}
          />
        </div>
      </div>

      {/* Center crease glow effect */}
      <div
        className={`absolute top-1/2 left-1/2 w-1 h-96 -translate-x-1/2 -translate-y-1/2 bg-primary/30 blur-sm transition-opacity duration-500 ${
          animationStage >= 3 && animationStage < 4 ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
