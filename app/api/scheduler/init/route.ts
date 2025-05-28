import { NextResponse } from "next/server"
import { initializeSchedulers } from "@/lib/scheduler"

// Initialize schedulers endpoint
export async function POST() {
  try {
    await initializeSchedulers()

    return NextResponse.json({
      success: true,
      message: "Schedulers initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing schedulers:", error)
    return NextResponse.json({ error: "Failed to initialize schedulers" }, { status: 500 })
  }
}

// Get scheduler status
export async function GET() {
  try {
    const { getSchedulerStatus } = await import("@/lib/scheduler")
    const status = getSchedulerStatus()

    return NextResponse.json({
      success: true,
      ...status,
    })
  } catch (error) {
    console.error("Error getting scheduler status:", error)
    return NextResponse.json({ error: "Failed to get scheduler status" }, { status: 500 })
  }
}
