// Update the ApiCredentials interface to include forceHttps
export interface ApiCredentials {
  apiUrl: string
  username: string
  password: string
  forceHttps?: boolean
}

// Custom error classes
export class AuthenticationError extends Error {
  constructor(message = "Authentication failed") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
  }
}

export class ApiError extends Error {
  public statusCode: number | undefined

  constructor(message = "API error", statusCode?: number) {
    super(message)
    this.name = "ApiError"
    this.statusCode = statusCode
  }
}

export class NetworkError extends Error {
  constructor(message = "Network error") {
    super(message)
    this.name = "NetworkError"
  }
}

// Update the getCredentials function to handle the forceHttps option
export const getCredentials = (): ApiCredentials | null => {
  if (typeof window === "undefined") return null

  const storedConfig = localStorage.getItem("streamConfig")
  if (!storedConfig) return null

  try {
    const credentials = JSON.parse(storedConfig) as ApiCredentials

    // If forceHttps is enabled, ensure the URL uses HTTPS
    if (credentials.forceHttps && credentials.apiUrl.toLowerCase().startsWith("http:")) {
      credentials.apiUrl = credentials.apiUrl.replace(/^http:/i, "https:")
    }

    return credentials
  } catch (error) {
    console.error("Failed to parse stored credentials:", error)
    return null
  }
}

// Update the apiRequest function to better handle mixed content errors
async function apiRequest<T>(endpoint: string, params: Record<string, string> = {}, retries = 2): Promise<T> {
  const credentials = getCredentials()
  if (!credentials) {
    throw new AuthenticationError("Credenciais não encontradas. Configure o aplicativo primeiro.")
  }

  const { apiUrl, username, password } = credentials

  // Build URL with credentials and params
  let url: URL
  try {
    url = new URL(apiUrl)
  } catch (error) {
    throw new Error(`URL inválida: ${apiUrl}. Verifique a configuração.`)
  }

  // Check for potential mixed content issues
  if (typeof window !== "undefined" && window.location.protocol === "https:" && url.protocol === "http:") {
    console.warn("Potential mixed content issue: trying to load HTTP content in an HTTPS page")
  }

  // Add authentication params and action
  const queryParams = new URLSearchParams({
    username,
    password,
    action: endpoint, // Add the action parameter here
    ...params,
  })

  let fullUrl = `${url.toString()}?${queryParams.toString()}`

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      mode: "cors", // Alterado de "no-cors" para "cors"
      credentials: "omit",
      headers: {
        "accept": "application/json",
        "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      },
      signal: AbortSignal.timeout(30000), // Timeout de 30 segundos
    })

    // Clone the response for debugging
    const responseClone = response.clone()
    const data = await responseClone.json()
    console.log("API Response Data:", data)

    // Handle different HTTP status codes
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError()
      } else if (response.status === 404) {
        throw new NotFoundError()
      } else {
        throw new ApiError(`Erro na API: ${response.statusText}`, response.status)
      }
    }

    // Parse JSON response
    try {
      const data = await response.json() // O await agora deve funcionar corretamente

      // Some APIs return error information in the response body
      if (data && data.error) {
        throw new ApiError(`Erro na API: ${data.error}`)
      }

      return data as T
    } catch (error) {
      throw new ApiError("Erro ao processar resposta da API. Formato inválido.")
    }
  } catch (error) {
    // Handle timeout errors
    if (error.name === "AbortError") {
      console.error("A requisição demorou muito e foi abortada.")
      throw new NetworkError("A requisição excedeu o tempo limite. Tente novamente.")
    }

    // Check specifically for mixed content errors
    if (error instanceof TypeError) {
      const errorMessage = error.message.toLowerCase()

      if (
        errorMessage.includes("mixed content") ||
        (errorMessage.includes("blocked") && errorMessage.includes("insecure"))
      ) {
        throw new NetworkError(
          "Erro de conteúdo misto: seu navegador bloqueou a requisição HTTP em um site HTTPS. " +
            "Tente ativar 'Forçar HTTPS' nas configurações ou use um servidor com HTTPS.",
        )
      }

      // Handle network errors and implement retry logic
      if (errorMessage.includes("fetch")) {
        // Network error
        if (retries > 0) {
          console.log(`Retry attempt (${retries} remaining) for ${fullUrl}`)
          // Exponential backoff: wait longer between retries
          await new Promise((resolve) => setTimeout(resolve, (3 - retries) * 1000))
          return apiRequest<T>(endpoint, params, retries - 1)
        }
        throw new NetworkError()
      }
    }

    // Re-throw other errors
    throw error
  }
}

