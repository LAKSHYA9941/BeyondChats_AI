"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { 
  MessageSquare, 
  Zap, 
  Brain, 
  Clock, 
  ArrowRight, 
  User, 
  Mail, 
  Lock
} from "lucide-react";

// Animated typing text component
const TypingText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="typing-cursor" />}
    </span>
  );
};

// Fade in section wrapper
const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// AI lines SVG decoration
const AILines = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    viewBox="0 0 400 400"
    fill="none"
  >
    <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="0.5" className="ai-line opacity-20" />
    <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="0.5" className="ai-line opacity-40" style={{ animationDelay: "0.5s" }} />
    <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="0.5" className="ai-line opacity-60" style={{ animationDelay: "1s" }} />
  </svg>
);

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, delay }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay: number;
}) => (
  <FadeInSection delay={delay}>
    <div className="feature-card group cursor-pointer">
      <div className="mb-4">
        <Icon className="w-8 h-8 text-black" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2 font-heading">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </FadeInSection>
);

// Stat item component
const StatItem = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <FadeInSection delay={delay}>
    <div className="text-center">
      <div className="stat-number text-4xl md:text-5xl lg:text-6xl text-white mb-2">{value}</div>
      <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
    </div>
  </FadeInSection>
);

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    await signIn("credentials", {
      email: "guest@beyondchats.com",
      password: "guest123",
      redirect: false,
    });
    router.push("/");
    router.refresh();
  };

  const features = [
    {
      icon: MessageSquare,
      title: "AI + Human Support",
      description: "Seamlessly blend AI efficiency with human empathy for the perfect customer experience."
    },
    {
      icon: Zap,
      title: "Code-Free Setup",
      description: "Get started in minutes. No developers needed. Just plug and play."
    },
    {
      icon: Brain,
      title: "Smart Knowledge Base",
      description: "AI learns from your content and gets smarter with every conversation."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Never miss a customer. Your AI assistant is always online, always ready."
    }
  ];

  const stats = [
    { value: "10K+", label: "Conversations Daily" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "50%", label: "Cost Reduction" },
    { value: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="hero-gradient" />
        
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full mb-6">
                
                <span className="text-sm text-gray-300">AI-Powered Support</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <TypingText text="Transform Your Customer Support" />
              </h1>
              
              <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
                Empower your business with intelligent chatbots that understand, engage, and convert. 
                The future of customer service is here.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#signup" className="btn-primary text-center">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </a>
    
              </div>
            </motion.div>

            {/* Right - BeyondChats Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-[500px] h-[500px] flex items-center justify-center">
                {/* Center the circular lines here */}
                <AILines />
                
                {/* Subtle pulsing glow */}
                <motion.div 
                  className="absolute w-64 h-64 bg-white/10 rounded-full blur-[80px]"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />

                <Image
                  src="/beyondchats-logo.png"
                  alt="BeyondChats Logo"
                  width={320}
                  height={320}
                  className="relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What I Like About BeyondChats Section */}
      <section className="bg-white py-20 relative">
        <div className="section-divider mb-16" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-black mb-8">
              What I Like About BeyondChats
            </h2>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-gray-800">
                BeyondChats represents the perfect intersection of cutting-edge AI technology and 
                genuine human connection. What sets it apart is the commitment to making customer 
                interactions feel natural and meaningful, not robotic.
              </p>
              <p className="text-lg leading-relaxed text-gray-800">
                The platform understands that great customer support isn't just about answering 
                questions—it's about building relationships. Every feature is designed with both 
                the business and the end-user in mind, creating a win-win scenario that's rare 
                in the SaaS landscape.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-black mb-4">
                Powerful Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to deliver exceptional customer experiences at scale.
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <blockquote className="quote-text text-black">
              "Customer support should feel human, even when it's automated."
            </blockquote>
            <div className="mt-8 text-gray-500">— The BeyondChats Philosophy</div>
          </FadeInSection>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="bg-black py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-black font-bold text-2xl font-heading">BC</span>
              </motion.div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-gray-400">
                Join thousands of businesses transforming their customer support.
              </p>
            </div>

            <div className="glass-card p-6 sm:p-8">
              {!showEmailForm ? (
                <>
                  {/* Quick Access Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                      className="btn-primary w-full h-12"
                    >
                      {isLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          <User className="w-5 h-5" />
                          Continue as Guest
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-transparent text-gray-500">or</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="btn-outline w-full"
                  >
                    <Mail className="w-4 h-4" />
                    Sign in with Email
                  </button>
                </>
              ) : (
                <>
                  {/* Email Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="input-field">
                      <label htmlFor="email">Email</label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-field">
                      <label htmlFor="password">Password</label>
                      <div className="relative">
                        <input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full h-12"
                    >
                      {isLoading ? (
                        <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEmailForm(false)}
                    className="w-full text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    ← Back to quick options
                  </button>
                </>
              )}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-black py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl font-semibold text-white mb-2">
                BeyondChats
              </h3>
              <p className="text-gray-500 text-sm">
                Transforming customer support with AI
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              © BeyondChats. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
