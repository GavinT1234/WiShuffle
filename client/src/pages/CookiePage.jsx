import React from 'react';

export function CookiePage() {
  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-base-content">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They help websites remember information about your visit, such as your preferences and login status.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
            <p>WiShuffle uses cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Authentication:</strong> To keep you logged in securely</li>
              <li><strong>Preferences:</strong> To remember your user preferences</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
              <li><strong>Security:</strong> To prevent fraudulent activity</li>
              <li><strong>Performance:</strong> To optimize website performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">Essential Cookies</h3>
                <p>Required for core functionality of the platform (authentication, security)</p>
              </div>
              <div>
                <h3 className="font-semibold">Performance Cookies</h3>
                <p>Help us understand how users interact with WiShuffle</p>
              </div>
              <div>
                <h3 className="font-semibold">Functionality Cookies</h3>
                <p>Remember your preferences and choices when using our platform</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to alert you when cookies are being sent. However, some features of WiShuffle may not function properly if you disable cookies entirely.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Cookies</h2>
            <p>
              Some third-party services may place cookies on your device. These are governed by their respective privacy policies. We recommend reviewing those policies to understand how your information is used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookie Retention</h2>
            <p>
              We retain cookies for different periods depending on their purpose. Session cookies are deleted when you close your browser, while persistent cookies may remain for longer periods to remember your preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at privacy@wishuffle.com.
            </p>
            <p className="text-sm mt-4">Last Updated: April 14, 2026</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CookiePage;
