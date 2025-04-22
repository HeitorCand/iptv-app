"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ConfigScreen from "@/components/config-screen"
import { getCredentials } from "@/lib/api-service"

export default function Home() {
  const router = useRouter()
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Check if the app is already configured
      const credentials = getCredentials()
      setIsConfigured(!!credentials)

      if (credentials) {
        router.push("/home")
      }
    } catch (err) {
      console.error("Error checking credentials:", err)
      setError("Erro ao verificar configurações. Por favor, recarregue a página.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-10 w-10"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Erro</h2>
          <p className="mb-4">{error}</p>
          <button
            className="rounded bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return <ConfigScreen />
}
