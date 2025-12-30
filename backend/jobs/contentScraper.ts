import axios from "axios";
import * as cheerio from "cheerio";

interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  success: boolean;
}

/**
 * Scrapes main content from a given URL
 * Uses multiple selectors to find article content across different site structures
 */
export async function scrapeArticleContent(url: string): Promise<ScrapedContent> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $("script, style, nav, footer, header, aside, .sidebar, .comments, .advertisement, .ad, .social-share, .related-posts, .newsletter").remove();

    // Try multiple content selectors in order of specificity
    const contentSelectors = [
      "article .content",
      "article .post-content",
      "article .entry-content",
      ".blog-content",
      ".post-body",
      ".article-body",
      ".entry-content",
      ".post-content",
      "article",
      "main .content",
      "main",
      ".content"
    ];

    let content = "";
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 200) break;
      }
    }

    // Fallback to body if no content found
    if (!content || content.length < 200) {
      content = $("body").text().trim();
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .trim()
      .slice(0, 8000); // Limit content length

    // Get title
    let title = $("h1").first().text().trim() || 
                $("title").text().trim() ||
                $('meta[property="og:title"]').attr("content") || 
                "";

    return {
      url,
      title,
      content,
      success: content.length > 100
    };

  } catch (error: any) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return {
      url,
      title: "",
      content: "",
      success: false
    };
  }
}

/**
 * Scrapes multiple URLs and returns their content
 */
export async function scrapeMultipleArticles(urls: string[]): Promise<ScrapedContent[]> {
  const results: ScrapedContent[] = [];
  
  for (const url of urls) {
    console.log(`  Scraping: ${url}`);
    const content = await scrapeArticleContent(url);
    results.push(content);
    
    // Small delay to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}
