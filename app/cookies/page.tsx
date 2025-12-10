import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield, Cookie, Settings, Eye, Lock, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Cookie Policy - leli rentals",
  description: "Learn about how we use cookies to enhance your experience on leli rentals.",
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-lg text-muted-foreground">
              Learn about how we use cookies to enhance your experience on leli rentals.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 2025</p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Essential Cookies</h3>
                <p className="text-xs text-muted-foreground">Required for basic website functionality</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Analytics Cookies</h3>
                <p className="text-xs text-muted-foreground">Help us improve user experience</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Settings className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Functional Cookies</h3>
                <p className="text-xs text-muted-foreground">Remember your preferences</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Marketing Cookies</h3>
                <p className="text-xs text-muted-foreground">Deliver relevant advertisements</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> What Are Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Cookies set by the website owner (in this case, leli rentals) are called &quot;first-party cookies&quot;. Cookies set by parties other than the website owner are called &quot;third-party cookies&quot;. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Why Do We Use Cookies?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use first-party and third-party cookies for several reasons:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide and maintain our service</li>
                <li>To understand how you use our website</li>
                <li>To improve your browsing experience</li>
                <li>To provide personalized content and advertising</li>
                <li>To analyze website traffic and performance</li>
                <li>To ensure website security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> Types of Cookies We Use
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are necessary for the website to function and cannot be switched off in our systems.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Authentication cookies: Help us remember if you&apos;re logged in</li>
                    <li>Security cookies: Protect against fraud and unauthorized access</li>
                    <li>Load balancing cookies: Ensure website stability</li>
                    <li>Cookie preference cookies: Remember your cookie settings</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Google Analytics: Helps us understand how visitors interact with our website</li>
                    <li>Performance cookies: Track page load times and errors</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies enable the website to provide enhanced functionality and personalization.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Language preferences: Remember your language settings</li>
                    <li>Location data: Provide location-based services</li>
                    <li>User preferences: Remember your display preferences</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground mb-2">
                    These cookies are used to track visitors across websites to display ads that are relevant to their interests.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Advertising cookies: Used to deliver relevant advertisements</li>
                    <li>Social media cookies: Enable social media sharing features</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Third-Party Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In some cases, we use third-party cookies provided by trusted partners for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Website analytics and performance monitoring</li>
                <li>Social media integration</li>
                <li>Payment processing (Paystack)</li>
                <li>Customer support chat functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> How Long Do Cookies Last?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies can be categorized by their duration:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent cookies:</strong> Remain until deleted or expired (typically 1-2 years)</li>
                <li><strong>Flash cookies:</strong> Used for Adobe Flash content, stored differently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> How to Control Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have several options to control cookies:
              </p>

              <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Most web browsers allow you to control cookies through their settings preferences:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Our Cookie Banner</h3>
                  <p className="text-sm text-muted-foreground">
                    When you first visit our website, you&apos;ll see a cookie banner that allows you to accept or reject non-essential cookies. You can change your preferences at any time by clicking the cookie settings link in our footer.
                  </p>
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Opt-Out Links</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For specific third-party services, you can opt out directly:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>
                      <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        Google Analytics Opt-out
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/ads/preferences" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        Facebook Advertising Settings
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Impact of Disabling Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you disable cookies, some features of our website may not work properly. For example:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You may need to log in each time you visit</li>
                <li>Some preferences may not be saved</li>
                <li>Certain interactive features may not function</li>
                <li>Personalized content may not be available</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Updates to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">9.</span> Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
                <p><strong>Email:</strong> <a href="mailto:lelirentalsmail@gmail.com" className="text-primary hover:underline">lelirentalsmail@gmail.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+254112081866" className="text-primary hover:underline">+254 112 081 866</a></p>
                <p><strong>Address:</strong> 123 Rental Street, Nairobi, Kenya 00100</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
