import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")

    if (!chatId) {
      return NextResponse.json(
        {
          error: "Please provide chatId parameter",
          example: "/api/telegram/test?chatId=YOUR_CHAT_ID",
        },
        { status: 400 },
      )
    }

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 500 })
    }

    console.log(`Sending test message to chat ID: ${chatId}`)

    // Send test message
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🧪 This is a test message from EthioPulseBot!\n\nIf you see this, the bot is working correctly!",
      }),
    })

    const result = await response.json()
    console.log("Test message result:", result)

    return NextResponse.json({
      success: result.ok,
      result,
    })
  } catch (error) {
    console.error("Error sending test message:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
