export default function DropBadge({ drop, className = "" }) {
  const isLive = new Date(drop.dropDate) <= new Date()

  return (
    <div
      className={`px-3 py-1.5 text-xs font-light tracking-wider ${
        isLive ? "bg-black text-gold" : "bg-offwhite/80 text-black backdrop-blur-md"
      } ${className}`}
    >
      {isLive ? "DROP LIVE" : "COMING SOON"}
    </div>
  )
}
