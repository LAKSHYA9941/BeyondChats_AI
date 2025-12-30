# BeyondChats AI - Content Enhancement Platform

A full-stack application that scrapes blog articles, enhances them using AI (GPT-4o-mini), and displays both original and enhanced versions in a modern web interface.

## 🎯 Project Overview

This project was built as part of the **Full Stack Web Developer Intern Assignment** for BeyondChats. It demonstrates:

- **Web Scraping** - Automated extraction of blog articles from BeyondChats website
- **AI Enhancement** - Using OpenAI's GPT-4o-mini to improve article content with external references
- **Full-Stack Development** - RESTful APIs with Node.js/Express and a React/Next.js frontend
- **Database Management** - MongoDB for persistent storage with full CRUD operations

---

## 📁 Project Structure

```
beyondchatsai/
├── backend/                  # Node.js + Express API server
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── jobs/                 # Background scripts
│   │   ├── enhancer.ts       # Main AI enhancement script
│   │   ├── search.ts         # Google search via SerpAPI
│   │   ├── contentScraper.ts # Web content extraction
│   │   └── llm.ts            # OpenAI integration
│   └── server.ts             # Express server entry point
│
├── frontend/                 # Next.js 16 + React 19
│   ├── app/
│   │   ├── api/auth/         # NextAuth.js authentication
│   │   ├── article/[id]/     # Article detail page
│   │   ├── auth/signin/      # Sign-in page
│   │   ├── components/       # Reusable UI components
│   │   ├── types/            # TypeScript definitions
│   │   ├── page.tsx          # Home page (article listing)
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   └── package.json
│
└── README.md
```

---

## 🔧 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| Axios | HTTP client |
| Cheerio | HTML parsing for scraping |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework |
| React 19 | UI library |
| TypeScript | Type safety |
| HeroUI | UI component library |
| Framer Motion | Animations |
| NextAuth.js | Authentication |
| React Markdown | Markdown rendering |

### External APIs
| API | Purpose |
|-----|---------|
| OpenAI (GPT-4o-mini) | Article enhancement |
| SerpAPI | Google search results |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud like MongoDB Atlas)
- API keys for OpenAI and SerpAPI

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/beyondchatsai.git
cd beyondchatsai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://your-connection-string
PORT=3000
OPENAI_API_KEY=sk-your-openai-key
SERP_API_KEY=your-serpapi-key
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PHASE 1: SCRAPING                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   BeyondChats Blog ──────▶ Cheerio Scraper ──────▶ MongoDB                 │
│   (5 oldest articles)       (Extract content)      (Store articles)         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PHASE 2: ENHANCEMENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   For each article:                                                         │
│                                                                             │
│   1. Fetch from MongoDB                                                     │
│            │                                                                │
│            ▼                                                                │
│   2. Google Search (SerpAPI) ──▶ Get top 5 results                         │
│            │                                                                │
│            ▼                                                                │
│   3. Scrape Content ──▶ Extract from top 2 accessible sites                │
│            │                                                                │
│            ▼                                                                │
│   4. GPT-4o-mini ──▶ Enhance article using scraped references              │
│            │                                                                │
│            ▼                                                                │
│   5. Update MongoDB ──▶ Save enhanced content + source URLs                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PHASE 3: FRONTEND                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Next.js App ◀──────── REST API ◀──────── MongoDB                         │
│       │                                                                     │
│       ├── Sign In (Guest/Admin)                                            │
│       ├── View Article List                                                │
│       └── Read Article (Switch between Original/Enhanced)                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Articles (CRUD)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all articles (with pagination) |
| GET | `/api/blogs/:id` | Get single article by ID |
| POST | `/api/blogs` | Create new article |
| PUT | `/api/blogs/:id` | Update article |
| DELETE | `/api/blogs/:id` | Delete article |

### Query Parameters

```
GET /api/blogs?page=1&limit=10&search=AI&sortBy=date&order=desc
```

---

## 🎨 Frontend Features

### Authentication
- **Guest Login** - Quick demo access (primary option)
- **Admin Login** - Full access demo account
- **Email Login** - Custom credentials option

Demo Credentials:
```
Guest: guest@beyondchats.com / guest123
Admin: admin@beyondchats.com / admin123
```

### Article Viewing
- **Original Tab** - Shows the scraped article as-is
- **Enhanced Tab** - Shows AI-improved version with:
  - Better formatting (Markdown)
  - Improved content structure
  - Reference sources at the bottom

### UI/UX
- Dark theme (black & white)
- Responsive design (mobile-friendly)
- Glassmorphism card effects
- Subtle fade animations

---

## 🛠️ Running the Enhancement Script

After setting up the backend and having articles in the database, run:

```bash
cd backend
npm run enhance
```

This will:
1. Fetch all articles without enhanced content
2. Search Google for each article's topic
3. Scrape content from top results (tries until 2 successful)
4. Send to GPT-4o-mini for enhancement
5. Save enhanced version + sources to database

---

## 📝 Database Schema

### Blog Article

```typescript
{
  _id: ObjectId,
  title: string,
  originalContent: string,      // Scraped content
  updatedContent: string,       // AI-enhanced content (Markdown)
  sources: string[],            // Reference URLs used for enhancement
  aiModel: string,              // "gpt-4o-mini"
  url: string,                  // Original BeyondChats URL
  author: string,
  date: string,
  excerpt: string,
  category: string,
  improvementScore: number,
  improvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🌐 Deployment

### Backend (Recommended: Render.com)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Frontend (Recommended: Vercel)

1. Import project to Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL
   - `NEXTAUTH_SECRET` = generate a secure key

---

## 📋 Assignment Phases Completed

| Phase | Task | Status |
|-------|------|--------|
| **Phase 1** | Scrape 5 articles from BeyondChats blog | ✅ Done |
| **Phase 1** | Store articles in MongoDB | ✅ Done |
| **Phase 1** | Create CRUD APIs | ✅ Done |
| **Phase 2** | Google Search integration (SerpAPI) | ✅ Done |
| **Phase 2** | Web scraping for reference content | ✅ Done |
| **Phase 2** | LLM integration (GPT-4o-mini) | ✅ Done |
| **Phase 2** | Article enhancement with citations | ✅ Done |
| **Phase 3** | React/Next.js frontend | ✅ Done |
| **Phase 3** | Display original vs enhanced | ✅ Done |
| **Phase 3** | Responsive, professional UI | ✅ Done |
| **Phase 3** | Authentication | ✅ Done |

---

## 🔗 Live Links

- **Frontend**: [Your Vercel URL]
- **Backend API**: [Your Render URL]
- **GitHub**: [Your Repository URL]

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 📄 License

This project was created for the BeyondChats internship assignment.
