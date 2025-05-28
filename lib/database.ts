import { neon } from "@neondatabase/serverless"

// Initialize Neon client
const sql = neon(process.env.NEON_DATABASE_URL!)

// User preference type
export type UserPreference = {
  language: "en" | "am"
  subscriptions?: {
    [key: string]: "daily" | "weekly"
  }
  lastNotified?: {
    [key: string]: string // ISO date string
  }
}

// Save or update user in database
export async function saveUser(telegramId: number, username?: string, firstName?: string, lastName?: string) {
  try {
    await sql`
      INSERT INTO users (telegram_id, username, first_name, last_name)
      VALUES (${telegramId}, ${username || null}, ${firstName || null}, ${lastName || null})
      ON CONFLICT (telegram_id) 
      DO UPDATE SET 
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name
    `
    return true
  } catch (error) {
    console.error("Error saving user:", error)
    throw error
  }
}

// Save user preference
export async function saveUserPreference(userId: number, language: "en" | "am") {
  try {
    await sql`
      INSERT INTO user_preferences (user_id, language)
      VALUES (${userId}, ${language})
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        language = EXCLUDED.language,
        updated_at = CURRENT_TIMESTAMP
    `
    return true
  } catch (error) {
    console.error("Error saving user preference:", error)
    throw error
  }
}

// Get user preference
export async function getUserPreference(userId: number): Promise<UserPreference | null> {
  try {
    const result = await sql`
      SELECT language FROM user_preferences 
      WHERE user_id = ${userId}
    `

    if (result.length === 0) {
      return {
        language: "en",
        subscriptions: {},
      }
    }

    // Get subscriptions
    const subscriptions = await sql`
      SELECT cc.name, s.frequency 
      FROM subscriptions s
      JOIN content_categories cc ON s.category_id = cc.id
      WHERE s.user_id = ${userId}
    `

    const subscriptionMap: { [key: string]: "daily" | "weekly" } = {}
    subscriptions.forEach((sub: any) => {
      subscriptionMap[sub.name] = sub.frequency
    })

    return {
      language: result[0].language as "en" | "am",
      subscriptions: subscriptionMap,
    }
  } catch (error) {
    console.error("Error getting user preference:", error)
    return {
      language: "en",
      subscriptions: {},
    }
  }
}

// Save user subscription
export async function saveUserSubscription(userId: number, category: string, frequency: "daily" | "weekly") {
  try {
    // First, ensure the category exists
    await sql`
      INSERT INTO content_categories (name, description)
      VALUES (${category}, ${`${category} content category`})
      ON CONFLICT (name) DO NOTHING
    `

    // Get category ID
    const categoryResult = await sql`
      SELECT id FROM content_categories WHERE name = ${category}
    `

    if (categoryResult.length === 0) {
      throw new Error(`Category ${category} not found`)
    }

    const categoryId = categoryResult[0].id

    // Save subscription
    await sql`
      INSERT INTO subscriptions (user_id, category_id, frequency)
      VALUES (${userId}, ${categoryId}, ${frequency})
      ON CONFLICT (user_id, category_id) 
      DO UPDATE SET 
        frequency = EXCLUDED.frequency,
        updated_at = CURRENT_TIMESTAMP
    `

    return true
  } catch (error) {
    console.error("Error saving user subscription:", error)
    throw error
  }
}

// Get users with specific subscription
export async function getUsersWithSubscription(
  category: string,
  frequency: "daily" | "weekly",
): Promise<{ userId: number; language: string }[]> {
  try {
    const result = await sql`
      SELECT s.user_id, COALESCE(up.language, 'en') as language
      FROM subscriptions s
      JOIN content_categories cc ON s.category_id = cc.id
      LEFT JOIN user_preferences up ON s.user_id = up.user_id
      WHERE cc.name = ${category} AND s.frequency = ${frequency}
    `

    return result.map((row: any) => ({
      userId: row.user_id,
      language: row.language,
    }))
  } catch (error) {
    console.error("Error getting users with subscription:", error)
    throw error
  }
}

// Update last notified timestamp
export async function updateLastNotified(userId: number, category: string) {
  try {
    await sql`
      UPDATE subscriptions 
      SET last_sent_at = CURRENT_TIMESTAMP
      FROM content_categories cc
      WHERE subscriptions.category_id = cc.id 
        AND subscriptions.user_id = ${userId} 
        AND cc.name = ${category}
    `
    return true
  } catch (error) {
    console.error("Error updating last notified:", error)
    throw error
  }
}

// Log user interaction
export async function logUserInteraction(userId: number, command: string, contentCategory?: string) {
  try {
    await sql`
      INSERT INTO user_interactions (user_id, command, content_category)
      VALUES (${userId}, ${command}, ${contentCategory || null})
    `
    return true
  } catch (error) {
    console.error("Error logging user interaction:", error)
    // Don't throw error for logging failures
    return false
  }
}
