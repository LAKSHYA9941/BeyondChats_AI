import { useState, useEffect, useCallback, useRef } from "react";
import { Lock, Unlock, RefreshCw, Loader2, Calendar, MapPin, Users, Phone, Mail, StickyNote, Search, ChevronDown, ChevronUp, CheckCircle2, Undo2, Timer } from "lucide-react";
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
  resolvedAt: string | null;
  createdAt: string;
}

const TEN_MINUTES = 10 * 60 * 1000;

const SecretAdmin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [, setTick] = useState(0); // force re-render for countdown
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second to update countdowns
  useEffect(() => {
    const hasResolved = enquiries.some((e) => e.resolvedAt);
    if (hasResolved) {
      tickRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [enquiries]);

  // Auto-remove expired resolved enquiries from local state
  useEffect(() => {
    const expired = enquiries.filter(
      (e) => e.resolvedAt && Date.now() - new Date(e.resolvedAt).getTime() >= TEN_MINUTES
    );
    if (expired.length > 0) {
      setEnquiries((prev) =>
        prev.filter(
          (e) => !e.resolvedAt || Date.now() - new Date(e.resolvedAt).getTime() < TEN_MINUTES
        )
      );
    }
  });

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

  const toggleResolved = async (id: string, currentlyResolved: boolean) => {
    const newResolved = !currentlyResolved;

    // Optimistic update
    setEnquiries((prev) =>
      prev.map((e) =>
        e._id === id
          ? { ...e, resolvedAt: newResolved ? new Date().toISOString() : null }
          : e
      )
    );

    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, resolved: newResolved }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch {
      // Revert on failure
      setEnquiries((prev) =>
        prev.map((e) =>
          e._id === id
            ? { ...e, resolvedAt: currentlyResolved ? new Date().toISOString() : null }
            : e
        )
      );
    }
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

  const getCountdown = (resolvedAt: string) => {
    const elapsed = Date.now() - new Date(resolvedAt).getTime();
    const remaining = Math.max(0, TEN_MINUTES - elapsed);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            const isResolved = !!enq.resolvedAt;
            return (
              <div
                key={enq._id}
                className={`rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300 overflow-hidden border ${
                  isResolved
                    ? "bg-green-50/60 border-green-200/80 opacity-75"
                    : "bg-card border-border"
                }`}
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
                      <span className={`font-semibold truncate ${isResolved ? "line-through text-muted-foreground" : "text-navy"}`}>
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
                      {isResolved && (
                        <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {getCountdown(enq.resolvedAt!)}
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
                  <div className="px-5 pb-5 pt-0 border-t border-border/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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

                    {/* Resolve / Unresolve button */}
                    <div className="mt-4 pt-3 border-t border-border/30 flex items-center gap-3">
                      <Button
                        size="sm"
                        variant={isResolved ? "outline" : "default"}
                        className={
                          isResolved
                            ? "gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                            : "gap-2 bg-green-600 hover:bg-green-700 text-white"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleResolved(enq._id, isResolved);
                        }}
                      >
                        {isResolved ? (
                          <>
                            <Undo2 className="h-3.5 w-3.5" />
                            Unresolve
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark Resolved
                          </>
                        )}
                      </Button>
                      {isResolved && (
                        <span className="text-xs text-muted-foreground">
                          Auto-removes in {getCountdown(enq.resolvedAt!)}
                        </span>
                      )}
                    </div>
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
