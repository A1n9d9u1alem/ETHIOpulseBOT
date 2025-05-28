import TelegramBot from "node-telegram-bot-api"
import { saveUser, saveUserPreference, getUserPreference, saveUserSubscription, logUserInteraction } from "./database"
import { fetchNews, fetchMemes, fetchVideos, fetchWeather, fetchSports, fetchSocialMedia } from "./content"
import { translateText } from "./ai"
import { scheduleNotification } from "./scheduler"
import fetch from "node-fetch"

// Initialize bot with token from environment variables
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", { polling: false })

// Process incoming updates from Telegram
export async function processUpdate(update: any) {
  if (!update.message) return

  const { message } = update
  const chatId = message.chat.id
  const text = message.text || ""
  const user = message.from

  // Save user to database
  if (user) {
    await saveUser(user.id, user.username, user.first_name, user.last_name)
  }

  // Process commands
  if (text.startsWith("/")) {
    await handleCommand(chatId, text, user)
  } else {
    // Process natural language queries
    await handleNaturalLanguage(chatId, text, user)
  }
}

// Handle bot commands
async function handleCommand(chatId: number, command: string, user: any) {
  const cmd = command.split(" ")[0].toLowerCase()
  const args = command.split(" ").slice(1).join(" ")

  // Log interaction
  await logUserInteraction(user.id, cmd)

  switch (cmd) {
    case "/start":
      await sendWelcomeMessage(chatId)
      break
    case "/news":
      await sendNews(chatId, args, user.id)
      break
    case "/memes":
      await sendMemes(chatId, user.id)
      break
    case "/videos":
      await sendVideos(chatId, args, user.id)
      break
    case "/weather":
      await sendWeather(chatId, args, user.id)
      break
    case "/sports":
      await sendSports(chatId, args, user.id)
      break
    case "/social":
      await sendSocialMedia(chatId, user.id)
      break
    case "/subscribe":
      await handleSubscription(chatId, args, user)
      break
    case "/language":
      await setLanguage(chatId, args, user)
      break
    case "/help":
      await sendHelpMessage(chatId, user.id)
      break
    default:
      const userPrefs = await getUserPreference(user.id)
      const language = userPrefs?.language || "en"
      const message =
        language === "am" ? "ትዕዛዝ አልተገነዘበም። /help ይጠቀሙ።" : "Command not recognized. Type /help for available commands."
      await sendMessage(chatId, message)
  }
}

// Handle natural language queries using AI
async function handleNaturalLanguage(chatId: number, text: string, user: any) {
  const userPrefs = await getUserPreference(user.id)
  const language = userPrefs?.language || "en"

  // Log interaction
  await logUserInteraction(user.id, "natural_language", "general")

  // Detect if user is asking for content
  if (text.toLowerCase().includes("news") || text.toLowerCase().includes("ዜና")) {
    await sendNews(chatId, "", user.id)
  } else if (text.toLowerCase().includes("weather") || text.toLowerCase().includes("አየር ንብረት")) {
    await sendWeather(chatId, "", user.id)
  } else if (text.toLowerCase().includes("meme") || text.toLowerCase().includes("ሚም")) {
    await sendMemes(chatId, user.id)
  } else if (text.toLowerCase().includes("sport") || text.toLowerCase().includes("ስፖርት")) {
    await sendSports(chatId, "", user.id)
  } else {
    // Respond with a helpful message
    const response =
      language === "am"
        ? "እባክዎ የሚፈልጉትን ይጠይቁ ወይም /help ይጠቀሙ።"
        : "Please ask for specific content or use /help to see available commands."
    await sendMessage(chatId, response)
  }
}

// Send welcome message
async function sendWelcomeMessage(chatId: number) {
  const message = `
🇪🇹 *Welcome to EthioPulseBot!* 👋

I deliver trending Ethiopian and global content including news, memes, videos, weather updates, sports, and social media highlights.

*Available Commands:*
/news - Get latest news 📰
/memes - View trending memes 😂
/videos - Watch popular videos 🎬
/weather [city] - Check weather ☀️
/sports - Get sports updates ⚽
/social - See social media trends 🔥
/subscribe [category] [frequency] - Subscribe to updates 🔔
/language [en|am] - Set your language 🌐
/help - Show this help message ❓

You can also ask me in natural language for any content you want!

*Example:* "Show me Ethiopian news" or "What's the weather in Addis Ababa?"
`
  await sendMessage(chatId, message, { parse_mode: "Markdown" })
}

