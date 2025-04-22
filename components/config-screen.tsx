"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { testConnection, getErrorMessage } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

export default function ConfigScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const [apiUrl, setApiUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [forceHttps, setForceHttps] = useState(false)
  const [showMixedContentInfo, setShowMixedContentInfo] = useState(false)

  // Check if the URL is HTTP and we're on HTTPS
  useEffect(() => {
    if (
      apiUrl.toLowerCase().startsWith("http:") &&
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      setShowMixedContentInfo(true)
    } else {
      setShowMixedContentInfo(false)
    }
  }, [apiUrl])

  const handleTestConnection = async () => {
    if (!apiUrl || !username || !password) {
      setTestResult({
        success: false,
        message: "Por favor, preencha todos os campos.",
      })
      return
    }

    // Validate URL format
    let processedUrl = apiUrl.trim()

    try {
      // If forceHttps is enabled, convert http to https
      if (forceHttps && processedUrl.toLowerCase().startsWith("http:")) {
        processedUrl = processedUrl.replace(/^http:/i, "https:")
      }

      // Test if it's a valid URL
      new URL(processedUrl)
    } catch (error) {
      setTestResult({
        success: false,
        message: "URL inválida. Verifique o formato (ex: http://exemplo.com:80/player_api.php).",
      })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      // Save configuration to local storage first so the test can use it
      localStorage.setItem(
        "streamConfig",
        JSON.stringify({
          apiUrl: processedUrl,
          username,
          password,
          forceHttps,
        }),
      )

      // Test the connection
      const isConnected = await testConnection()

      if (isConnected) {
        setTestResult({
          success: true,
          message: "Conexão estabelecida com sucesso!",
        })

        toast({
          title: "Configuração salva",
          description: "Suas configurações foram salvas com sucesso.",
          variant: "default",
        })

        // Wait a moment to show success message before redirecting
        setTimeout(() => {
          router.push("/home")
        }, 1500)
      } else {
        setTestResult({
          success: false,
          message: "Falha ao conectar. Verifique as credenciais e a URL.",
        })
      }
    } catch (error) {
      console.error("Connection test error:", error)

      // Check if it's a mixed content error
      const errorMessage = getErrorMessage(error)
      if (
        errorMessage.includes("Mixed Content") ||
        errorMessage.includes("blocked") ||
        errorMessage.includes("insecure")
      ) {
        setTestResult({
          success: false,
          message:
            "Erro de conteúdo misto: seu navegador bloqueou a requisição HTTP em um site HTTPS. Tente ativar 'Forçar HTTPS' ou use um servidor com HTTPS.",
        })
      } else {
        setTestResult({
          success: false,
          message: errorMessage || "Erro ao testar conexão. Verifique o formato da URL.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Configuração do Streaming</CardTitle>
          <CardDescription>Configure a conexão com o serviço de streaming</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL da API</Label>
            <Input
              id="apiUrl"
              placeholder="http://exemplo.com:80/player_api.php"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="forceHttps"
              checked={forceHttps}
              onCheckedChange={(checked) => setForceHttps(checked === true)}
            />
            <Label htmlFor="forceHttps" className="text-sm font-normal">
              Forçar HTTPS (tente isso se tiver problemas de conexão)
            </Label>
          </div>

          {showMixedContentInfo && (
            <Alert variant="warning" className="bg-amber-50">
              <Info className="h-4 w-4" />
              <AlertTitle>Possível problema de conteúdo misto</AlertTitle>
              <AlertDescription>
                Você está usando uma URL HTTP em um site HTTPS. Seu navegador pode bloquear esta conexão. Tente ativar a
                opção "Forçar HTTPS" acima ou use um servidor com HTTPS.
              </AlertDescription>
            </Alert>
          )}

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              {testResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{testResult.success ? "Sucesso" : "Erro"}</AlertTitle>
              <AlertDescription>{testResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleTestConnection} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Testando...
              </>
            ) : (
              "Testar Conexão"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
