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
}
