import HeroSection from "./components/HeroSection"

export default function HomePage() {
  return (
    <main className="p-6 space-y-6">
      <HeroSection />
      <main/>

      {/* Gold Rate */}
      <div className="bg-gray-200 p-4 rounded-md">
        <p className="text-gray-700 font-medium">
          Today’s Gold Rate: ₹6,250 / gram
        </p>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Featured Jewellery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
    </main>
  );
}