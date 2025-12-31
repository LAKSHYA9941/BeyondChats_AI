import "dotenv/config";
import axios from "axios";
import OpenAI from "openai";
import Blog from "../models/blog.model.js";
import dbConnect from "../lib/dbconn.js";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface BlogData {
  _id: string;
  title: string;
  originalContent: string;
  url: string;
  author: string;
  date: string;
  excerpt: string;
  category?: string;
}

interface FormattedResult {
  blogId: string;
  title: string;
  formattedContent: string;
  success: boolean;
  message: string;
}

/**
 * Formats and cleans the original blog content using LLM
 * This creates a baseline formatted version for comparison with enhanced content
 */
async function formatContentWithLLM(
  title: string,
  originalContent: string
): Promise<{ formattedContent: string; success: boolean }> {

  // Skip if content is too short
  if (!originalContent || originalContent.length < 100) {
    console.log("  ⚠️  Content too short to format");
    return { formattedContent: "", success: false };
  }

  const systemPrompt = `You are an expert content formatter and editor. Your task is to clean up and format raw blog content that may have been scraped from a website.

Your goals:
1. FIX FORMATTING: Add proper markdown structure (headings, paragraphs, lists)
2. CLEAN UP TEXT: Remove duplicated text, navigation remnants, and website artifacts
3. IMPROVE READABILITY: Break up long paragraphs, add proper spacing
4. PRESERVE THE ORIGINAL MESSAGE: Do NOT add new information or change facts
5. REMOVE NOISE: Strip out cookie notices, subscription prompts, and other non-content text

IMPORTANT RULES:
- Keep ALL original information - do not remove any facts or details
- Use the original title as the H1 heading
- Create logical H2/H3 sections based on the content flow
- Use bullet points or numbered lists where appropriate
- Keep the same writing style and tone
- Do NOT add new information that wasn't in the original
- Do NOT add a conclusion if there wasn't one
- Output clean, well-formatted markdown`;

  const userPrompt = `Please format and clean up the following raw blog content. Preserve all information but improve the structure and readability.

=== BLOG TITLE ===
${title}

=== RAW ORIGINAL CONTENT ===
${originalContent}

Please output the cleaned and formatted version in markdown format.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.3 // Lower temperature for more consistent formatting
    });

    const formattedContent = response.choices[0]?.message?.content || "";

    if (!formattedContent || formattedContent.length < 50) {
      return { formattedContent: "", success: false };
    }

    return { formattedContent, success: true };

  } catch (error: any) {
    console.error("  ❌ LLM API Error:", error.message);
    return { formattedContent: "", success: false };
  }
}

/**
 * Fetches all blogs from the API
 */
async function fetchBlogsFromAPI(): Promise<BlogData[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    console.log(`📡 Fetching blogs from ${apiUrl}/api/blogs...`);
    
    const response = await axios.get(`${apiUrl}/api/blogs?limit=100`);
    
    if (response.data.success) {
      console.log(`✅ Fetched ${response.data.data.length} blogs from API`);
      return response.data.data;
    }
    
    return [];
  } catch (error: any) {
    console.log(`⚠️  API fetch failed (${error.message}), falling back to direct DB query...`);
    // Fallback to direct database query if API is not running
    return [];
  }
}

/**
 * Fetches all blogs directly from database
 */
async function fetchBlogsFromDB(): Promise<BlogData[]> {
  console.log("📡 Fetching blogs directly from database...");
  const blogs = await Blog.find({});
  console.log(`✅ Found ${blogs.length} blogs in database`);
  return blogs.map(blog => ({
    _id: blog._id.toString(),
    title: blog.title,
    originalContent: blog.originalContent,
    url: blog.url,
    author: blog.author,
    date: blog.date,
    excerpt: blog.excerpt,
    category: blog.category
  }));
}

/**
 * Updates blog with formatted original content
 */
async function updateBlogWithFormattedContent(
  blogId: string, 
  formattedContent: string
): Promise<void> {
  await Blog.findByIdAndUpdate(blogId, {
    formattedOriginalContent: formattedContent,
    formattedAt: new Date()
  });
}

/**
 * Main formatting function - processes all blogs
 */
async function formatAllBlogs(): Promise<FormattedResult[]> {
  const results: FormattedResult[] = [];

  // Try API first, fall back to direct DB
  let blogs = await fetchBlogsFromAPI();
  
  if (blogs.length === 0) {
    blogs = await fetchBlogsFromDB();
  }

  if (blogs.length === 0) {
    console.log("❌ No blogs found to process");
    return results;
  }

  console.log(`\n📚 Processing ${blogs.length} blogs\n`);
  console.log("=".repeat(60));

  for (const blog of blogs) {
    console.log(`\n🔄 Processing: "${blog.title}"`);
    console.log("-".repeat(50));

    try {
      // Format the original content with LLM
      console.log("  📝 Formatting content with LLM...");
      const formatResult = await formatContentWithLLM(blog.title, blog.originalContent);

      if (!formatResult.success) {
        console.log("  ⚠️  Formatting failed");
        results.push({
          blogId: blog._id,
          title: blog.title,
          formattedContent: "",
          success: false,
          message: "LLM formatting failed"
        });
        continue;
      }

      // Save the formatted content to database
      console.log("  💾 Saving formatted content...");
      await updateBlogWithFormattedContent(blog._id, formatResult.formattedContent);

      console.log("  ✅ Successfully formatted and saved!");
      results.push({
        blogId: blog._id,
        title: blog.title,
        formattedContent: formatResult.formattedContent,
        success: true,
        message: "Successfully formatted"
      });

      // Log a preview
      console.log("\n  📋 Preview (first 300 chars):");
      console.log("  " + formatResult.formattedContent.slice(0, 300).replace(/\n/g, "\n  ") + "...");

    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        blogId: blog._id,
        title: blog.title,
        formattedContent: "",
        success: false,
        message: error.message
      });
    }

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Print summary of processing results
 */
function printSummary(results: FormattedResult[]): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 FORMATTING SUMMARY");
  console.log("=".repeat(60));

  const successCount = results.filter(r => r.success).length;
  const failedCount = results.filter(r => !r.success).length;

  console.log(`✅ Successfully formatted: ${successCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📚 Total processed: ${results.length}`);

  if (failedCount > 0) {
    console.log("\n📋 Failed Items:");
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.title}: ${r.message}`);
    });
  }
}

