"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 link-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-black font-bold text-2xl font-heading">BC</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white font-heading">
            BeyondChats
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Content Enhancement Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 sm:p-8">
          {!showEmailForm ? (
            <>
              {/* Quick Access Buttons */}
              <div className="space-y-4">
                {/* Guest Login - Primary */}
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

              {/* Email option */}
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
                  <label htmlFor="signin-email">Email</label>
                  <div className="relative">
                    <input
                      id="signin-email"
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
                  <label htmlFor="signin-password">Password</label>
                  <div className="relative">
                    <input
                      id="signin-password"
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

        <p className="text-xs text-gray-600 text-center mt-6">
          Need help? Contact support@beyondchats.com
        </p>
      </motion.div>
    </div>
  );
}
