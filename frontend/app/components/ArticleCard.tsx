"use client";

import { motion } from "framer-motion";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <Card 
        className="glass-card glass-card-hover border-none h-full"
        isPressable={false}
      >
        <CardBody className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-medium text-white mb-3 line-clamp-2">
            {article.title}
          </h3>

          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
        </CardBody>

        <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
          <Link href={`/article/${article._id}`} className="w-full">
            <Button
              className="w-full btn bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 transition-all"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              Read Article
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
