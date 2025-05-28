import { NextResponse } from "next/server"

export async function POST() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not found" }, { status: 500 })
    }

    // Get the webhook URL
    const webhookUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://your-app.vercel.app"}/api/webhook`

    console.log("Setting webhook to:", webhookUrl)

    // Delete existing webhook first
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`)

    // Set new webhook
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
        drop_pending_updates: true,
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
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not found" }, { status: 500 })
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
