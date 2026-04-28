import { HeroBanner } from "../components/HeroBanner";
import { HeroSearch } from "../components/HeroSearch";
import { PopularPackages } from "../components/PopularPackages";
import { Providers } from "../components/Providers";
import { News } from "../components/News";
import { FaqArticles } from "../components/FaqArticles";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";

export function MobilePage() {
  return (
    <div className="min-h-screen nbtc-page">
      <HeroBanner />
      <HeroSearch />
      <PopularPackages />
      <Providers />
      <News />
      <FaqArticles />
      <Footer />
      <AiChat />
    </div>
  );
}