// Send news updates
async function sendNews(chatId: number, category = "", userId: number) {
  try {
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    await logUserInteraction(userId, "/news", "news")

    await sendMessage(chatId, language === "am" ? "ዜናዎችን በማምጣት ላይ..." : "Fetching news...")

    const news = await fetchNews(category)

    // Translate if needed
    let formattedNews = language === "am" ? "📰 *የቅርብ ጊዜ ዜናዎች*\n\n" : "📰 *Latest News*\n\n"

    for (const item of news.slice(0, 5)) {
      let title = item.title
      let description = item.description

      if (language === "am") {
        title = await translateText(title, "en", "am")
        description = await translateText(description, "en", "am")
      }

      formattedNews += `*${title}*\n${description}\n[${language === "am" ? "ተጨማሪ ያንብቡ" : "Read more"}](${item.url})\n\n`
    }

    await sendMessage(chatId, formattedNews || (language === "am" ? "ምንም ዜና አልተገኘም" : "No news found"), {
      parse_mode: "Markdown",
      disable_web_page_preview: false,
    })
  } catch (error) {
    console.error("Error sending news:", error)
    await sendMessage(chatId, "Sorry, there was an error fetching news. Please try again later.")
  }
}

// Send memes
async function sendMemes(chatId: number, userId: number) {
  try {
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    await logUserInteraction(userId, "/memes", "memes")

    await sendMessage(chatId, language === "am" ? "ሚሞችን በማምጣት ላይ..." : "Fetching memes...")

    const memes = await fetchMemes()

    // Send up to 3 memes
    for (const meme of memes.slice(0, 3)) {
      let caption = meme.caption

      if (language === "am") {
        caption = await translateText(caption, "en", "am")
      }

      // For now, send as text with image URL since we're using mock data
      await sendMessage(chatId, `😂 ${caption}\n\n[View Meme](${meme.imageUrl})`, {
        parse_mode: "Markdown",
        disable_web_page_preview: false,
      })
    }
  } catch (error) {
    console.error("Error sending memes:", error)
    await sendMessage(chatId, "Sorry, there was an error fetching memes. Please try again later.")
  }
}

// Send videos
async function sendVideos(chatId: number, category = "", userId: number) {
  try {
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    await logUserInteraction(userId, "/videos", "videos")

    await sendMessage(chatId, language === "am" ? "ቪዲዮዎችን በማምጣት ላይ..." : "Fetching videos...")

    const videos = await fetchVideos(category)

    let formattedVideos = language === "am" ? "🎬 *ተወዳጅ ቪዲዮዎች*\n\n" : "🎬 *Popular Videos*\n\n"

    // Send up to 3 videos
    for (const video of videos.slice(0, 3)) {
      let title = video.title

      if (language === "am") {
        title = await translateText(title, "en", "am")
      }

      formattedVideos += `*${title}*\n[${language === "am" ? "ቪዲዮ ይመልከቱ" : "Watch Video"}](${video.videoUrl})\n\n`
    }

    await sendMessage(chatId, formattedVideos, { parse_mode: "Markdown" })
  } catch (error) {
    console.error("Error sending videos:", error)
    await sendMessage(chatId, "Sorry, there was an error fetching videos. Please try again later.")
  }
}

// Send weather updates
async function sendWeather(chatId: number, city = "Addis Ababa", userId: number) {
  try {
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    await logUserInteraction(userId, "/weather", "weather")

    await sendMessage(chatId, language === "am" ? "የአየር ሁኔታን በማምጣት ላይ..." : "Fetching weather...")

    const weather = await fetchWeather(city)

    let message = ""
    if (language === "am") {
      const cityAm = await translateText(city || "Addis Ababa", "en", "am")
      message = `☀️ *${cityAm} የአየር ሁኔታ*\n\n🌡️ ሙቀት: ${weather.temperature}°C\n🌤️ ሁኔታ: ${await translateText(weather.condition, "en", "am")}\n💧 እርጥበት: ${weather.humidity}%\n💨 የነፋስ ፍጥነት: ${weather.windSpeed} km/h`
    } else {
      message = `☀️ *Weather in ${city || "Addis Ababa"}*\n\n🌡️ Temperature: ${weather.temperature}°C\n🌤️ Condition: ${weather.condition}\n💧 Humidity: ${weather.humidity}%\n💨 Wind Speed: ${weather.windSpeed} km/h`
    }

    await sendMessage(chatId, message, { parse_mode: "Markdown" })
  } catch (error) {
    console.error("Error sending weather:", error)
    await sendMessage(chatId, "Sorry, there was an error fetching weather. Please try again later.")
  }
}

