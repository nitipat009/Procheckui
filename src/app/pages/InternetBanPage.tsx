import { HeroBanner } from "../components/HeroBanner";
import { HeroSearchHome } from "../components/HeroSearchHome";
import { PopularPackagesHome } from "../components/PopularPackagesHome";
import { Providers } from "../components/Providers";
import { News } from "../components/News";
import { FaqArticles } from "../components/FaqArticles";
import { Footer } from "../components/Footer";
import { AiChat } from "../components/AiChat";

export function InternetBanPage() {
  return (
    <div className="min-h-screen nbtc-page">
      <HeroBanner />
      <HeroSearchHome />
      <PopularPackagesHome />
      <Providers />
      <News />
      <FaqArticles />
      <Footer />
      <AiChat />
    </div>
  );
}
