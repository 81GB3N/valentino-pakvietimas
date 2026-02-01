"use client"

import { useState, useCallback } from "react"
import { OrigamiHeart } from "@/components/origami-heart"
import { VideoPlayer } from "@/components/video-player"

export default function Home() {
  const [animationComplete, setAnimationComplete] = useState(false)

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true)
  }, [])

  return (
    <main className="min-h-screen bg-background relative">
      {/* Video player is always rendered behind */}
      <VideoPlayer />
      
      {/* Heart curtain overlay - rendered on top */}
      {!animationComplete && (
        <OrigamiHeart onAnimationComplete={handleAnimationComplete} />
      )}
    </main>
  )
}
