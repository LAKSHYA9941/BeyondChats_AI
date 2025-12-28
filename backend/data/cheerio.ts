import * as cheerio from 'cheerio';
import axios from 'axios';
import Blog from '../models/blog.model.js';
import dbConnect from '../lib/dbconn.js';

interface BlogPost {
    title: string;
    url: string;
    category: string;
    author: string;
    date: string;
    excerpt: string;
}

/**
 * Scrapes blog posts from BeyondChats website
 */
async function scrapeBlogPosts(): Promise<BlogPost[]> {
    try {
        console.log('🔍 Fetching blog page...');
        const response = await axios.get('https://beyondchats.com/blogs/');
        const html = response.data;
        
        const $ = cheerio.load(html);
        const blogPosts: BlogPost[] = [];
        
        // Extract each blog post
        $('article').each((i, el) => {
            const title = $(el).find('h2.entry-title').text().trim();
            const url = $(el).find('h2.entry-title a').attr('href') || '';
            const category = $(el).find('.meta-categories a').text().trim();
            const author = $(el).find('.meta-author a').text().trim();
            const date = $(el).find('time.ct-meta-element-date').text().trim() || 
                        $(el).find('.meta-date').text().trim();
            const excerpt = $(el).find('.entry-excerpt p').text().trim();
            
            if (title && url) {
                blogPosts.push({
                    title,
                    url,
                    category: category || 'Uncategorized',
                    author: author || 'Unknown',
                    date: date || 'No date available',
                    excerpt: excerpt || 'No excerpt available'
                });
            }
        });
        
        console.log(`✅ Found ${blogPosts.length} blog posts`);
        return blogPosts;
        
    } catch (error: any) {
        console.error('❌ Scraping Error:', error.message);
        throw error;
    }
}

/**
 * Fetches full content from individual blog post URL
 */
async function fetchBlogContent(url: string): Promise<string> {
    try {
        console.log(`  📄 Fetching content from: ${url}`);
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        // Try different selectors to find main content
        let content = '';
        
        // Common selectors for blog content
        const selectors = [
            'article .entry-content',
            '.post-content',
            '.article-content',
            'article',
            'main'
        ];
        
        for (const selector of selectors) {
            const element = $(selector);
            if (element.length > 0) {
                // Remove scripts, styles, and navigation elements
                element.find('script, style, nav, .comments, .related-posts').remove();
                content = element.text().trim();
                
                if (content.length > 100) { // Ensure we got substantial content
                    break;
                }
            }
        }
        
        return content || 'Content could not be extracted';
        
    } catch (error: any) {
        console.error(`  ❌ Error fetching content from ${url}:`, error.message);
        return 'Content fetch failed';
    }
}

/**
 * Gets the 5 oldest blog posts (from last page)
 * Note: This assumes chronological order on the page
 */
function getOldestBlogs(blogPosts: BlogPost[], count: number = 5): BlogPost[] {
    // Get the last 5 posts (oldest ones on the page)
    return blogPosts.slice(-count);
}

/**
 * Saves blog posts to MongoDB database
 */
async function saveBlogsToDatabase(blogPosts: BlogPost[]): Promise<void> {
    try {
        console.log(`\n Saving ${blogPosts.length} blogs to database...`);
        
        for (let i = 0; i < blogPosts.length; i++) {
            const post = blogPosts[i];
            
            // Check if blog already exists (by URL)
            const existingBlog = await Blog.findOne({ url: post.url });
            
            if (existingBlog) {
                console.log(`  Skipping (already exists): ${post.title}`);
                continue;
            }
            
            // Fetch full content from the blog post URL
            const originalContent = await fetchBlogContent(post.url);
            
            // Create new blog document
            const newBlog = new Blog({
                title: post.title,
                url: post.url,
                category: post.category,
                author: post.author,
                date: post.date,
                excerpt: post.excerpt,
                originalContent: originalContent,
                updatedContent: '', // Will be filled in Phase 2
                sources: [],
                aiModel: 'gpt-4.1',
                improvementScore: 0
            });
            
            await newBlog.save();
            console.log(`   Saved: ${post.title}`);
        }
        
        console.log('\n All blogs saved successfully!');
        
    } catch (error: any) {
        console.error(' Database Error:', error.message);
        throw error;
    }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    try {
        // Connect to database
        console.log(' Connecting to database...');
        await dbConnect();
        console.log(' Database connected\n');
        
        // Scrape blog posts
        const allBlogPosts = await scrapeBlogPosts();
        
        if (allBlogPosts.length === 0) {
            console.log(' No blog posts found');
            process.exit();
        }
        
        // Get oldest 5 blogs
        const oldestBlogs = getOldestBlogs(allBlogPosts, 5);
        console.log(`\n Selected ${oldestBlogs.length} oldest blogs:`);
        oldestBlogs.forEach((post, index) => {
            console.log(`  ${index + 1}. ${post.title}`);
        });
        
        // Save to database
        await saveBlogsToDatabase(oldestBlogs);
        
        // Exit successfully
        console.log('\n Script completed successfully!');
        process.exit(0);
        
    } catch (error: any) {
        console.error('\n Fatal Error:', error.message);
        process.exit(1);
    }
}

// Execute the script
main();