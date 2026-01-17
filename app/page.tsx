import CategoryBento from "./components/CategoryBento";
import FeaturedCollection from "./components/FeaturedCollection";
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
      <FeaturedCollection />
    </main>
  );
}