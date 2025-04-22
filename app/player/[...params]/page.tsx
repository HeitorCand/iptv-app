import PlayerScreen from "@/components/player-screen"

export default function PlayerPage({
  params,
  searchParams,
}: {
  params: { params: string[] }
  searchParams: { type?: string }
}) {
  const [contentId, episodeId] = params.params
  const type = searchParams.type || "movie"

  return <PlayerScreen contentId={contentId} episodeId={episodeId} type={type as "series" | "movie" | "live"} />
}