// Update the getStreamUrl function to handle HTTPS
export const getStreamUrl = (streamId: string, streamType: "live" | "movie" | "series", episodeId?: string): string => {
  const credentials = getCredentials()
  if (!credentials) {
    throw new AuthenticationError("Credenciais não encontradas. Configure o aplicativo primeiro.")
  }

  const { apiUrl, username, password, forceHttps } = credentials
  let baseUrl = apiUrl.replace("player_api.php", "")

  // If forceHttps is enabled, ensure the URL uses HTTPS
  if (forceHttps && baseUrl.toLowerCase().startsWith("http:")) {
    baseUrl = baseUrl.replace(/^http:/i, "https:")
  }

  if (streamType === "live") {
    return `${baseUrl}live/${username}/${password}/${streamId}.ts`
  } else if (streamType === "movie") {
    return `${baseUrl}movie/${username}/${password}/${streamId}.mp4`
  } else if (streamType === "series") {
    if (!episodeId) {
      throw new Error("ID do episódio é obrigatório para séries")
    }
    return `${baseUrl}series/${username}/${password}/${streamId}/${episodeId}.mp4`
  }

  throw new Error("Tipo de stream inválido")
}

// API Endpoints and Data Mapping
const API_ENDPOINTS = {
  GET_ALL_SERIES: "get_series",
  GET_ALL_MOVIES: "get_vod",
  GET_ALL_LIVE_STREAMS: "get_live_streams",
  GET_SERIES_INFO: "get_series_info",
  GET_MOVIE_INFO: "get_vod_info",
  SEARCH: "search",
}

interface ApiResponse<T> {
  status: boolean
  data: T
  error?: string
}

// Data Types
export interface ContentItem {
  id: string
  title: string
  description: string
  thumbnail: string
  backdrop?: string
  type: "series" | "movie" | "channel"
  genre?: string
  year?: string
  duration?: string
  progress?: number
  episodes?: Episode[]
  info?: any
}

export interface Episode {
  id: string
  title: string
  description: string
  thumbnail?: string
  duration?: string
  progress?: number
  season: number
  episodeNumber: string
}

interface SeriesResponse {
  series: {
    [seriesId: string]: {
      name: string
      cover: string
      plot: string
      genre: string
      year: string
      episode_details: {
        [episodeId: string]: {
          title: string
          plot: string
          episode_num: string
          season_num: string
          duration: string
          custom_sid: string
        }
      }
    }
  }
}

interface MovieResponse {
  vod: {
    [movieId: string]: {
      name: string
      cover: string
      plot: string
      genre: string
      year: string
      duration: string
    }
  }
}

interface LiveStreamResponse {
  live: {
    [channelId: string]: {
      name: string
      stream_icon: string
      epg_channel_id: string
    }
  }
}

// API Calls
export const getAllSeries = async (page = 1, pageSize = 30): Promise<ContentItem[]> => {
  const response = await apiRequest<any>("get_series")
  let items: any[] = []
  if (Array.isArray(response)) {
    items = response
  } else if (response && typeof response === "object") {
    items = Object.values(response)
  }
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return items.slice(start, end).map(mapSeriesToContent)
}

export const getAllMovies = async (): Promise<ContentItem[]> => {
  const response = await apiRequest<any>("get_vod")
  let items: any[] = []
  if (Array.isArray(response)) {
    items = response
  } else if (response && typeof response === "object" && response.vod) {
    items = Object.values(response.vod)
  }
  return items.map(mapMovieToContent)
}

export const getAllLiveStreams = async (): Promise<ContentItem[]> => {
  const response = await apiRequest<any>("get_live_streams")
  let items: any[] = []
  if (Array.isArray(response)) {
    items = response
  } else if (response && typeof response === "object" && response.live) {
    items = Object.values(response.live)
  }
  return items.map(mapChannelToContent)
}

export const getSeriesInfo = async (seriesId: string): Promise<any> => {
  const response = await apiRequest<any>(API_ENDPOINTS.GET_SERIES_INFO, { series_id: seriesId })
  return response
}

export const getMovieInfo = async (vodId: string): Promise<any> => {
  const response = await apiRequest<any>(API_ENDPOINTS.GET_MOVIE_INFO, { vod_id: vodId })
  return response
}

