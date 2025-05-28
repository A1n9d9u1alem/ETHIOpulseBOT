import cron from "node-cron"
import { getUsersWithSubscription, updateLastNotified } from "./database"
import { fetchNews, fetchMemes, fetchVideos, fetchWeather, fetchSports, fetchSocialMedia } from "./content"
import { sendMessage } from "./telegram"
import { translateText } from "./ai"

// Store active schedulers
const schedulers: { [key: string]: cron.ScheduledTask } = {}

// Schedule notification for a user
export async function scheduleNotification(userId: number, category: string, frequency: "daily" | "weekly") {
  try {
    // Define cron expression based on frequency
    let cronExpression = ""

    if (frequency === "daily") {
      // Run daily at 9:00 AM
      cronExpression = "0 9 * * *"
    } else if (frequency === "weekly") {
      // Run weekly on Monday at 9:00 AM
      cronExpression = "0 9 * * 1"
    }

    // Create a unique key for this user and category
    const schedulerKey = `${userId}_${category}_${frequency}`

    // Cancel existing scheduler if any
    if (schedulers[schedulerKey]) {
      schedulers[schedulerKey].stop()
      delete schedulers[schedulerKey]
    }

    // Schedule new task
    schedulers[schedulerKey] = cron.schedule(
      cronExpression,
      async () => {
        try {
          await sendScheduledContent(userId, category)
          await updateLastNotified(userId, category)
          console.log(`Sent scheduled ${category} content to user ${userId}`)
        } catch (error) {
          console.error(`Error sending scheduled ${category} content to user ${userId}:`, error)
        }
      },
      {
        scheduled: true,
        timezone: "Africa/Addis_Ababa",
      },
    )

    console.log(`Scheduled ${frequency} ${category} notifications for user ${userId}`)
    return true
  } catch (error) {
    console.error("Error scheduling notification:", error)
    return false
  }
}

