import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("=== WEBHOOK TRIGGERED ===")

    const update = await request.json()
    console.log("Raw update:", JSON.stringify(update, null, 2))

    // Check if we have a message
    if (!update.message || !update.message.text) {
      console.log("No message or text found")
      return NextResponse.json({ success: true })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const userId = update.message.from.id

    console.log(`Message from user ${userId} in chat ${chatId}: "${text}"`)

    // Check if bot token exists
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.error("❌ TELEGRAM_BOT_TOKEN not found!")
      return NextResponse.json({ error: "Bot token missing" }, { status: 500 })
    }

    console.log("✅ Bot token found, sending response...")

    // Send a simple response
    let responseText = ""

    if (text === "/start") {
      responseText = "🇪🇹 Welcome to EthioPulseBot! I'm working! Try /help for commands."
    } else if (text === "/help") {
      responseText = "Available commands:\n/start - Start the bot\n/help - Show this help\n/test - Test response"
    } else if (text === "/test") {
      responseText = "✅ Test successful! The bot is responding correctly."
    } else {
      responseText = `I received your message: "${text}"`
    }

    // Send message using direct API call
    const telegramResponse = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
      }),
    })

    const telegramResult = await telegramResponse.json()
    console.log("Telegram API response:", JSON.stringify(telegramResult, null, 2))

    if (!telegramResult.ok) {
      console.error("❌ Telegram API error:", telegramResult.description)
      return NextResponse.json({ error: telegramResult.description }, { status: 500 })
    }

    console.log("✅ Message sent successfully!")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error in webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "EthioPulseBot webhook is active",
    timestamp: new Date().toISOString(),
    botConfigured: !!process.env.TELEGRAM_BOT_TOKEN,
  })
}
