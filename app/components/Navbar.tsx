export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-gray-200 border-b border-gray-300 flex items-center px-6">
      <div className="w-32 h-6 bg-gray-400 rounded"></div>

      <div className="ml-auto flex gap-4">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
      </div>
    </nav>
  )
}
