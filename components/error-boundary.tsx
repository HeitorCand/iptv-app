"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || "Ocorreu um erro inesperado. Por favor, tente novamente."}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
