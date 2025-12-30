"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Spinner, Button } from "@heroui/react";
import { RefreshCw, FileText } from "lucide-react";
import Navbar from "./components/Navbar";
import ArticleCard from "./components/ArticleCard";
import { Article } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/blogs`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
      } else {
        setError("Failed to fetch articles");
      }
    } catch (err) {
      setError("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchArticles();
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Articles
            </h1>
            
            <Button
              onClick={fetchArticles}
              isLoading={loading}
              className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
              startContent={!loading && <RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
          </motion.div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="lg" color="white" />
              <p className="mt-4 text-gray-400">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={fetchArticles} 
                className="btn bg-white text-black hover:bg-gray-200"
              >
                Try Again
              </Button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No articles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {articles.map((article, index) => (
                <ArticleCard key={article._id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2024 BeyondChats
          </p>
        </div>
      </footer>
    </div>
  );
}
