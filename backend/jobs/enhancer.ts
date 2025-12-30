import "dotenv/config";
import Blog from "../models/blog.model.js";
import dbConnect from "../lib/dbconn.js";
import { serpSearch } from "./search.js";
import { scrapeMultipleArticles } from "./contentScraper.js";
import { enhanceArticleWithLLM } from "./llm.js";

interface ProcessingResult {
  blogId: string;
  title: string;
  status: "success" | "failed" | "skipped";
  message: string;
}

/**
 * Main enhancer script for Phase 2
 * 1. Fetches all blogs from database
 * 2. For each blog, searches Google for similar articles
 * 3. Scrapes content from top 2 results
 * 4. Uses LLM to enhance the original article
 * 5. Saves the updated content and sources to database
 */
async function enhanceAllBlogs(): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];

  // Fetch all blogs that haven't been enhanced yet (or all for re-processing)
  const blogs = await Blog.find({});
  
  console.log(`\n📚 Found ${blogs.length} blogs to process\n`);
  console.log("=".repeat(60));

  for (const blog of blogs) {
    console.log(`\n🔄 Processing: "${blog.title}"`);
    console.log("-".repeat(50));

    try {
      // Skip if already enhanced (optional - remove if you want to re-process)
      if (blog.updatedContent && blog.updatedContent.length > 200) {
        console.log("  ⏭️  Already enhanced, skipping...");
        results.push({
          blogId: blog._id.toString(),
          title: blog.title,
          status: "skipped",
          message: "Already has updated content"
        });
        continue;
      }

      // Step 1: Search Google for similar articles
      console.log("  🔍 Searching Google for related articles...");
      let serpLinks: { title: string; link: string }[] = [];
      
      try {
        serpLinks = await serpSearch(blog.title);
        console.log(`  ✅ Found ${serpLinks.length} related articles`);
      } catch (error: any) {
        console.log(`  ⚠️  Search failed: ${error.message}`);
        results.push({
          blogId: blog._id.toString(),
          title: blog.title,
          status: "failed",
          message: `Google search failed: ${error.message}`
        });
        continue;
      }

      if (serpLinks.length === 0) {
        console.log("  ⚠️  No related articles found");
        results.push({
          blogId: blog._id.toString(),
          title: blog.title,
          status: "failed",
          message: "No related articles found on Google"
        });
        continue;
      }

      // Step 2: Scrape content from search results (try until we get 2 successful)
      console.log("  📄 Scraping reference articles (target: 2)...");
      const validScraped: { url: string; title: string; content: string; success: boolean }[] = [];
      
      for (const serpLink of serpLinks) {
        if (validScraped.length >= 2) break; // Stop once we have 2 successful scrapes
        
        console.log(`    Trying: ${serpLink.link}`);
        const scraped = await scrapeMultipleArticles([serpLink.link]);
        
        if (scraped[0]?.success) {
          validScraped.push(scraped[0]);
          console.log(`    ✓ Success (${validScraped.length}/2)`);
        } else {
          console.log(`    ✗ Failed (blocked or error)`);
        }
      }
      
      console.log(`  ✅ Successfully scraped ${validScraped.length}/2 target articles`);

      if (validScraped.length === 0) {
        console.log("  ⚠️  Could not scrape any reference articles");
        results.push({
          blogId: blog._id.toString(),
          title: blog.title,
          status: "failed",
          message: "Failed to scrape reference articles"
        });
        continue;
      }

      // Step 3: Enhance with LLM
      console.log("  🤖 Enhancing with LLM (gpt-4o-mini-2024-07-18)...");
      const enhanceResult = await enhanceArticleWithLLM(
        blog.title,
        blog.originalContent,
        validScraped.map(s => ({
          url: s.url,
          title: s.title,
          content: s.content
        }))
      );

      if (!enhanceResult.success) {
        console.log("  ⚠️  LLM enhancement failed");
        results.push({
          blogId: blog._id.toString(),
          title: blog.title,
          status: "failed",
          message: "LLM enhancement failed"
        });
        continue;
      }

      // Step 4: Save to database
      console.log("  💾 Saving enhanced content to database...");
      await Blog.findByIdAndUpdate(blog._id, {
        updatedContent: enhanceResult.updatedContent,
        sources: enhanceResult.sources,
        aiModel: "gpt-4o-mini",
        improvedAt: new Date(),
        improvementScore: 85 // Could be calculated based on content quality metrics
      });

      console.log("  ✅ Successfully enhanced and saved!");
      results.push({
        blogId: blog._id.toString(),
        title: blog.title,
        status: "success",
        message: `Enhanced with ${enhanceResult.sources.length} sources`
      });

    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      results.push({
        blogId: blog._id.toString(),
        title: blog.title,
        status: "failed",
        message: error.message
      });
    }

    // Small delay between processing each blog
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Print summary of processing results
 */
function printSummary(results: ProcessingResult[]): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 PROCESSING SUMMARY");
  console.log("=".repeat(60));
  
  const successCount = results.filter(r => r.status === "success").length;
  const failedCount = results.filter(r => r.status === "failed").length;
  const skippedCount = results.filter(r => r.status === "skipped").length;
  
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`⏭️  Skipped: ${skippedCount}`);
  console.log(`📚 Total: ${results.length}`);
  
  if (failedCount > 0) {
    console.log("\n📋 Failed Items:");
    results.filter(r => r.status === "failed").forEach(r => {
      console.log(`  - ${r.title}: ${r.message}`);
    });
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log("\n🚀 Phase 2: Article Enhancement Script");
  console.log("=====================================\n");

  // Connect to database
  console.log("📡 Connecting to database...");
  await dbConnect();
  console.log("✅ Database connected\n");

  // Check for required environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY is not set in .env");
    process.exit(1);
  }
  if (!process.env.SERP_API_KEY) {
    console.error("❌ Error: SERP_API_KEY is not set in .env");
    process.exit(1);
  }

  // Run the enhancer
  const results = await enhanceAllBlogs();
  
  // Print summary
  printSummary(results);
  
  console.log("\n✨ Enhancement process complete!\n");
  process.exit(0);
}

// Run the script
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});
