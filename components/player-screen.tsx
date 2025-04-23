"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  RefreshCw,
  Settings,
} from "lucide-react"
import {
  getStreamUrl,
  saveContentProgress,
  getContentCurrentTime,
  getCredentials,
  getErrorMessage,
} from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"

interface PlayerScreenProps {
  contentId: string
  episodeId?: string
  type: "series" | "movie" | "live"
}

export default function PlayerScreen({ contentId, episodeId, type }: PlayerScreenProps) {
  const router = useRouter()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("Reproduzindo")
  const [isRetrying, setIsRetrying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isMixedContentError, setIsMixedContentError] = useState(false)

  // Get video source from API
  const loadVideo = () => {
    setError(null)
    setIsMixedContentError(false)

    try {
      // Check if credentials are configured
      const credentials = getCredentials()
      if (!credentials) {
        router.push("/")
        return
      }

      // Map type to API stream type
      const streamType = type === "movie" ? "movie" : type === "series" ? "series" : "live"

      // Set title based on content type
      if (type === "series") {
        if (!episodeId) {
          throw new Error("ID do episódio é obrigatório para séries")
        }
        setTitle("Série - Episódio")
      } else if (type === "movie") {
        setTitle("Filme")
      } else {
        setTitle("Canal ao Vivo")
      }

      // Get stream URL
      const videoUrl = getStreamUrl(contentId, streamType, episodeId)
      console.log("Stream URL:", videoUrl)

      // Check for potential mixed content issues
      if (
        typeof window !== "undefined" &&
        window.location.protocol === "https:" &&
        videoUrl.toLowerCase().startsWith("http:")
      ) {
        console.warn("Potential mixed content issue: trying to load HTTP video in an HTTPS page")
      }

      // Set video source with type hints
      if (videoRef.current) {
        videoRef.current.src = videoUrl
        videoRef.current.crossOrigin = "anonymous"
        videoRef.current.preload = "auto"
        videoRef.current.load()
      }
    } catch (err) {
      console.error("Failed to get stream URL:", err)
      const errorMessage = getErrorMessage(err)

      // Check if it's a mixed content error
      if (
        errorMessage.toLowerCase().includes("mixed content") ||
        (errorMessage.toLowerCase().includes("blocked") && errorMessage.toLowerCase().includes("insecure"))
      ) {
        setIsMixedContentError(true)
      }

      setError(`Falha ao obter URL do stream. ${errorMessage}`)

      toast({
        title: "Erro ao carregar vídeo",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    loadVideo()
  }, [contentId, episodeId, type, router])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)

      // Save progress every 5 seconds for VOD content (not live)
      if (type !== "live" && Math.floor(video.currentTime) % 5 === 0) {
        saveContentProgress(contentId, video.currentTime, video.duration, type === "series" ? episodeId : undefined)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsBuffering(false)

      // Check if there's saved progress and resume (for VOD content)
      if (type !== "live") {
        const savedTime = getContentCurrentTime(contentId, type === "series" ? episodeId : undefined)

        if (savedTime && savedTime > 0) {
          video.currentTime = savedTime
        }
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)

      // Mark as completed for VOD content
      if (type !== "live") {
        saveContentProgress(contentId, video.duration, video.duration, type === "series" ? episodeId : undefined)
      }
    }

    const handleError = () => {
      console.error("Video error:", video.error)
      let errorMessage = "Erro ao reproduzir o vídeo."

      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorMessage = "A operação foi abortada."
            break
          case 2:
            errorMessage = "Erro de rede. Verifique sua conexão."
            // Check if it might be a mixed content error
            if (
              typeof window !== "undefined" &&
              window.location.protocol === "https:" &&
              video.src.toLowerCase().startsWith("http:")
            ) {
              setIsMixedContentError(true)
              errorMessage += " Possível erro de conteúdo misto (HTTP em HTTPS)."
            }
            break
          case 3:
            errorMessage = "Erro ao decodificar o vídeo."
            break
          case 4:
            errorMessage = "Formato de vídeo não suportado. Tente usar um navegador diferente ou atualize seu navegador."
            console.error("Video format error details:", {
              src: video.src,
              readyState: video.readyState,
              networkState: video.networkState,
            })
            break
        }
      }

      setError(errorMessage)
      setIsBuffering(false)
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("error", handleError)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("error", handleError)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [contentId, episodeId, type])

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)

      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }

      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)

      setControlsTimeout(timeout)
    }

    const playerContainer = playerContainerRef.current
    if (playerContainer) {
      playerContainer.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (playerContainer) {
        playerContainer.removeEventListener("mousemove", handleMouseMove)
      }

      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }
    }
  }, [isPlaying, controlsTimeout])

  // Player controls
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((err) => {
        console.error("Failed to play video:", err)
        const errorMessage = getErrorMessage(err)

        // Check if it's a mixed content error
        if (
          errorMessage.toLowerCase().includes("mixed content") ||
          (errorMessage.toLowerCase().includes("blocked") && errorMessage.toLowerCase().includes("insecure"))
        ) {
          setIsMixedContentError(true)
        }

        setError(`Falha ao reproduzir o vídeo. ${errorMessage}`)

        toast({
          title: "Erro ao reproduzir",
          description: errorMessage,
          variant: "destructive",
        })
      })
    }

    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      setIsMuted(false)
      if (volume === 0) {
        video.volume = 0.5
        setVolume(0.5)
      }
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const playerContainer = playerContainerRef.current
    if (!playerContainer) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      playerContainer.requestFullscreen()
    }
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.currentTime + 10, video.duration)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  const handleBack = () => {
    // Save progress before navigating back (for VOD content)
    if (type !== "live" && videoRef.current) {
      saveContentProgress(
        contentId,
        videoRef.current.currentTime,
        videoRef.current.duration,
        type === "series" ? episodeId : undefined,
      )
    }
    router.back()
  }

  const handleRetry = () => {
    setIsRetrying(true)
    loadVideo()

    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch((err) => {
        console.error("Failed to play video after retry:", err)
        setError(`Falha ao reproduzir o vídeo após nova tentativa. ${getErrorMessage(err)}`)
        setIsRetrying(false)
      })
    }
  }

  const handleGoToSettings = () => {
    router.push("/")
  }

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div ref={playerContainerRef} className="relative flex h-screen w-full items-center justify-center bg-black">
      {error ? (
        <div className="text-center text-white p-4">
          <h2 className="text-xl mb-4">Erro de Reprodução</h2>
          <p>{error}</p>

          {isMixedContentError && (
            <div className="mt-4 mb-4 p-4 bg-yellow-900/50 rounded-md text-left">
              <h3 className="font-semibold mb-2">Erro de Conteúdo Misto</h3>
              <p className="mb-2">
                Seu navegador está bloqueando o conteúdo HTTP em uma página HTTPS por motivos de segurança.
              </p>
              <ul className="list-disc pl-5 mb-2 space-y-1">
                <li>Vá para as configurações e ative a opção "Forçar HTTPS"</li>
                <li>Ou peça ao provedor do serviço para usar HTTPS</li>
              </ul>
            </div>
          )}

          <div className="flex justify-center mt-4 space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>

            {isMixedContentError ? (
              <Button variant="default" onClick={handleGoToSettings}>
                <Settings className="mr-2 h-5 w-5" />
                Configurações
              </Button>
            ) : (
              <Button variant="default" onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Tentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Tentar novamente
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="h-full w-full"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Buffering indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Controls overlay */}
          {showControls && (
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/70 via-transparent to-black/70 p-4">
              {/* Top bar */}
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="ml-2 text-white">{title}</h2>
              </div>

              {/* Center play/pause button */}
              <div className="flex items-center justify-center">
                {!isPlaying && !isBuffering && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
                    onClick={togglePlay}
                  >
                    <Play className="h-8 w-8" />
                  </Button>
                )}
              </div>

              {/* Bottom controls */}
              <div className="space-y-2">
                {/* Progress bar (hide for live content) */}
                {type !== "live" && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white">{formatTime(currentTime)}</span>
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="flex-1"
                    />
                    <span className="text-xs text-white">{formatTime(duration)}</span>
                  </div>
                )}

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>

                    {/* Skip buttons (hide for live content) */}
                    {type !== "live" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-white" onClick={skipBackward}>
                          <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white" onClick={skipForward}>
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
