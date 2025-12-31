"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Button, 
  Spinner, 
  Card,
  CardBody,
  Link as HeroLink
} from "@heroui/react";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  ExternalLink, 
  FileText,
  Zap,
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Navbar from "../../components/Navbar";
import { Article } from "../../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"enhanced" | "formatted" | "original">("enhanced");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setArticle(data.data);
          if (!data.data.updatedContent || data.data.updatedContent.length === 0) {
            setActiveTab("original");
          }
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Could not fetch article");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Spinner size="lg" color="white" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <p className="text-red-400 mb-4">{error || "Article not found"}</p>
          <Button 
            onClick={() => router.push("/")} 
            className="btn bg-white text-black"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const hasEnhanced = article.updatedContent && article.updatedContent.length > 0;
  const hasFormatted = article.formattedOriginalContent && article.formattedOriginalContent.length > 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16 sm:pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Button
              variant="light"
              className="text-gray-400 hover:text-white -ml-2"
              startContent={<ArrowLeft className="w-4 h-4" />}
              onClick={() => router.push("/")}
            >
              Back
            </Button>
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
            </div>

            <div className="mt-3">
              <HeroLink
                href={article.url}
                isExternal
                className="text-gray-500 hover:text-white text-sm flex items-center gap-1 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View on BeyondChats
              </HeroLink>
            </div>
          </motion.div>

          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="glass-card border-none overflow-hidden">
              <CardBody className="p-0">
                {/* Tab Buttons */}
                {(hasEnhanced || hasFormatted) && (
                  <div className="p-3 sm:p-4 border-b border-white/10">
                    <div className="tab-container inline-flex w-full sm:w-auto flex-wrap gap-1">
                      {hasEnhanced && (
                        <button
                          onClick={() => setActiveTab("enhanced")}
                          className={`tab-button flex-1 sm:flex-none flex items-center justify-center gap-2 ${activeTab === "enhanced" ? "active" : ""}`}
                        >
                          <Zap className="w-4 h-4" />
                          <span>Enhanced</span>
                        </button>
                      )}
                      {hasFormatted && (
                        <button
                          onClick={() => setActiveTab("formatted")}
                          className={`tab-button flex-1 sm:flex-none flex items-center justify-center gap-2 ${activeTab === "formatted" ? "active" : ""}`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Formatted</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveTab("original")}
                        className={`tab-button flex-1 sm:flex-none flex items-center justify-center gap-2 ${activeTab === "original" ? "active" : ""}`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Original</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8">
                  {activeTab === "enhanced" && hasEnhanced ? (
                    <div>
                      <div className="prose-content">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-semibold text-white mt-6 mb-3">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3 border-b border-white/10 pb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base sm:text-lg font-medium text-white mt-4 mb-2">{children}</h3>,
                            p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-sm sm:text-base">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-sm sm:text-base">{children}</ol>,
                            li: ({ children }) => <li className="text-gray-300">{children}</li>,
                            a: ({ href, children }) => (
                              <a href={href} className="text-white underline underline-offset-2 hover:text-gray-300" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-white/50 pl-4 my-4 italic text-gray-400 text-sm sm:text-base">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {article.updatedContent}
                        </ReactMarkdown>
                      </div>

                      {/* Sources */}
                      {article.sources && article.sources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Sources
                          </h3>
                          <div className="space-y-2">
                            {article.sources.map((source, index) => (
                              <a
                                key={index}
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                              >
                                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-gray-400 group-hover:text-white truncate">
                                  {source}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeTab === "formatted" && hasFormatted ? (
                    <div className="prose-content">
                      <div className="mb-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-xs sm:text-sm text-purple-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          This is the original content, cleaned and formatted by AI for better readability.
                        </p>
                      </div>
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-semibold text-white mt-6 mb-3">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg sm:text-xl font-semibold text-white mt-6 mb-3 border-b border-white/10 pb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base sm:text-lg font-medium text-white mt-4 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-sm sm:text-base">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-sm sm:text-base">{children}</ol>,
                          li: ({ children }) => <li className="text-gray-300">{children}</li>,
                          a: ({ href, children }) => (
                            <a href={href} className="text-white underline underline-offset-2 hover:text-gray-300" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-purple-500/50 pl-4 my-4 italic text-gray-400 text-sm sm:text-base">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {article.formattedOriginalContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="prose-content">
                          <div className="mb-4 p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
                            <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              This is the raw original content as scraped from the source.
                            </p>
                          </div>
                      {article.originalContent
                        .split(/\n+/)
                        .filter(p => p.trim().length > 0)
                        .map((paragraph, index) => (
                          <p 
                            key={index} 
                            className="text-gray-300 leading-relaxed mb-4 text-sm sm:text-base"
                          >
                            {paragraph.trim()}
                          </p>
                        ))
                      }
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
