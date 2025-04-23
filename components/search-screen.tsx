"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Filter, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ContentGrid from "@/components/content-grid"
import { searchContent, type ContentItem, getCredentials } from "@/lib/api-service"

export default function SearchScreen() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [contentType, setContentType] = useState<"all" | "series" | "movies" | "channels">("all")
  const [genre, setGenre] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<ContentItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if credentials are configured
    const credentials = getCredentials()
    if (!credentials) {
      router.push("/")
    }
  }, [router])

  // Perform search when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([])
      return
    }

    const performSearch = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const results = await searchContent(searchTerm)

        // Filter results based on content type and genre
        const filteredResults = results.filter((item) => {
          // Filter by content type
          const matchesType =
            contentType === "all" ||
            (contentType === "series" && item.type === "series") ||
            (contentType === "movies" && item.type === "movie") ||
            (contentType === "channels" && item.type === "channel")

          // Filter by genre
          const matchesGenre = genre === "all" || item.genre === genre

          return matchesType && matchesGenre
        })

        setSearchResults(filteredResults)
      } catch (err) {
        console.error("Search failed:", err)
        setError("Falha ao realizar a pesquisa. Verifique sua conexão.")
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const debounceTimeout = setTimeout(() => {
      performSearch()
    }, 500)

    return () => clearTimeout(debounceTimeout)
  }, [searchTerm, contentType, genre])

  const handleBack = () => {
    router.back()
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Pesquisar títulos, atores, gêneros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={toggleFilters}>
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de Conteúdo</label>
                <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="series">Séries</SelectItem>
                    <SelectItem value="movies">Filmes</SelectItem>
                    <SelectItem value="channels">Canais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Gênero</label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os gêneros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os gêneros</SelectItem>
                    <SelectItem value="action">Ação</SelectItem>
                    <SelectItem value="comedy">Comédia</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="sci-fi">Ficção Científica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchTerm ? (
          <ContentGrid
            title={`Resultados para "${searchTerm}"`}
            items={searchResults}
            isLoading={isLoading}
            contentType="series" // This is just for the routing, we're showing mixed content
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">Digite algo para pesquisar</div>
        )}
      </main>
    </div>
  )
}