export const searchContent = async (query: string): Promise<ContentItem[]> => {
  try {
    const response = await apiRequest<any>(API_ENDPOINTS.SEARCH, { query: query })

    if (!response || !response.data) {
      return []
    }

    const seriesResults = Array.isArray(response.data.series)
      ? response.data.series.map(mapSeriesToContent)
      : Object.values(response.data.series || {}).map(mapSeriesToContent)
    const movieResults = Array.isArray(response.data.vod)
      ? response.data.vod.map(mapMovieToContent)
      : Object.values(response.data.vod || {}).map(mapMovieToContent)
    const channelResults = Array.isArray(response.data.live)
      ? response.data.live.map(mapChannelToContent)
      : Object.values(response.data.live || {}).map(mapChannelToContent)

    return [...seriesResults, ...movieResults, ...channelResults]
  } catch (error) {
    console.error("Search failed:", error)
    return []
  }
}

// Data Mapping Functions
export const mapSeriesToContent = (series: any): ContentItem => ({
  id: String(series.series_id ?? series.id),
  title: series.name ?? series.title,
  description: series.plot ?? "",
  thumbnail: series.cover ?? "",
  type: "series",
  genre: series.genre ?? "",
  year: series.year ?? "",
  backdrop: Array.isArray(series.backdrop_path) ? series.backdrop_path[0] : undefined,
  info: series,
})

export const mapMovieToContent = (movie: any): ContentItem => ({
  id: movie.id,
  title: movie.name,
  description: movie.plot,
  thumbnail: movie.cover,
  type: "movie",
  genre: movie.genre,
  year: movie.year,
  duration: movie.duration,
})

export const mapChannelToContent = (channel: any): ContentItem => ({
  id: channel.id,
  title: channel.name,
  description: "",
  thumbnail: channel.stream_icon,
  type: "channel",
})

export const mapSeriesDetailsToContent = (seriesDetails: any): ContentItem => {
  const series = seriesDetails.info
  const episodes: Episode[] = []

  // Processar episódios de todas as temporadas
  Object.entries(seriesDetails.episodes || {}).forEach(([seasonNum, seasonEpisodes]: [string, any]) => {
    seasonEpisodes.forEach((episode: any) => {
      episodes.push({
        id: episode.id,
        title: episode.title,
        description: episode.info?.plot || "",
        thumbnail: episode.info?.movie_image || episode.info?.cover_big || series.cover,
        duration: episode.info?.duration || "",
        season: episode.season,
        episodeNumber: episode.episode_num,
      })
    })
  })

  // Ordenar episódios por temporada e número do episódio
  episodes.sort((a, b) => {
    if (a.season !== b.season) {
      return a.season - b.season
    }
    return parseInt(a.episodeNumber) - parseInt(b.episodeNumber)
  })

  return {
    id: series.id,
    title: series.name || series.title,
    description: series.plot,
    thumbnail: series.cover,
    type: "series",
    genre: series.genre,
    year: series.year,
    backdrop: Array.isArray(series.backdrop_path) ? series.backdrop_path[0] : undefined,
    episodes: episodes,
    info: {
      ...series,
      seasons: seriesDetails.seasons,
    },
  }
}

// Local Storage Functions
const PROGRESS_KEY = "contentProgress"

export const saveContentProgress = (contentId: string, currentTime: number, duration: number, episodeId?: string) => {
  if (typeof window === "undefined") return

  try {
    const progressData = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}")
    progressData[contentId + (episodeId ? `_${episodeId}` : "")] = { currentTime, duration }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData))
  } catch (error) {
    console.error("Failed to save content progress:", error)
  }
}

export const getContentCurrentTime = (contentId: string, episodeId?: string): number | null => {
  if (typeof window === "undefined") return null

  try {
    const progressData = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}")
    const progress = progressData[contentId + (episodeId ? `_${episodeId}` : "")]
    return progress ? progress.currentTime : null
  } catch (error) {
    console.error("Failed to get content progress:", error)
    return null
  }
}

// Test Connection
export const testConnection = async (): Promise<boolean> => {
  try {
    // Attempt to fetch series (a basic API call)
    await getAllSeries(1, 1)
    return true
  } catch (error) {
    console.error("Connection test failed:", error)
    return false
  }
}

// Error Message Helper
export const getErrorMessage = (error: any): string => {
  if (error instanceof AuthenticationError) {
    return "Falha na autenticação. Verifique suas credenciais."
  } else if (error instanceof NotFoundError) {
    return "Recurso não encontrado."
  } else if (error instanceof ApiError) {
    return `Erro na API: ${error.message}`
  } else if (error instanceof NetworkError) {
    return "Erro de rede. Verifique sua conexão com a internet."
  } else if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
    return "Erro ao conectar ao servidor. Verifique a URL e sua conexão."
  } else {
    return "Ocorreu um erro inesperado."
  }
}
