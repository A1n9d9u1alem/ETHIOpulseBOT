import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Webhook received!")

    const body = await request.json()
    console.log("📨 Update received:", JSON.stringify(body, null, 2))

    // Extract message info
    const message = body?.message
    if (!message) {
      console.log("❌ No message found")
      return NextResponse.json({ ok: true })
    }

    const chatId = message.chat.id
    const text = message.text || ""
    const messageId = message.message_id

    console.log(`💬 Message: "${text}" from chat ${chatId}`)

    // Check bot token
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error("❌ No bot token found!")
      return NextResponse.json({ error: "No bot token" }, { status: 500 })
    }

    // Prepare response
    let responseText = ""

    if (text.startsWith("/start")) {
      responseText =
        "🇪🇹 Hello! I'm EthioInfoBot and I'm working! 🎉\n\nTry these commands:\n/help - Show help\n/news - Get news\n/weather - Get weather"
    } else if (text.startsWith("/help")) {
      responseText =
        "📋 Available commands:\n\n/start - Start the bot\n/help - Show this help\n/news - Get Ethiopian news\n/weather - Get weather info\n/test - Test the bot"
    } else if (text.startsWith("/news")) {
      responseText =
        "📰 Latest Ethiopian News:\n\n• Ethiopia announces new economic reforms\n• Ethiopian Airlines expands to new destinations\n• Coffee export reaches record high\n\nMore news coming soon!"
    } else if (text.startsWith("/weather")) {
      responseText =
        "☀️ Weather in Addis Ababa:\n\n🌡️ Temperature: 22°C\n🌤️ Condition: Partly cloudy\n💧 Humidity: 65%\n💨 Wind: 8 km/h"
    } else if (text.startsWith("/test")) {
      responseText = "✅ Test successful! The bot is working perfectly! 🚀"
    } else {
      responseText = `I received your message: "${text}"\n\nTry /help to see available commands!`
    }

    console.log(`📤 Sending response: "${responseText}"`)

    // Send response using fetch
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
        reply_to_message_id: messageId,
      }),
    })

    const result = await response.json()
    console.log("📬 Telegram response:", JSON.stringify(result, null, 2))

    if (result.ok) {
      console.log("✅ Message sent successfully!")
    } else {
      console.error("❌ Failed to send message:", result.description)
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("💥 Error in webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Webhook is running",
    timestamp: new Date().toISOString(),
  })
}
