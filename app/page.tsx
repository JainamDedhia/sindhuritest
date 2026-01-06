import CategoryBento from "./components/CategoryBento";
import GoldRateBanner from "./components/GoldRateBanner";
import HeroSection from "./components/HeroSection"

export default function HomePage() {
  return (
    <main className="p-6 space-y-6">
      <HeroSection />
      

      {/* Gold Rate */}
     <GoldRateBanner />


     <CategoryBento />

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