/**
 * Compare original vs formatted content
 */
function printComparisonSample(results: FormattedResult[]): void {
  const successResults = results.filter(r => r.success);
  
  if (successResults.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("📝 SAMPLE COMPARISON");
    console.log("=".repeat(60));
    console.log("\nThe formatted original content is now stored in the database.");
    console.log("You can compare it with the enhanced content using the API:\n");
    console.log("  GET /api/blogs/:id - returns both original and enhanced content");
    console.log("  \nNew field added: 'formattedOriginalContent'\n");
    console.log("This allows you to compare:");
    console.log("  • Raw original content (originalContent)");
    console.log("  • Formatted original content (formattedOriginalContent) - NEW");
    console.log("  • Enhanced content with sources (updatedContent)");
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log("\n🚀 Content Formatter Script");
  console.log("================================");
  console.log("This script formats and cleans original blog content");
  console.log("for comparison with enhanced content.\n");

  // Connect to database
  console.log("📡 Connecting to database...");
  await dbConnect();
  console.log("✅ Database connected\n");

  // Check for required environment variable
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY is not set in .env");
    process.exit(1);
  }

  // Run the formatter
  const results = await formatAllBlogs();

  // Print summary
  printSummary(results);

  // Print comparison info
  printComparisonSample(results);

  console.log("\n✨ Formatting process complete!\n");
  process.exit(0);
}

// Run the script
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
