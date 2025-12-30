import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface ReferenceArticle {
  url: string;
  title: string;
  content: string;
}

interface EnhancedArticleResult {
  updatedContent: string;
  sources: string[];
  success: boolean;
}

/**
 * Uses OpenAI gpt-4o-mini to enhance the original article based on reference articles
 * The enhanced article will have improved formatting and content while maintaining the original meaning
 */
export async function enhanceArticleWithLLM(
  originalTitle: string,
  originalContent: string,
  referenceArticles: ReferenceArticle[]
): Promise<EnhancedArticleResult> {
  
  const validReferences = referenceArticles.filter(r => r.content.length > 100);
  
  if (validReferences.length === 0) {
    console.log("  No valid reference articles to enhance with");
    return {
      updatedContent: "",
      sources: [],
      success: false
    };
  }

  const referenceSummaries = validReferences.map((ref, idx) => `
--- Reference Article ${idx + 1} ---
Title: ${ref.title}
URL: ${ref.url}
Content:
${ref.content.slice(0, 3000)}
`).join("\n");

  const systemPrompt = `You are an expert content editor and SEO specialist. Your task is to improve and enhance blog articles based on successful reference articles that rank well on Google.

Your goals:
1. Improve the structure and formatting of the original article
2. Add relevant details and insights inspired by the reference articles
3. Maintain the original article's core message and facts
4. Make the content more engaging and readable
5. Use proper headings, paragraphs, and formatting
6. Ensure the content is original and not plagiarized

Output format:
- Use markdown formatting
- Include an engaging introduction
- Use H2 and H3 headings appropriately
- Add bullet points or numbered lists where relevant
- Include a conclusion section
- At the end, add a "References" section listing the source URLs`;

  const userPrompt = `Please enhance this article based on the reference articles that rank well on Google for similar topics.

=== ORIGINAL ARTICLE ===
Title: ${originalTitle}

Content:
${originalContent}

=== REFERENCE ARTICLES (TOP GOOGLE RESULTS) ===
${referenceSummaries}

Please rewrite and enhance the original article, making it more comprehensive and well-formatted while maintaining its core message. Include proper markdown formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.7
    });

    const enhancedContent = response.choices[0]?.message?.content || "";
    
    if (!enhancedContent || enhancedContent.length < 100) {
      return {
        updatedContent: "",
        sources: [],
        success: false
      };
    }

    // Append references section if not already present
    let finalContent = enhancedContent;
    if (!finalContent.toLowerCase().includes("## references") && !finalContent.toLowerCase().includes("### references")) {
      finalContent += "\n\n## References\n\n";
      validReferences.forEach((ref, idx) => {
        finalContent += `${idx + 1}. [${ref.title}](${ref.url})\n`;
      });
    }

    return {
      updatedContent: finalContent,
      sources: validReferences.map(r => r.url),
      success: true
    };

  } catch (error: any) {
    console.error("LLM API Error:", error.message);
    return {
      updatedContent: "",
      sources: [],
      success: false
    };
  }
}


