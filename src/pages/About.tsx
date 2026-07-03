import { Award, Users, Map, Heart } from "lucide-react";
import Seo from "@/components/Seo";
const logo = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062974/atfacility_destinations/yjlj1s9n36cpcpf27xn3.avif";
const himalayas = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062979/atfacility_destinations/omrmzg4s3mrisdpgh39k.avif";
const heritage = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062978/atfacility_destinations/mmw19nzbkobkjzeurve0.avif";

const stats = [
  { icon: Award, value: "26+", label: "Years of trust" },
  { icon: Users, value: "1,200+", label: "Happy travellers" },
  { icon: Map, value: "18", label: "Destinations" },
  { icon: Heart, value: "4.9★", label: "Average rating" },
];

const About = () => (
  <>
    <Seo
      title="About AT Facilities — Travel Specialists Since 1999"
      description="Family-run travel and taxi service based in Dwarka, New Delhi. 26 years of crafting honest, hand-picked journeys across North India."
      path="/about"
    />

    <section className="pt-32 pb-16 bg-muted/40">
      <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Our story</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-navy mt-3">
            A family of travellers, <em className="not-italic gradient-text">helping yours.</em>
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            AT Facilities began in 1999 with a simple idea — that travel should feel personal, honest and a little bit magical. Twenty-six years later, that's still what we do every day from our office in Dwarka, New Delhi.
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-warm rounded-3xl blur-2xl opacity-30" />
          <div className="relative bg-card border border-border rounded-3xl p-8 shadow-elegant">
            <img src={logo} alt="AT Facilities" className="h-24 w-24 mx-auto mb-4" />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-navy">AT Facilities</div>
              <div className="text-secondary uppercase tracking-[0.18em] text-xs font-semibold mt-1">A House of Travel Related Services</div>
              <div className="mt-4 text-sm text-muted-foreground">Founded 1999 · Dwarka, New Delhi</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container-x grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-elegant transition-smooth">
            <s.icon className="h-7 w-7 text-primary mx-auto" />
            <div className="font-display text-4xl font-bold text-navy mt-3">{s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-20">
      <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl overflow-hidden aspect-[3/4]"><img src={himalayas} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
          <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-8"><img src={heritage} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
        </div>
        <div>
          <span className="eyebrow">Meet the team</span>
          <h2 className="font-display text-4xl font-bold text-navy mt-3">Led by Ashwani Tomar</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Ashwani has been planning North India journeys for over two decades. He's driven the Manali-Leh highway more times than he can count, and personally vets every hotel we recommend.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            "We treat every booking like it's for our own family. That's the only way we know how to do this."
          </p>

          <div className="mt-8">
            <h3 className="font-display text-2xl font-bold text-navy">What we believe</h3>
            <ul className="mt-4 space-y-3 text-foreground/90">
              <li><strong className="text-navy">Honesty over upsell.</strong> We recommend what's right for you, not what pays us most.</li>
              <li><strong className="text-navy">Local knowledge.</strong> Drivers, guides and contacts we've worked with for years.</li>
              <li><strong className="text-navy">Always reachable.</strong> A real human, on call, every day of your trip.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default About;
