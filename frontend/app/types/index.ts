export interface Article {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  url: string;
  originalContent: string;
  updatedContent: string;
  sources: string[];
  aiModel: string;
  improvedAt: string;
  improvementScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}
