"use client"

import { useState } from "react"

export default function DebugPage() {
  const [webhookInfo, setWebhookInfo] = useState(null)
  const [setupResult, setSetupResult] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [chatId, setChatId] = useState("")
  const [loading, setLoading] = useState(false)

  const checkWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/telegram/setup")
      const data = await response.json()
      setWebhookInfo(data)
    } catch (error) {
      console.error("Error checking webhook:", error)
    }
    setLoading(false)
  }

  const setupWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/telegram/setup", { method: "POST" })
      const data = await response.json()
      setSetupResult(data)
    } catch (error) {
      console.error("Error setting up webhook:", error)
    }
    setLoading(false)
  }

  const sendTestMessage = async () => {
    if (!chatId) {
      alert("Please enter your chat ID")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/telegram/test?chatId=${chatId}`)
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      console.error("Error sending test message:", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">EthioPulseBot Debug Panel</h1>

        <div className="grid gap-6">
          {/* Webhook Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Webhook Information</h2>
            <button
              onClick={checkWebhook}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Check Webhook"}
            </button>
            {webhookInfo && (
              <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(webhookInfo, null, 2)}
              </pre>
            )}
          </div>

          {/* Setup Webhook */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Setup Webhook</h2>
            <button
              onClick={setupWebhook}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Setup Webhook"}
            </button>
            {setupResult && (
              <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(setupResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Test Message */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Send Test Message</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Chat ID:</label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter your chat ID"
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-600 mt-1">
                To get your chat ID: Send a message to your bot, then check the webhook logs or use @userinfobot
              </p>
            </div>
            <button
              onClick={sendTestMessage}
              disabled={loading || !chatId}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Test Message"}
            </button>
            {testResult && (
              <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Make sure your TELEGRAM_BOT_TOKEN environment variable is set correctly</li>
              <li>Click "Setup Webhook" to register your webhook with Telegram</li>
              <li>Send a message to your bot on Telegram (try /start)</li>
              <li>Check the Vercel function logs for any errors</li>
              <li>Use the test message feature to verify direct communication</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
