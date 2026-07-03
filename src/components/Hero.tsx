import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
const hero = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062984/atfacility_destinations/oxxjkpoak21b8k9hjote.avif";
import { SITE } from "@/lib/site";

const Hero = () => (
  <section className="relative min-h-[92vh] flex items-end overflow-hidden">
    <div className="absolute inset-0">
      <img src={hero} alt="Winding Himalayan road in Ladakh at golden hour" width={1920} height={1080} className="h-full w-full object-cover animate-ken-burns" fetchPriority="high" />
      <div className="absolute inset-0 bg-gradient-hero" />
    </div>

    <div className="relative container-x pb-20 md:pb-28 pt-32 text-white">
      <div className="max-w-3xl animate-fade-up">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-glow mb-5">
          <MapPin className="h-3.5 w-3.5" /> North India · Since {SITE.founded}
        </span>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6">
          Where will <em className="not-italic gradient-text">your story</em><br className="hidden md:block" /> unfold next?
        </h1>
        <p className="text-base md:text-xl text-white/85 max-w-2xl leading-relaxed mb-8">
          From the moonlit monasteries of Ladakh to the candle-lit ghats of Rishikesh — AT Facilities crafts unforgettable journeys across every North Indian state.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-gradient-warm text-primary-foreground shadow-warm hover:opacity-95 text-base h-12 px-6">
            <Link to="/contact">Plan My Trip <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white hover:text-navy text-base h-12 px-6">
            <Link to="/destinations">Explore Destinations</Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary-glow text-primary-glow" />
              ))}
            </div>
            <span><strong className="text-white">4.9</strong> · 1,200+ happy travellers</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/30" />
          <div>26+ years · 18 destinations · 24×7 support</div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
