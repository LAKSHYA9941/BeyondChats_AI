"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Input, Card, CardBody, Divider } from "@heroui/react";
import { Mail, Lock, ArrowRight, User } from "lucide-react";

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

  const handleAdminLogin = async () => {
    setIsLoading(true);
    await signIn("credentials", {
      email: "admin@beyondchats.com",
      password: "admin123",
      redirect: false,
    });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-black font-bold text-2xl">BC</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-white">
            BeyondChats
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Content Enhancement Platform
          </p>
        </div>

        {/* Main Card */}
        <Card className="glass-card border-none">
          <CardBody className="p-6">
            {!showEmailForm ? (
              <>
                {/* Quick Access Buttons */}
                <div className="space-y-3">
                  {/* Guest Login - Primary */}
                  <Button
                    className="w-full btn bg-white text-black font-medium hover:bg-gray-200 h-12"
                    size="lg"
                    onClick={handleGuestLogin}
                    isLoading={isLoading}
                    startContent={!isLoading && <User className="w-5 h-5" />}
                  >
                    Continue as Guest
                  </Button>

                  {/* Admin Login */}
                  <Button
                    variant="bordered"
                    className="w-full btn border-white/20 text-white hover:bg-white/10 h-12"
                    size="lg"
                    onClick={handleAdminLogin}
                    isDisabled={isLoading}
                  >
                    Login as Admin
                  </Button>
                </div>

                <Divider className="my-5 bg-white/10" />

                {/* Email option */}
                <Button
                  variant="light"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setShowEmailForm(true)}
                  startContent={<Mail className="w-4 h-4" />}
                >
                  Sign in with Email
                </Button>
              </>
            ) : (
              <>
                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    startContent={<Mail className="w-4 h-4 text-gray-500" />}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/5 border-white/10 hover:border-white/30",
                      input: "text-white",
                      label: "text-gray-400"
                    }}
                  />

                  <Input
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    startContent={<Lock className="w-4 h-4 text-gray-500" />}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "bg-white/5 border-white/10 hover:border-white/30",
                      input: "text-white",
                      label: "text-gray-400"
                    }}
                  />

                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full btn bg-white text-black font-medium hover:bg-gray-200"
                    size="lg"
                    isLoading={isLoading}
                    endContent={!isLoading && <ArrowRight className="w-4 h-4" />}
                  >
                    Sign In
                  </Button>
                </form>

                <Divider className="my-5 bg-white/10" />

                <Button
                  variant="light"
                  className="w-full text-gray-400 hover:text-white"
                  onClick={() => setShowEmailForm(false)}
                >
                  ← Back to quick options
                </Button>
              </>
            )}
          </CardBody>
        </Card>

        <p className="text-xs text-gray-600 text-center mt-4">
          Demo: admin@beyondchats.com / admin123
        </p>
      </motion.div>
    </div>
  );
}
