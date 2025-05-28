import { NextResponse } from "next/server"
import { setWebhook } from "@/lib/telegram"

// Setup webhook endpoint
export async function POST(request: Request) {
  try {
    const { webhookUrl } = await request.json()

    if (!webhookUrl) {
      return NextResponse.json({ error: "Webhook URL is required" }, { status: 400 })
    }

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 })
    }

    await setWebhook(webhookUrl)

    return NextResponse.json({
      success: true,
      message: "Webhook set successfully",
      webhookUrl,
    })
  } catch (error) {
    console.error("Error setting webhook:", error)
    return NextResponse.json({ error: "Failed to set webhook" }, { status: 500 })
  }
}

// Get webhook info
export async function GET() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 })
    }

    // You can add webhook info retrieval here if needed
    return NextResponse.json({
      status: "Webhook setup endpoint is active",
      botConfigured: !!process.env.TELEGRAM_BOT_TOKEN,
    })
  } catch (error) {
    console.error("Error getting webhook info:", error)
    return NextResponse.json({ error: "Failed to get webhook info" }, { status: 500 })
  }
}
