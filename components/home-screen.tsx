"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Settings, AlertCircle, RefreshCw } from "lucide-react"
import ContentGrid from "@/components/content-grid"
import {
  getAllSeries,
  getAllMovies,
  getAllLiveStreams,
  type ContentItem,
  mapMovieToContent,
  mapChannelToContent,
  getCredentials,
  getErrorMessage,
} from "@/lib/api-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import ErrorBoundary from "@/components/error-boundary"

export default function HomeScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("series")
  const [isLoading, setIsLoading] = useState(true)
  const [series, setSeries] = useState<ContentItem[]>([])
  const [seriesPage, setSeriesPage] = useState(1)
  const [seriesHasMore, setSeriesHasMore] = useState(true)
  const [movies, setMovies] = useState<ContentItem[]>([])
  const [channels, setChannels] = useState<ContentItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const loader = useRef<HTMLDivElement | null>(null)
  const isLoadingMore = useRef(false)
  const initialLoadDone = useRef(false)

  const PAGE_SIZE = 30

  const loadContent = async (tab: string = activeTab) => {
    setIsLoading(true)
    setError(null)

    try {
      if (tab === "movies") {
        const moviesData = await getAllMovies()
        setMovies(moviesData.map(mapMovieToContent))
      } else if (tab === "channels") {
        const channelsData = await getAllLiveStreams()
        setChannels(channelsData.map(mapChannelToContent))
      }
    } catch (err) {
      console.error(`Failed to load ${tab}:`, err)
      const errorMessage = getErrorMessage(err)
      setError(
        `Falha ao carregar ${tab === "movies" ? "filmes" : "canais"}. ${errorMessage}`,
      )

      toast({
        title: "Erro ao carregar conteúdo",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  const loadMoreSeries = useCallback(async () => {
    if (isLoadingMore.current || !seriesHasMore) return
    
    try {
      isLoadingMore.current = true
      const newItems = await getAllSeries(seriesPage, PAGE_SIZE)
      
      setSeries((prev) => {
        const ids = new Set(prev.map(item => item.id))
        const filtered = newItems.filter(item => !ids.has(item.id))
        return [...prev, ...filtered]
      })
      
      setSeriesHasMore(newItems.length === PAGE_SIZE)
      setSeriesPage((prev) => prev + 1)
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      setError(`Falha ao carregar séries. ${errorMessage}`)
      toast({
        title: "Erro ao carregar conteúdo",
        description: errorMessage,
        variant: "destructive",
      })
      setSeriesHasMore(false)
    } finally {
      isLoadingMore.current = false
      if (!initialLoadDone.current) {
        setIsLoading(false)
        initialLoadDone.current = true
      }
    }
  }, [seriesPage, seriesHasMore, toast])

  useEffect(() => {
    const credentials = getCredentials()
    if (!credentials) {
      router.push("/")
      return
    }

    if (activeTab === "series" && series.length === 0) {
      loadMoreSeries()
    } else if (activeTab === "movies" && movies.length === 0) {
      loadContent("movies")
    } else if (activeTab === "channels" && channels.length === 0) {
      loadContent("channels")
    }
  }, [activeTab, router, series.length, movies.length, channels.length, loadMoreSeries])

  useEffect(() => {
    if (activeTab !== "series") return
    if (!loader.current) return

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && seriesHasMore && !isLoadingMore.current) {
          loadMoreSeries()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "100px"
      }
    )

    observer.observe(loader.current)
    return () => observer.disconnect()
  }, [loadMoreSeries, seriesHasMore, activeTab])

  const handleSearch = () => {
    router.push("/search")
  }

  const handleSettings = () => {
    router.push("/")
  }

  const handleRetry = () => {
    setIsRetrying(true)
    if (activeTab === "series") {
      loadMoreSeries()
    } else {
      loadContent()
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="container mx-auto flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Streaming App</h1>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handleSearch}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleSettings}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription className="flex flex-col">
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 self-start"
                  onClick={handleRetry}
                  disabled={isRetrying}
                >
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
          )}

          <Tabs defaultValue="series" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="series">Séries</TabsTrigger>
              <TabsTrigger value="movies">Filmes</TabsTrigger>
              <TabsTrigger value="channels">Canais</TabsTrigger>
            </TabsList>
            <TabsContent value="series">
              <ContentGrid title="Séries" items={series} isLoading={isLoading} contentType="series" />
              <div ref={loader} className="h-20 flex items-center justify-center">
                {isLoadingMore.current && (
                  <div className="flex items-center space-x-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    <span>Carregando mais séries...</span>
                  </div>
                )}
                {!seriesHasMore && !isLoadingMore.current && series.length > 0 && (
                  <span className="text-gray-500">Fim da lista</span>
                )}
              </div>
            </TabsContent>
            <TabsContent value="movies">
              <ContentGrid title="Filmes" items={movies} isLoading={isLoading} contentType="movies" />
            </TabsContent>
            <TabsContent value="channels">
              <ContentGrid title="Canais ao Vivo" items={channels} isLoading={isLoading} contentType="channels" />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export const mapSeriesToContent = (series: any): ContentItem => {
  let thumbnail = series.cover ?? ""
  return {
    id: String(series.series_id ?? series.id),
    title: series.name ?? series.title,
    description: series.plot ?? "",
    thumbnail,
    type: "series",
    genre: series.genre ?? "",
    year: series.year ?? "",
    backdrop: Array.isArray(series.backdrop_path) ? series.backdrop_path[0] : undefined,
    info: series,
  }
}
