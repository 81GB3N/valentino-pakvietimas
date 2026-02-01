"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  videoSrc?: string
}

export function VideoPlayer({ videoSrc }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000)
      }
    }

    const container = containerRef.current
    container?.addEventListener("mousemove", handleMouseMove)
    return () => {
      container?.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [togglePlay])

  // Demo video URL (Big Buck Bunny - open source)
  // const demoVideo = videoSrc || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  const demoVideo = videoSrc || "/video.mp4"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl">


        {/* Video Container */}
        <div
          ref={containerRef}
          className="relative bg-card rounded-2xl overflow-hidden shadow-2xl border border-border group"
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={demoVideo}
            className="w-full aspect-video bg-foreground/5 cursor-pointer"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            playsInline
            crossOrigin="anonymous"
          />

          {/* Buffering Indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/10">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Play/Pause Overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
              !isPlaying && showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Controls Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-4 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Progress Bar */}
            <div className="mb-4">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="cursor-pointer [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:shadow-lg [&_.relative]:bg-background/30 [&_[data-orientation=horizontal]>.bg-primary]:bg-primary"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="text-background hover:bg-background/20 hover:text-background"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5" fill="currentColor" />
                  )}
                  <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                </Button>

                {/* Time Display */}
                <span className="text-sm text-background/90 font-mono tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-background hover:bg-background/20 hover:text-background"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                    <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                  </Button>
                  <div className="w-20 hidden md:block">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer [&_[role=slider]]:bg-background [&_[role=slider]]:border-background [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_.relative]:bg-background/30 [&_[data-orientation=horizontal]>.bg-primary]:bg-background"
                    />
                  </div>
                </div>

                {/* Fullscreen Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-background hover:bg-background/20 hover:text-background"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                  <span className="sr-only">
                    {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}
