import { redirect } from "next/navigation"
import DetailsScreen from "@/components/details-screen"
import { getCredentials } from "@/lib/api-service"

export default function DetailsPage({
  params,
}: {
  params: { type: string; id: string }
}) {
  // Check if credentials are configured
  if (typeof window !== "undefined") {
    const credentials = getCredentials()
    if (!credentials) {
      redirect("/")
    }
  }

  return <DetailsScreen type={params.type} id={params.id} />
}
