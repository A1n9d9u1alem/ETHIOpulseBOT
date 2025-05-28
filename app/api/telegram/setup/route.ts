import { NextResponse } from "next/server"

export async function POST() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 })
    }

    // Get the current deployment URL
    const webhookUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://your-app.vercel.app"}/api/telegram`

    console.log("Setting webhook to:", webhookUrl)

    // Set the webhook
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
      }),
    })

    const result = await response.json()
    console.log("Webhook setup result:", result)

    return NextResponse.json({
      success: result.ok,
      webhookUrl,
      result,
    })
  } catch (error) {
    console.error("Error setting up webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 })
    }

    // Get webhook info
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`)

    const result = await response.json()

    return NextResponse.json({
      success: result.ok,
      webhookInfo: result.result,
    })
  } catch (error) {
    console.error("Error getting webhook info:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
