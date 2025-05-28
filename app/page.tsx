import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-3xl font-bold">EthioPulseBot</h1>
          <p className="mt-2 text-green-100">AI-Powered Ethiopian Content Telegram Bot</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About EthioPulseBot</h2>
            <p className="text-gray-600">
              EthioPulseBot is an AI-powered Telegram bot that delivers trending Ethiopian and global content including
              news, memes, videos, weather updates, sports, and social media highlights. The bot supports both Amharic
              and English languages.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">📰</span>
                <div>
                  <h3 className="font-medium">News Updates</h3>
                  <p className="text-sm text-gray-600">Latest Ethiopian and global news</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">😂</span>
                <div>
                  <h3 className="font-medium">Trending Memes</h3>
                  <p className="text-sm text-gray-600">Popular Ethiopian memes</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">🎬</span>
                <div>
                  <h3 className="font-medium">Popular Videos</h3>
                  <p className="text-sm text-gray-600">Trending videos from Ethiopia</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">☀️</span>
                <div>
                  <h3 className="font-medium">Weather Updates</h3>
                  <p className="text-sm text-gray-600">Local weather forecasts</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">⚽</span>
                <div>
                  <h3 className="font-medium">Sports News</h3>
                  <p className="text-sm text-gray-600">Ethiopian and international sports</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">🔥</span>
                <div>
                  <h3 className="font-medium">Social Media Trends</h3>
                  <p className="text-sm text-gray-600">What's trending on social media</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">🔔</span>
                <div>
                  <h3 className="font-medium">Scheduled Alerts</h3>
                  <p className="text-sm text-gray-600">Daily or weekly content updates</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 p-2 rounded-full mr-3">🌐</span>
                <div>
                  <h3 className="font-medium">Bilingual Support</h3>
                  <p className="text-sm text-gray-600">Amharic and English languages</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How to Use</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Commands</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/start</code> - Start the bot
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/news</code> - Get latest news
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/memes</code> - View trending memes
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/videos</code> - Watch popular videos
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/weather [city]</code> - Check weather
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/sports</code> - Get sports updates
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/social</code> - See social media trends
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/subscribe [category] [daily|weekly]</code> -
                  Subscribe to updates
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/language [en|am]</code> - Set your language
                </li>
                <li>
                  <code className="bg-gray-200 px-2 py-1 rounded">/help</code> - Show help message
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://t.me/EthioPulseBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Using EthioPulseBot
            </a>
            <p className="mt-4 text-sm text-gray-500">Or search for @EthioPulseBot on Telegram</p>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} EthioPulseBot. All rights reserved.</p>
        <div className="mt-2">
          <Link href="/privacy" className="text-green-600 hover:underline mx-2">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-green-600 hover:underline mx-2">
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  )
}
