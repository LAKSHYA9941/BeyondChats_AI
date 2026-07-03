import { Link } from "react-router-dom";
import { ArrowRight, BedDouble, Heart, Users, Car, Plane, MapPin, Quote, Phone, Clock, ShieldCheck, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import Seo from "@/components/Seo";
import InquiryForm from "@/components/InquiryForm";
import { Button } from "@/components/ui/button";
import { destinations, categoryMeta } from "@/data/destinations";
import { posts } from "@/data/blog";
import { SITE } from "@/lib/site";
const manali_market = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783063004/atfacility_destinations/onjmsgwcs6bikcc5hmwp.avif";
const vishnu_stambh = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783063020/atfacility_destinations/hskj9syymnejh9w4fese.avif";
const kufri = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062992/atfacility_destinations/e697svs5vw6rn7fvm61z.avif";
const kedar = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783063013/atfacility_destinations/rtnshagapxxwutsdyxqd.avif";

const services = [
  { icon: BedDouble, title: "Hotel Reservation", desc: "National & international stays — from heritage havelis to luxury resorts." },
  { icon: Heart,     title: "Honeymoon Packages", desc: "Romantic, private and perfectly paced escapes for two." },
  { icon: Users,     title: "Groups & Conferences", desc: "Large group, MICE and meeting arrangements handled end-to-end." },
  { icon: Car,       title: "Taxi & Cab Booking", desc: "Reliable chauffeured cabs across every North Indian state." },
  { icon: Plane,     title: "Airport Transfers", desc: "Punctual pickups and drops at every major North India airport." },
  { icon: MapPin,    title: "Custom Itineraries", desc: "Tailor-made journeys built around your dates, pace and budget." },
];

const featuredCats = (["himalayas", "spiritual", "heritage", "honeymoon"] as const);

const testimonials = [
  { name: "Priya & Rohan", trip: "Kashmir Honeymoon", text: "Every detail felt thought-through. The houseboat, the shikara at sunset — pure magic." },
  { name: "Sandeep Verma", trip: "Char Dham Yatra", text: "They arranged everything — permits, choppers, hotels. We just focused on the darshan." },
  { name: "The Mehra Family", trip: "Leh-Ladakh", text: "Driver was a local hero. Acclimatisation was perfect. Pangong took our breath away." },
  { name: "Anita Sharma", trip: "Golden Triangle", text: "Hand-picked heritage hotels and the smoothest cab rides. Best India trip we've done." },
];

const Index = () => {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: SITE.name,
    description: SITE.tagline,
    telephone: SITE.phone,
    email: SITE.email,
    url: SITE.url,
    sameAs: [SITE.instagram],
    foundingDate: SITE.founded,
    areaServed: ["North India", "Himachal Pradesh", "Uttarakhand", "Kashmir", "Ladakh", "Punjab", "Rajasthan", "Delhi"],
  };

  return (
    <>
      <Seo
        title="AT Facilities — Travel & Taxi Services across North India"
        description="Hand-crafted hotel, honeymoon, group and taxi bookings across Manali, Shimla, Leh-Ladakh, Kashmir, Char Dham, Golden Triangle and beyond. Trusted since 1999."
        path="/"
        jsonLd={orgJsonLd}
      />
      <Hero />

      {/* Services strip */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-2xl">
              <span className="eyebrow">What we do</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mt-3">Travel, sorted end-to-end.</h2>
            </div>
            <Button asChild variant="link" className="text-secondary text-base p-0 h-auto">
              <Link to="/services">All services <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(s => (
              <div key={s.title} className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/40 hover:shadow-elegant transition-smooth">
                <div className="h-12 w-12 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-smooth">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured destinations */}
      <section className="py-20 md:py-28 bg-muted/40">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">Where to next</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mt-3">Featured destinations</h2>
            <p className="text-muted-foreground mt-4">Four collections, one wild and wondrous corner of India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCats.map(cat => {
              const meta = categoryMeta[cat];
              const sample = destinations.filter(d => d.category === cat).slice(0, 4);
              return (
                <Link
                  key={cat}
                  to={`/destinations?cat=${cat}`}
                  className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-elegant transition-smooth aspect-[3/4]"
                >
                  <img src={meta.image} alt={meta.label} loading="lazy" width={1280} height={896} className="h-full w-full object-cover group-hover:scale-110 transition-smooth duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="font-display text-2xl font-bold leading-tight">{meta.label}</h3>
                    <p className="text-sm text-white/80 mt-1.5 line-clamp-2">{meta.blurb}</p>
                    <div className="text-xs text-white/70 mt-3">{sample.map(s => s.name).join(" · ")}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 md:py-28">
        <div className="container-x grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="eyebrow">Why AT Facilities</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mt-3">26 years of crafting journeys, not just bookings.</h2>
            <p className="text-muted-foreground mt-5 leading-relaxed">
              Since 1999, families, honeymooners and pilgrims have trusted us with their most important trips. We answer every call ourselves, drive the routes ourselves, and know the seasons by heart.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: ShieldCheck, t: "Trusted since 1999", d: "Two and a half decades of safe, on-time travel." },
                { icon: Clock,        t: "24×7 trip support",  d: "Real humans on call — not just a chatbot." },
                { icon: Sparkles,     t: "Hand-picked stays",  d: "Hotels we've personally inspected and trust." },
                { icon: Phone,        t: "1-tap WhatsApp",     d: "Quote in minutes. Confirm in one tap." },
              ].map(f => (
                <div key={f.t} className="flex gap-3">
                  <f.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-navy">{f.t}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={manali_market} alt="Himalayas" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={vishnu_stambh} alt="Spiritual" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src={kufri} alt="Honeymoon" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="col-span-2 rounded-2xl overflow-hidden">
              <img src={kedar} alt="Heritage" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-navy text-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-glow">Travellers' tales</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Loved by travellers across India.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-smooth">
                <Quote className="h-7 w-7 text-primary-glow mb-3" />
                <p className="text-white/85 text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-white/60">{t.trip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="eyebrow">From the journal</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mt-3">Travel notes & guides</h2>
            </div>
            <Button asChild variant="link" className="text-secondary text-base p-0 h-auto">
              <Link to="/blog">All articles <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map(p => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500" />
                </div>
                <div className="text-xs uppercase tracking-wider text-secondary font-semibold">{p.category} · {p.readMin} min read</div>
                <h3 className="font-display text-xl font-semibold text-navy mt-2 group-hover:text-primary transition-smooth">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA inquiry */}
      <section className="pb-24">
        <div className="container-x">
          <div className="rounded-3xl overflow-hidden bg-gradient-cool text-white p-8 md:p-14 grid lg:grid-cols-2 gap-10 items-center shadow-elegant">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-glow">Ready when you are</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Tell us your dream. We'll plan the rest.</h2>
              <p className="text-white/85 mt-4 leading-relaxed">
                Share a few details — we'll come back within 2 hours with a tailor-made plan and a transparent quote. No spam, no pressure.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <a href={`tel:${SITE.phoneRaw}`} className="inline-flex items-center gap-2 font-semibold hover:text-primary-glow"><Phone className="h-4 w-4" />{SITE.phone}</a>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 font-semibold hover:text-primary-glow break-all">{SITE.email}</a>
              </div>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
