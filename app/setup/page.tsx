"use client"

import { useState } from "react"

export default function SetupPage() {
  const [webhookInfo, setWebhookInfo] = useState(null)
  const [setupResult, setSetupResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup-bot")
      const data = await response.json()
      setWebhookInfo(data)
    } catch (error) {
      console.error("Error:", error)
    }
    setLoading(false)
  }

  const setupWebhook = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/setup-bot", { method: "POST" })
      const data = await response.json()
      setSetupResult(data)
    } catch (error) {
      console.error("Error:", error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">🇪🇹 EthioInfoBot Setup</h1>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Step 1: Check Current Webhook</h2>
            <button
              onClick={checkWebhook}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Webhook Status"}
            </button>
            {webhookInfo && (
              <div className="mt-4">
                <h3 className="font-medium">Current Webhook Info:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm mt-2 overflow-auto">
                  {JSON.stringify(webhookInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Step 2: Setup New Webhook</h2>
            <button
              onClick={setupWebhook}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Setup Webhook"}
            </button>
            {setupResult && (
              <div className="mt-4">
                <h3 className="font-medium">Setup Result:</h3>
                <pre className="bg-gray-100 p-3 rounded text-sm mt-2 overflow-auto">
                  {JSON.stringify(setupResult, null, 2)}
                </pre>
                {setupResult.success && (
                  <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
                    ✅ Webhook setup successful! Your bot should now respond to messages.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Step 3: Test Your Bot</h2>
            <p className="text-sm text-gray-600 mb-2">
              After setting up the webhook, go to Telegram and send these commands to your bot:
            </p>
            <ul className="text-sm space-y-1">
              <li>
                • <code className="bg-gray-200 px-1 rounded">/start</code> - Start the bot
              </li>
              <li>
                • <code className="bg-gray-200 px-1 rounded">/help</code> - Show help
              </li>
              <li>
                • <code className="bg-gray-200 px-1 rounded">/test</code> - Test response
              </li>
              <li>
                • <code className="bg-gray-200 px-1 rounded">/news</code> - Get news
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
            <ul className="text-sm space-y-1">
              <li>• Make sure TELEGRAM_BOT_TOKEN is set in your environment variables</li>
              <li>• Check Vercel function logs for any errors</li>
              <li>• Ensure your bot username is correct (@EthioInfoBot)</li>
              <li>• Try sending /start command to your bot after setup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
