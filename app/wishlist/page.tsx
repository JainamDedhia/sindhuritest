export default function WishlistPage() {
  return (
    <div className="p-6 grid grid-cols-4 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded"></div>
      ))}
    </div>
  )
}
