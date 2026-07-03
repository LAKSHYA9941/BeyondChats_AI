import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";
const logo = "https://res.cloudinary.com/cloud4lakshya/image/upload/v1783062974/atfacility_destinations/yjlj1s9n36cpcpf27xn3.avif";
import { SITE } from "@/lib/site";

const Footer = () => (
  <footer className="bg-navy text-white/85 mt-24">
    <div className="container-x py-16 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-1">
        <div className="flex items-center gap-2.5 mb-4">
          <img src={logo} alt="AT Facilities" width={40} height={40} className="h-10 w-10 bg-white/95 rounded-md p-1" />
          <div>
            <div className="font-display font-bold text-lg text-white">AT Facilities</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Since {SITE.founded}</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-white/70">
          {SITE.tagline}. Hand-crafted journeys across the length and breadth of North India.
        </p>
      </div>

      <div>
        <h4 className="font-display font-semibold text-white mb-4">Explore</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/destinations" className="hover:text-primary-glow">Destinations</Link></li>
          <li><Link to="/services" className="hover:text-primary-glow">Services</Link></li>
          <li><Link to="/blog" className="hover:text-primary-glow">Travel Blog</Link></li>
          <li><Link to="/about" className="hover:text-primary-glow">About Us</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold text-white mb-4">Popular Trips</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/destinations/leh-ladakh" className="hover:text-primary-glow">Leh-Ladakh</Link></li>
          <li><Link to="/destinations/kashmir" className="hover:text-primary-glow">Kashmir</Link></li>
          <li><Link to="/destinations/char-dham" className="hover:text-primary-glow">Char Dham Yatra</Link></li>
          <li><Link to="/destinations/jaipur" className="hover:text-primary-glow">Golden Triangle</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-2.5"><Phone className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" /><a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a></li>
          <li className="flex gap-2.5"><Mail className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" /><a href={`mailto:${SITE.email}`} className="break-all">{SITE.email}</a></li>
        </ul>
        <div className="mt-5">
          <div className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">Follow us</div>
          <div className="flex gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white transition-all duration-300 text-white/80 text-xs font-medium"
            >
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="container-x py-5 text-xs text-white/55 flex flex-col md:flex-row gap-2 justify-between">
        <div>© {new Date().getFullYear()} AT Facilities. All rights reserved.</div>
        <div>Crafted with care · Travel responsibly.</div>
      </div>
    </div>
  </footer>
);

export default Footer;