// Send sports updates
async function sendSports(chatId: number, category = "", userId: number) {
  try {
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    await logUserInteraction(userId, "/sports", "sports")

    await sendMessage(chatId, language === "am" ? "የስፖርት ዜናዎችን በማምጣት ላይ..." : "Fetching sports updates...")

    const sports = await fetchSports(category)

    let formattedSports = language === "am" ? "⚽ *የስፖርት ዜናዎች*\n\n" : "⚽ *Sports Updates*\n\n"

    for (const item of sports.slice(0, 5)) {
      let title = item.title
      let description = item.description

      if (language === "am") {
        title = await translateText(title, "en", "am")
        description = await translateText(description, "en", "am")
      }

      formattedSports += `*${title}*\n${description}\n\n`
    }

    await sendMessage(
      chatId,
      formattedSports || (language === "am" ? "ምንም የስፖርት ዜና አልተገኘም" : "No sports updates found"),
      {
        parse_mode: "Markdown",
      },
    )
  } catch (error) {
    console.error("Error sending sports updates:", error)
    await sendMessage(chatId, "Sorry, there was an error fetching sports updates. Please try again later.")
  }
}

// Send social media trends
async function sendSocialMedia(chatId: number, userId: number) {
  try {
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    await logUserInteraction(userId, "/social", "social")

    await sendMessage(chatId, language === "am" ? "ማህበራዊ ሚዲያ ትረንዶችን በማምጣት ላይ..." : "Fetching social media trends...")

    const trends = await fetchSocialMedia()

    let formattedTrends = language === "am" ? "🔥 *የማህበራዊ ሚዲያ ትረንዶች*\n\n" : "🔥 *Social Media Trends*\n\n"

    for (const trend of trends.slice(0, 10)) {
      let topic = trend.topic

      if (language === "am") {
        topic = await translateText(topic, "en", "am")
      }

      formattedTrends += `• ${topic} (${trend.count})\n`
    }

    await sendMessage(chatId, formattedTrends, { parse_mode: "Markdown" })
  } catch (error) {
    console.error("Error sending social media trends:", error)
    await sendMessage(chatId, "Sorry, there was an error fetching social media trends. Please try again later.")
  }
}

// Handle subscription to content categories
async function handleSubscription(chatId: number, args: string, user: any) {
  try {
    const userPrefs = await getUserPreference(user.id)
    const language = userPrefs?.language || "en"

    const parts = args.split(" ")
    if (parts.length < 2) {
      const message =
        language === "am"
          ? "እባክዎ ትክክለኛ ቅርጸት ይጠቀሙ: /subscribe [category] [daily|weekly]\n\nምሳሌ: /subscribe news daily"
          : "Please use the correct format: /subscribe [category] [daily|weekly]\n\nExample: /subscribe news daily"
      await sendMessage(chatId, message)
      return
    }

    const category = parts[0].toLowerCase()
    const frequency = parts[1].toLowerCase()

    // Validate category and frequency
    const validCategories = ["news", "memes", "videos", "weather", "sports", "social"]
    const validFrequencies = ["daily", "weekly"]

    if (!validCategories.includes(category)) {
      const message =
        language === "am"
          ? `ልክ ያልሆነ ምድብ። እባክዎ ከሚከተሉት ይምረጡ: ${validCategories.join(", ")}`
          : `Invalid category. Please choose from: ${validCategories.join(", ")}`
      await sendMessage(chatId, message)
      return
    }

    if (!validFrequencies.includes(frequency)) {
      const message =
        language === "am"
          ? `ልክ ያልሆነ ድግግሞሽ። እባክዎ ከሚከተሉት ይምረጡ: ${validFrequencies.join(", ")}`
          : `Invalid frequency. Please choose from: ${validFrequencies.join(", ")}`
      await sendMessage(chatId, message)
      return
    }

    // Save subscription preference
    await saveUserSubscription(user.id, category, frequency as "daily" | "weekly")

    // Schedule notification
    await scheduleNotification(user.id, category, frequency as "daily" | "weekly")

    const message =
      language === "am"
        ? `✅ ለ${await translateText(category, "en", "am")} ${frequency === "daily" ? "ዕለታዊ" : "ሳምንታዊ"} ማሳወቂያዎች ተመዝግበዋል።`
        : `✅ You've been subscribed to ${frequency} ${category} updates.`
    await sendMessage(chatId, message)
  } catch (error) {
    console.error("Error handling subscription:", error)
    await sendMessage(chatId, "Sorry, there was an error processing your subscription. Please try again later.")
  }
}

