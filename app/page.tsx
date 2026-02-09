import CategoryBento from "./components/CategoryBento";
import FeaturedBento from "./components/FeaturedBento";
import FeaturedCollection from "./components/FeaturedCollection";
import GoldRateBanner from "./components/GoldRateBanner";
import HeroSection from "./components/HeroSection"
import ReviewsSection from "./components/ReviewSection";
import ShowcaseSlider from "./components/ShowcaseSlider";
import VideoTestimonials from "./components/VideoTestimonials";

export default function HomePage() {
  return (
    <main className="p-2 space-y-2">
      <HeroSection />
      

      {/* Gold Rate */}
     <GoldRateBanner />


     <CategoryBento />

     <ShowcaseSlider />

     <FeaturedBento />

      {/* Featured Products */}
      <FeaturedCollection />

      <ReviewsSection />

      <VideoTestimonials />
    </main>
  );
}