export default function TermsOfService() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-xl overflow-hidden my-8">
        <div className="bg-green-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-green-100">EthioPulseBot</p>
        </div>

        <div className="p-6">
          <div className="prose max-w-none">
            <p>Last updated: May 22, 2024</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using EthioPulseBot ("the Bot"), you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use the Bot.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              EthioPulseBot is a Telegram bot that delivers trending Ethiopian and global content including news, memes,
              videos, weather updates, sports, and social media highlights. The Bot supports both Amharic and English
              languages and offers both on-demand content and scheduled notifications.
            </p>

            <h2>3. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the Bot for any illegal purpose or in violation of any local, state, national, or international law
              </li>
              <li>Interfere with or disrupt the operation of the Bot or servers</li>
              <li>Attempt to gain unauthorized access to the Bot or its related systems</li>
              <li>Use the Bot to distribute spam or malicious content</li>
              <li>
                Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or
                entity
              </li>
            </ul>

            <h2>4. Content</h2>
            <p>
              The Bot aggregates and delivers content from various sources. We do not create or control this content and
              make no guarantees about its accuracy, quality, or appropriateness. We are not responsible for any content
              provided by third-party sources.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All intellectual property rights in the Bot, including but not limited to software, code, algorithms, and
              design, are owned by us or our licensors. You are granted a limited, non-exclusive, non-transferable
              license to use the Bot for personal, non-commercial purposes.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the
              Bot.
            </p>

            <h2>7. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the Bot or any features or
              portions thereof without prior notice. You agree that we will not be liable for any modification,
              suspension, or discontinuance of the Bot.
            </p>

            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your access to the Bot immediately, without prior notice or liability, for any
              reason whatsoever, including without limitation if you breach these Terms of Service. Upon termination,
              your right to use the Bot will immediately cease.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Ethiopia, without regard to
              its conflict of law provisions.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes
              through the Bot. Your continued use of the Bot after such modifications will constitute your
              acknowledgment and agreement to the modified terms.
            </p>

            <h2>11. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us through the bot using the /help command or
              by emailing us at support@ethiopulsebot.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