// Send scheduled content based on category
async function sendScheduledContent(userId: number, category: string) {
  try {
    // Get user language preference
    const { getUserPreference } = await import("./database")
    const userPrefs = await getUserPreference(userId)
    const language = userPrefs?.language || "en"

    const notificationEmoji = "🔔"
    const categoryEmojis: { [key: string]: string } = {
      news: "📰",
      memes: "😂",
      videos: "🎬",
      weather: "☀️",
      sports: "⚽",
      social: "🔥",
    }

    const categoryEmoji = categoryEmojis[category] || "📱"

    switch (category) {
      case "news":
        const news = await fetchNews()
        let newsHeader =
          language === "am"
            ? `${notificationEmoji} *ዕለታዊ የዜና ዝማኔ* ${categoryEmoji}\n\n`
            : `${notificationEmoji} *Daily News Update* ${categoryEmoji}\n\n`

        for (const item of news.slice(0, 3)) {
          let title = item.title
          let description = item.description

          if (language === "am") {
            title = await translateText(title, "en", "am")
            description = await translateText(description, "en", "am")
          }

          newsHeader += `*${title}*\n${description}\n[${language === "am" ? "ተጨማሪ ያንብቡ" : "Read more"}](${item.url})\n\n`
        }

        await sendMessage(userId, newsHeader, { parse_mode: "Markdown", disable_web_page_preview: false })
        break

      case "memes":
        const memes = await fetchMemes()
        const memesHeader =
          language === "am"
            ? `${notificationEmoji} *ዕለታዊ ሚም ዝማኔ* ${categoryEmoji}`
            : `${notificationEmoji} *Daily Memes Update* ${categoryEmoji}`

        await sendMessage(userId, memesHeader, { parse_mode: "Markdown" })

        for (const meme of memes.slice(0, 2)) {
          let caption = meme.caption

          if (language === "am") {
            caption = await translateText(caption, "en", "am")
          }

          await sendMessage(userId, `😂 ${caption}\n\n[View Meme](${meme.imageUrl})`, {
            parse_mode: "Markdown",
            disable_web_page_preview: false,
          })
        }
        break

      case "videos":
        const videos = await fetchVideos()
        let videosHeader =
          language === "am"
            ? `${notificationEmoji} *ዕለታዊ ቪዲዮ ዝማኔ* ${categoryEmoji}\n\n`
            : `${notificationEmoji} *Daily Videos Update* ${categoryEmoji}\n\n`

        for (const video of videos.slice(0, 3)) {
          let title = video.title

          if (language === "am") {
            title = await translateText(title, "en", "am")
          }

          videosHeader += `*${title}*\n[${language === "am" ? "ቪዲዮ ይመልከቱ" : "Watch Video"}](${video.videoUrl})\n\n`
        }

        await sendMessage(userId, videosHeader, { parse_mode: "Markdown" })
        break

      case "weather":
        const weather = await fetchWeather("Addis Ababa")
        let weatherMessage = ""

        if (language === "am") {
          weatherMessage = `${notificationEmoji} *ዕለታዊ የአየር ሁኔታ ዝማኔ* ${categoryEmoji}\n\n🌡️ ሙቀት: ${weather.temperature}°C\n🌤️ ሁኔታ: ${await translateText(weather.condition, "en", "am")}\n💧 እርጥበት: ${weather.humidity}%\n💨 የነፋስ ፍጥነት: ${weather.windSpeed} km/h`
        } else {
          weatherMessage = `${notificationEmoji} *Daily Weather Update* ${categoryEmoji}\n\n🌡️ Temperature: ${weather.temperature}°C\n🌤️ Condition: ${weather.condition}\n💧 Humidity: ${weather.humidity}%\n💨 Wind Speed: ${weather.windSpeed} km/h`
        }

        await sendMessage(userId, weatherMessage, { parse_mode: "Markdown" })
        break

      case "sports":
        const sports = await fetchSports()
        let sportsHeader =
          language === "am"
            ? `${notificationEmoji} *ዕለታዊ የስፖርት ዝማኔ* ${categoryEmoji}\n\n`
            : `${notificationEmoji} *Daily Sports Update* ${categoryEmoji}\n\n`

        for (const item of sports.slice(0, 3)) {
          let title = item.title
          let description = item.description

          if (language === "am") {
            title = await translateText(title, "en", "am")
            description = await translateText(description, "en", "am")
          }

          sportsHeader += `*${title}*\n${description}\n\n`
        }

        await sendMessage(userId, sportsHeader, { parse_mode: "Markdown" })
        break

      case "social":
        const trends = await fetchSocialMedia()
        let trendsHeader =
          language === "am"
            ? `${notificationEmoji} *ዕለታዊ የማህበራዊ ሚዲያ ትረንድ ዝማኔ* ${categoryEmoji}\n\n`
            : `${notificationEmoji} *Daily Social Media Trends Update* ${categoryEmoji}\n\n`

        for (const trend of trends.slice(0, 5)) {
          let topic = trend.topic

          if (language === "am") {
            topic = await translateText(topic, "en", "am")
          }

          trendsHeader += `• ${topic} (${trend.count})\n`
        }

        await sendMessage(userId, trendsHeader, { parse_mode: "Markdown" })
        break

      default:
        const defaultMessage =
          language === "am"
            ? `${notificationEmoji} ዕለታዊ ዝማኔ ለ ${category} ይዘት አይገኝም።`
            : `${notificationEmoji} Daily update for ${category} content is not available.`
        await sendMessage(userId, defaultMessage)
    }
  } catch (error) {
    console.error(`Error sending scheduled ${category} content:`, error)
  }
}

// Initialize all schedulers on startup
export async function initializeSchedulers() {
  try {
    console.log("Initializing schedulers...")

    const categories = ["news", "memes", "videos", "weather", "sports", "social"]
    const frequencies: ("daily" | "weekly")[] = ["daily", "weekly"]

    for (const category of categories) {
      for (const frequency of frequencies) {
        try {
          const users = await getUsersWithSubscription(category, frequency)

          for (const { userId } of users) {
            await scheduleNotification(userId, category, frequency)
          }

          console.log(`Initialized ${frequency} ${category} schedulers for ${users.length} users`)
        } catch (error) {
          console.error(`Error initializing ${frequency} ${category} schedulers:`, error)
        }
      }
    }

    console.log("All schedulers initialized successfully")
  } catch (error) {
    console.error("Error initializing schedulers:", error)
  }
}

// Stop all schedulers
export function stopAllSchedulers() {
  Object.values(schedulers).forEach((scheduler) => {
    scheduler.stop()
  })
  console.log("All schedulers stopped")
}

// Get scheduler status
export function getSchedulerStatus() {
  const activeSchedulers = Object.keys(schedulers).length
  return {
    active: activeSchedulers,
    schedulers: Object.keys(schedulers),
  }
}
