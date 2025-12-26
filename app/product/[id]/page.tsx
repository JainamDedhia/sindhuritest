export default function ProductDetail() {
  return (
    <main className="p-6 grid md:grid-cols-2 gap-6">
      {/* Image */}
      <div className="h-80 bg-gray-300 rounded-lg"></div>

      {/* Details */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Gold Ring</h1>
        <p className="text-gray-600">22K Gold · Weight: 8g</p>
        <p className="text-lg font-medium">₹45,000</p>

        <button className="w-full bg-gray-800 text-white py-2 rounded">
          Add to Cart
        </button>
      </div>
    </main>
  );
}
