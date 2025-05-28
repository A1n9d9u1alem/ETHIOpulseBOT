export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden my-8">
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-green-100">EthioPulseBot</p>
        </div>

        <div className="p-6">
          <div className="prose max-w-none">
            <p>Last updated: May 22, 2024</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to EthioPulseBot ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
              you have a positive experience when using our Telegram bot. This Privacy Policy explains how we collect,
              use, and safeguard your information when you use our service.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li>
                <strong>User Information:</strong> When you interact with our bot, we collect your Telegram user ID,
                username, and chat ID.
              </li>
              <li>
                <strong>Preferences:</strong> We store your content preferences, language settings, and notification
                preferences.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about how you interact with our bot, including
                commands used and content requested.
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Personalize your experience</li>
              <li>Send notifications based on your preferences</li>
              <li>Improve our bot and develop new features</li>
              <li>Monitor usage patterns and performance</li>
            </ul>

            <h2>4. Data Storage and Security</h2>
            <p>
              We store your data securely using industry-standard encryption and security measures. We use Supabase as
              our database provider, which implements robust security practices. Your data is stored only as long as
              necessary to provide our services.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>
              Our bot integrates with several third-party services to provide content, including news APIs, weather
              services, and social media platforms. Each of these services has its own privacy policy, and we encourage
              you to review them.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can request these actions
              by contacting us directly through the bot using the /help command. You can also stop using our service at
              any time by blocking or deleting the bot from your Telegram account.
            </p>

            <h2>7. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and sending a notification through the bot. You are advised to review this
              Privacy Policy periodically for any changes.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for use by individuals under the age of 13. We do not knowingly collect
              personal information from children under 13. If we become aware that we have collected personal
              information from a child under 13, we will take steps to delete that information.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through the bot using the /help
              command or by emailing us at support@ethiopulsebot.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
