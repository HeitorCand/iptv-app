"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import type { ContentItem } from "@/lib/api-service"

interface ContentGridProps {
  title: string
  items: ContentItem[]
  isLoading: boolean
  contentType: "series" | "movies" | "channels"
}

export default function ContentGrid({ title, items, isLoading, contentType }: ContentGridProps) {
  const router = useRouter()

  const handleItemClick = (id: string) => {
    router.push(`/details/${contentType}/${id}`)
  }

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleItemClick(item.id)}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={item.thumbnail || "/placeholder.svg?height=400&width=600"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=600"
                  }}
                />
                {item.progress && item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div className="h-full bg-primary" style={{ width: `${item.progress}%` }}></div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium line-clamp-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum conteúdo encontrado</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Não foi possível encontrar{" "}
            {contentType === "series" ? "séries" : contentType === "movies" ? "filmes" : "canais"}.
          </p>
        </div>
      )}
    </div>
  )
}
