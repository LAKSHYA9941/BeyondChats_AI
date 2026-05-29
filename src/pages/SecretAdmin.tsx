import { useState, useEffect, useCallback } from "react";
import { Lock, Unlock, RefreshCw, Loader2, Calendar, MapPin, Users, Phone, Mail, StickyNote, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Seo from "@/components/Seo";

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  travelDate: string;
  pax: string;
  service: string;
  notes: string;
  createdAt: string;
}

const SecretAdmin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        headers: { "x-admin-password": pw },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          throw new Error("Wrong password");
        }
        throw new Error("Failed to fetch enquiries");
      }
      const data = await res.json();
      setEnquiries(data);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchEnquiries(password);
  };

  const handleRefresh = () => {
    fetchEnquiries(password);
  };

  const filtered = enquiries.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.destination.toLowerCase().includes(q) ||
      (e.email && e.email.toLowerCase().includes(q)) ||
      (e.service && e.service.toLowerCase().includes(q))
    );
  });

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return d;
    }
  };

  // ── Login gate ──────────────────────────────────────────────
  if (!authenticated) {
    return (
      <>
        <Seo title="Admin" description="" path="/secret-admin" />
        <section className="min-h-[80vh] flex items-center justify-center px-4">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-elegant p-8 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-warm flex items-center justify-center text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <h1 className="font-display text-2xl font-bold text-navy">
                Admin Access
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the admin password to view enquiries.
            </p>
            <Input
              id="admin-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-warm text-primary-foreground shadow-warm hover:opacity-95"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              Unlock
            </Button>
          </form>
        </section>
      </>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────
  return (
    <>
      <Seo title="Admin Dashboard" description="" path="/secret-admin" />

      <section className="pt-28 pb-6 bg-muted/40">
        <div className="container-x max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="eyebrow">Admin</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mt-1">
                Enquiries
                <span className="ml-2 text-lg font-normal text-muted-foreground">
                  ({filtered.length})
                </span>
              </h1>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2 self-start"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Search */}
          <div className="mt-5 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="admin-search"
              placeholder="Search by name, phone, destination…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-x max-w-5xl mx-auto space-y-3">
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          {filtered.length === 0 && !loading && (
            <p className="text-muted-foreground text-center py-12">
              {search ? "No enquiries match your search." : "No enquiries yet."}
            </p>
          )}

          {filtered.map((enq) => {
            const isExpanded = expandedId === enq._id;
            return (
              <div
                key={enq._id}
                className="bg-card border border-border rounded-2xl shadow-sm hover:shadow-elegant transition-smooth overflow-hidden"
              >
                {/* Summary row */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : enq._id)
                  }
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-semibold text-navy truncate">
                        {enq.name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {enq.destination}
                      </span>
                      {enq.service && (
                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                          {enq.service}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(enq.createdAt)}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <Detail icon={<Phone className="h-4 w-4" />} label="Phone">
                      <a
                        href={`tel:${enq.phone}`}
                        className="text-primary hover:underline"
                      >
                        {enq.phone}
                      </a>
                    </Detail>
                    {enq.email && (
                      <Detail
                        icon={<Mail className="h-4 w-4" />}
                        label="Email"
                      >
                        <a
                          href={`mailto:${enq.email}`}
                          className="text-primary hover:underline break-all"
                        >
                          {enq.email}
                        </a>
                      </Detail>
                    )}
                    {enq.travelDate && (
                      <Detail
                        icon={<Calendar className="h-4 w-4" />}
                        label="Travel Date"
                      >
                        {enq.travelDate}
                      </Detail>
                    )}
                    {enq.pax && (
                      <Detail
                        icon={<Users className="h-4 w-4" />}
                        label="Travellers"
                      >
                        {enq.pax}
                      </Detail>
                    )}
                    {enq.notes && (
                      <div className="sm:col-span-2">
                        <Detail
                          icon={<StickyNote className="h-4 w-4" />}
                          label="Notes"
                        >
                          <span className="whitespace-pre-wrap">
                            {enq.notes}
                          </span>
                        </Detail>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

/* Tiny helper for consistent detail rows */
const Detail = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-2">
    <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
    <div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </div>
      <div className="text-navy mt-0.5">{children}</div>
    </div>
  </div>
);

export default SecretAdmin;
