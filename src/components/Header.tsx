import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
const logo = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062974/atfacility_destinations/yjlj1s9n36cpcpf27xn3.avif";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/destinations", label: "Destinations" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        scrolled || open
          ? "bg-background/95 backdrop-blur border-b border-border shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label={SITE.name}>
          <img src={logo} alt="AT Facilities logo" width={44} height={44} className="h-10 w-10 md:h-11 md:w-11 object-contain" />
          <div className="leading-tight">
            <div className={cn("font-display font-bold text-lg md:text-xl", scrolled || open ? "text-navy" : "text-white drop-shadow")}>
              AT Facilities
            </div>
            <div className={cn("text-[10px] md:text-[11px] uppercase tracking-[0.18em] -mt-0.5", scrolled || open ? "text-secondary" : "text-white/85")}>
              Travel Related Services
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3.5 py-2 rounded-md text-sm font-medium transition-smooth",
                  scrolled
                    ? isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
                    : isActive ? "text-white" : "text-white/85 hover:text-white"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className={cn(
              "hidden md:inline-flex items-center gap-2 text-sm font-semibold transition-smooth",
              scrolled || open ? "text-navy hover:text-primary" : "text-white hover:text-primary-glow"
            )}
          >
            <Phone className="h-4 w-4" /> {SITE.phone}
          </a>
          <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-warm text-primary-foreground shadow-warm hover:opacity-95">
            <Link to="/contact">Book Now</Link>
          </Button>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className={cn(
              "lg:hidden p-2 rounded-md transition-smooth",
              scrolled || open ? "text-navy" : "text-white"
            )}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-x py-3 flex flex-col">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-3 rounded-md text-base font-medium border-b border-border/60 last:border-0",
                    isActive ? "text-primary" : "text-foreground/85"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a href={`tel:${SITE.phoneRaw}`} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
              <Phone className="h-4 w-4" /> {SITE.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
