import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Translate text from one language to another
export async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  try {
    // Skip translation if text is too short or already in target language
    if (!text || text.length < 3) {
      return text
    }

    const { text: translatedText } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Translate the following text from ${fromLang === "en" ? "English" : "Amharic"} to ${toLang === "am" ? "Amharic" : "English"}. Only return the translation, no explanations:\n\n${text}`,
      system:
        "You are a professional translator specializing in English and Amharic. Provide accurate, natural translations that preserve the original meaning and tone.",
    })

    return translatedText.trim()
  } catch (error) {
    console.error("Error translating text:", error)
    return text // Return original text if translation fails
  }
}

// Summarize content
export async function summarizeContent(content: string, maxLength = 200): Promise<string> {
  try {
    if (!content || content.length <= maxLength) {
      return content
    }

    const { text: summary } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Summarize the following content in ${maxLength} characters or less. Keep the key information and make it engaging:\n\n${content}`,
      system:
        "You are a professional content summarizer. Create concise, informative summaries that capture the essence of the original content.",
    })

    return summary.trim()
  } catch (error) {
    console.error("Error summarizing content:", error)

    // Simple fallback summarization
    if (content.length <= maxLength) {
      return content
    }
    return content.substring(0, maxLength - 3) + "..."
  }
}

// Generate personalized content recommendations
export async function generateRecommendations(userId: number, preferences: any): Promise<string[]> {
  try {
    const preferencesStr = JSON.stringify(preferences)

    const { text: recommendationsText } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Based on these user preferences: ${preferencesStr}\n\nGenerate 5 personalized Ethiopian content recommendations. Focus on trending topics, cultural events, news, and entertainment that would interest this user. Return as a numbered list.`,
      system:
        "You are a content recommendation system specializing in Ethiopian culture, news, and entertainment. Provide relevant, engaging, and culturally appropriate recommendations.",
    })

    // Parse the recommendations from the response
    const recommendations = recommendationsText
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((rec) => rec.length > 0)

    return recommendations.slice(0, 5)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return [
      "Latest news from Addis Ababa",
      "Ethiopian Premier League updates",
      "Traditional Ethiopian recipes",
      "Ethiopian music playlist",
      "Travel destinations in Ethiopia",
    ]
  }
}

// Detect content category from user message
export async function detectContentCategory(message: string): Promise<string> {
  try {
    const { text: category } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Analyze this user message and determine what type of content they're asking for. Return only one word from: news, memes, videos, weather, sports, social, general\n\nMessage: "${message}"`,
      system:
        "You are a content categorization system. Analyze user messages and return the most appropriate content category.",
    })

    const validCategories = ["news", "memes", "videos", "weather", "sports", "social"]
    const detectedCategory = category.trim().toLowerCase()

    return validCategories.includes(detectedCategory) ? detectedCategory : "general"
  } catch (error) {
    console.error("Error detecting content category:", error)
    return "general"
  }
}
