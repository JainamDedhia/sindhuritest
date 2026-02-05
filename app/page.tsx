import CategoryBento from "./components/CategoryBento";
import FeaturedCollection from "./components/FeaturedCollection";
import GoldRateBanner from "./components/GoldRateBanner";
import HeroSection from "./components/HeroSection"
import ShowcaseSlider from "./components/ShowcaseSlider";

export default function HomePage() {
  return (
    <main className="p-2 space-y-2">
      <HeroSection />
      

      {/* Gold Rate */}
     <GoldRateBanner />


     <CategoryBento />

     <ShowcaseSlider />

      {/* Featured Products */}
      <FeaturedCollection />
    </main>
  );
}