// Set user language preference
async function setLanguage(chatId: number, language: string, user: any) {
  try {
    language = language.trim().toLowerCase()

    if (language !== "en" && language !== "am") {
      await sendMessage(chatId, 'Please specify either "en" for English or "am" for Amharic.\n\nExample: /language am')
      return
    }

    await saveUserPreference(user.id, language as "en" | "am")

    const message =
      language === "am" ? "✅ የቋንቋ ምርጫዎ ወደ አማርኛ ተቀይሯል።" : "✅ Your language preference has been set to English."
    await sendMessage(chatId, message)
  } catch (error) {
    console.error("Error setting language:", error)
    await sendMessage(chatId, "Sorry, there was an error setting your language preference. Please try again later.")
  }
}

// Send help message
async function sendHelpMessage(chatId: number, userId: number) {
  const userPrefs = await getUserPreference(userId)
  const language = userPrefs?.language || "en"

  const message =
    language === "am"
      ? `
🇪🇹 *የEthioPulseBot ትዕዛዞች*

📰 /news - የቅርብ ጊዜ ዜናዎችን ያግኙ
😂 /memes - ተወዳጅ ሚሞችን ይመልከቱ
🎬 /videos - ተወዳጅ ቪዲዮዎችን ይመልከቱ
☀️ /weather [ከተማ] - የአየር ሁኔታን ይመልከቱ
⚽ /sports - የስፖርት ዜናዎችን ያግኙ
🔥 /social - የማህበራዊ ሚዲያ ትረንዶችን ይመልከቱ
🔔 /subscribe [ምድብ] [daily|weekly] - ለዝማኔዎች ይመዝገቡ
🌐 /language [en|am] - የቋንቋ ምርጫዎን ያቀናብሩ
❓ /help - ይህን የእገዛ መልዕክት ያሳይ

*ምሳሌዎች:*
• "የኢትዮጵያ ዜና አሳየኝ"
• "በአዲስ አበባ የአየር ሁኔታ ምንድን ነው?"

ለማንኛውም ይዘት በተፈጥሮ ቋንቋ መጠየቅ ይችላሉ!
`
      : `
🇪🇹 *EthioPulseBot Commands*

📰 /news - Get latest news
😂 /memes - View trending memes
🎬 /videos - Watch popular videos
☀️ /weather [city] - Check weather
⚽ /sports - Get sports updates
🔥 /social - See social media trends
🔔 /subscribe [category] [daily|weekly] - Subscribe to updates
🌐 /language [en|am] - Set your language
❓ /help - Show this help message

*Examples:*
• "Show me Ethiopian news"
• "What's the weather in Addis Ababa?"

You can also ask in natural language for any content you want!
`

  await sendMessage(chatId, message, { parse_mode: "Markdown" })
}

// Send message to Telegram
export async function sendMessage(chatId: number, text: string, options = {}) {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error("TELEGRAM_BOT_TOKEN is not set")
      throw new Error("Bot token not configured")
    }

    // Use direct API call instead of the bot instance
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        ...options,
      }),
    })

    const result = await response.json()
    console.log("Message sent response:", JSON.stringify(result, null, 2))

    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`)
    }

    return result
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

// Set webhook for production
export async function setWebhook(url: string) {
  return bot.setWebHook(url)
}
