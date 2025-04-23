"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Clock, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
  getSeriesInfo,
  getMovieInfo,
  mapSeriesDetailsToContent,
  mapMovieToContent,
  type ContentItem,
  type Episode,
  getCredentials,
  getErrorMessage,
} from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import ErrorBoundary from "@/components/error-boundary"

interface DetailsScreenProps {
  type: string
  id: string
}

export default function DetailsScreen({ type, id }: DetailsScreenProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [content, setContent] = useState<ContentItem | null>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const loadContentDetails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (type === "series") {
        const seriesDetails = await getSeriesInfo(id)
        const mappedContent = mapSeriesDetailsToContent(seriesDetails)
        setContent(mappedContent)

        // Set first episode as selected if available
        if (mappedContent.episodes && mappedContent.episodes.length > 0) {
          setSelectedEpisode(mappedContent.episodes[0])
        }
      } else if (type === "movies") {
        const movieDetails = await getMovieInfo(id)
        setContent(mapMovieToContent(movieDetails))
      } else if (type === "channels") {
        // For channels, we don't need to fetch additional details
        // We can create a basic content object with the ID
        setContent({
          id,
          title: "Canal ao Vivo",
          description: "Transmissão ao vivo",
          thumbnail: "/placeholder.svg?height=400&width=600",
          type: "channel",
        })
      }
    } catch (err) {
      console.error("Failed to load content details:", err)
      const errorMessage = getErrorMessage(err)
      setError(`Falha ao carregar detalhes do conteúdo. ${errorMessage}`)

      toast({
        title: "Erro ao carregar detalhes",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  useEffect(() => {
    // Check if credentials are configured
    const credentials = getCredentials()
    if (!credentials) {
      router.push("/")
      return
    }

    loadContentDetails()
  }, [id, type, router])

  const handleBack = () => {
    router.back()
  }

  const handlePlay = () => {
    if (type === "series" && selectedEpisode) {
      router.push(`/player/${id}/${selectedEpisode.id}?type=series`)
    } else if (type === "movies") {
      router.push(`/player/${id}?type=movie`)
    } else if (type === "channels") {
      router.push(`/player/${id}?type=live`)
    }
  }

  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode)
    router.push(`/player/${content?.id}/${episode.id}?type=series`)
  }

  const handleRetry = () => {
    setIsRetrying(true)
    loadContentDetails()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Carregando detalhes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription className="flex flex-col">
            <span>{error}</span>
            <Button variant="outline" size="sm" className="mt-2 self-start" onClick={handleRetry} disabled={isRetrying}>
              {isRetrying ? (
                <>
                  <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Tentando novamente...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Tentar novamente
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>Conteúdo não encontrado</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check if there's saved progress
  const hasProgress = content.progress && content.progress > 0

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header with background image */}
        <div className="relative h-64 md:h-96">
          <Image
            src={content.backdrop || content.thumbnail}
            alt={content.title}
            fill
            className="object-cover brightness-50"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=800&width=1200"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl font-bold md:text-3xl">{content.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {content.genre && <Badge variant="secondary">{content.genre}</Badge>}
              {content.year && (
                <Badge variant="outline" className="text-white border-white">
                  {content.year}
                </Badge>
              )}
              {content.duration && (
                <div className="flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {content.duration}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content details */}
        <div className="container mx-auto p-4">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold">Sinopse</h2>
              <p className="mt-2 text-muted-foreground">{content.description}</p>
            </div>

            {/* Play button and progress */}
            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={handlePlay}>
                <Play className="mr-2 h-5 w-5" />
                {hasProgress ? "Continuar Assistindo" : "Assistir"}
              </Button>

              {hasProgress && (
                <div className="space-y-1">
                  <Progress value={content.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">
                    {Math.round(content.progress || 0)}% concluído
                  </p>
                </div>
              )}
            </div>

            {/* Episodes (for series) */}
            {content.type === "series" && content.episodes && content.episodes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Episódios</h2>
                <div className="space-y-3">
                  {content.episodes.map((episode) => (
                    <div
                      key={episode.id}
                      className={`flex cursor-pointer rounded-lg border p-3 transition-colors ${
                        selectedEpisode?.id === episode.id ? "bg-gray-100 border-gray-300" : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleEpisodeSelect(episode)}
                    >
                      <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={episode.thumbnail || content.thumbnail}
                          alt={episode.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=600"
                          }}
                        />
                        {episode.progress && episode.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0">
                            <Progress value={episode.progress} className="h-1" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium">{episode.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{episode.description}</p>
                        {episode.duration && (
                          <div className="mt-1 flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {episode.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
