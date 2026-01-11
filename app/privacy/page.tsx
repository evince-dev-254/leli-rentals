import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Privacy Policy | Leli Rentals",
  description: "How Leli Rentals collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              How we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 2026</p>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Lock className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Data Security</h3>
                <p className="text-xs text-muted-foreground">Industry-standard encryption</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <UserCheck className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Your Rights</h3>
                <p className="text-xs text-muted-foreground">Access, update, delete data</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Transparency</h3>
                <p className="text-xs text-muted-foreground">Clear data usage policies</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Introduction
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Leli Rentals Limited (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using Leli Rentals, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Information We Collect
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-4">2.1 Information You Provide</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">We collect information you provide directly:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><strong>Account Information:</strong> Name, email, phone number, date of birth, password</li>
                <li><strong>Profile Information:</strong> Bio, profile picture, location preferences</li>
                <li><strong>Verification Documents:</strong> ID cards, driver&apos;s licenses, business permits</li>
                <li><strong>Payment Information:</strong> Payment methods, billing address (processed by Paystack)</li>
                <li><strong>Listing Information:</strong> Item descriptions, photos, pricing, availability</li>
                <li><strong>Communications:</strong> Messages, reviews, support tickets</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">When you use our Platform, we automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, search queries</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address</li>
                <li><strong>Cookies:</strong> See our Cookie Policy for details</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">2.3 Third-Party Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">We may receive information from:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Social media platforms (if you connect your account via Google OAuth or similar)</li>
                <li>Payment processors (transaction confirmations)</li>
                <li>Analytics providers (Google Analytics)</li>
                <li>Verification services (identity verification)</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">2.4 Cookie Usage</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">We use cookies and similar tracking technologies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><strong>Essential Cookies:</strong> Required for authentication, security, and basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Google Analytics tracks user behavior, page views, and site performance</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences, language settings, and favorites</li>
                <li><strong>Security Cookies:</strong> Cloudflare Turnstile for bot protection and fraud prevention</li>
                <li><strong>Support Cookies:</strong> Tawk.to for live chat functionality</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                For detailed information about our cookie usage, please see our{" "}
                <a href="/cookies" className="text-primary hover:underline font-medium">Cookie Policy</a>.
                You can manage your cookie preferences through our consent banner or your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold mb-2">Provide Services</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Create and manage your account</li>
                    <li>Process transactions and payments</li>
                    <li>Facilitate rentals between Owners and Renters</li>
                    <li>Provide customer support</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold mb-2">Improve Platform</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Analyze usage patterns and trends</li>
                    <li>Develop new features and services</li>
                    <li>Personalize your experience</li>
                    <li>Conduct research and analytics</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold mb-2">Communication</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Send transactional emails (booking confirmations, receipts)</li>
                    <li>Provide customer support responses</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Notify you of platform updates</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold mb-2">Safety and Security</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                    <li>Verify user identities</li>
                    <li>Prevent fraud and abuse</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> How We Share Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.1 Other Users</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you create a listing or book a rental, certain information (name, profile picture, reviews) is shared with the other party to facilitate the transaction.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.2 Service Providers</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">We share information with trusted third parties who help us operate:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><strong>Payment Processing:</strong> Paystack (payment transactions, PCI-DSS compliant)</li>
                <li><strong>Cloud Storage:</strong> Supabase (database and authentication), ImageKit (image hosting and optimization)</li>
                <li><strong>Analytics:</strong> Google Analytics (usage analytics, user behavior tracking), Vercel Analytics (performance monitoring)</li>
                <li><strong>Email Services:</strong> Resend (transactional emails, booking confirmations)</li>
                <li><strong>Security:</strong> Cloudflare Turnstile (bot protection, fraud prevention)</li>
                <li><strong>Customer Support:</strong> Tawk.to (live chat support)</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-6">4.2.1 Detailed Vendor Information</h3>

              <div className="space-y-4 mb-4">
                <div className="border-l-4 border-blue-500 pl-4 bg-blue-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Website analytics, user behavior tracking, performance measurement
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> IP address, browser information, pages visited, time on site, user interactions, device information, location data
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Transfer:</strong> May transfer data outside EEA/EU (Google servers worldwide)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 bg-purple-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Cloudflare Turnstile</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Bot protection, fraud prevention, security
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> IP address, browser fingerprint, interaction patterns
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Transfer:</strong> May transfer data outside EEA/EU
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cloudflare Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 bg-green-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Tawk.to</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Live chat support, customer service
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> Chat messages, name, email, IP address, browser information
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Transfer:</strong> Data stored in US (may transfer outside EEA/EU)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://www.tawk.to/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tawk.to Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 bg-orange-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Supabase</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Database, authentication, real-time data
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> All user data, listings, messages, bookings
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Location:</strong> EU servers (GDPR compliant)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-pink-500 pl-4 bg-pink-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Paystack</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Payment processing
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> Payment card details, billing information, transaction data
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Compliance:</strong> PCI-DSS Level 1 certified
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Paystack Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4 bg-cyan-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">ImageKit</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Image hosting, optimization, CDN
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> Uploaded images, user-generated content
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://imagekit.io/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">ImageKit Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4 bg-indigo-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Resend</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Transactional email delivery
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> Email addresses, email content, delivery status
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Resend Privacy Policy</a>
                  </p>
                </div>

                <div className="border-l-4 border-slate-500 pl-4 bg-slate-500/5 p-3 rounded-r">
                  <h4 className="font-semibold mb-2">Vercel Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Purpose:</strong> Performance monitoring, web vitals tracking
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Data Processed:</strong> Page views, performance metrics (first-party, privacy-friendly)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Privacy Policy:</strong> <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel Privacy Policy</a>
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.3 Legal Requirements</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.4 Business Transfers</h3>
              <p className="text-muted-foreground leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Data Security
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted storage of sensitive data</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure payment processing (PCI-DSS compliant)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Your Rights and Choices
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.1 Access and Update</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can access and update your account information at any time through your profile settings.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.2 Data Deletion</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can request deletion of your account and personal data by contacting us. Some information may be retained for legal or legitimate business purposes.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.3 Marketing Communications</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can opt out of marketing emails by clicking the &quot;unsubscribe&quot; link in any marketing email or updating your preferences in account settings.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.4 Cookies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control cookies through your browser settings. See our Cookie Policy for more details.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.5 Data Portability</h3>
              <p className="text-muted-foreground leading-relaxed">
                You can request a copy of your personal data in a machine-readable format.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Children&apos;s Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Platform is not intended for users under 18 years of age. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">9.</span> International Data Transfers
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than Kenya. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">10.</span> Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our Platform and updating the &quot;Last updated&quot; date. Your continued use of the Platform after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">11.</span> Compliance Monitoring
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are committed to maintaining compliance with data protection regulations including GDPR. Our compliance procedures include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li><strong>Monthly Crawler Checks:</strong> We use automated tools to scan our website for compliance issues, including cookie usage, vendor tracking, and consent management</li>
                <li><strong>Consent Rate Monitoring:</strong> We regularly review user consent rates and ensure our consent management platform is functioning correctly</li>
                <li><strong>Vendor List Updates:</strong> We maintain an up-to-date list of all third-party vendors and review their data processing practices monthly</li>
                <li><strong>Privacy Policy Reviews:</strong> We review and update this privacy policy as needed to reflect changes in our practices or legal requirements</li>
                <li><strong>Data Protection Impact Assessments:</strong> We conduct regular assessments of our data processing activities</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                If you have concerns about our compliance practices or data handling, please contact our Data Protection Officer using the contact information below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">12.</span> Third-Party Services (Google OAuth)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Platform uses Google OAuth for authentication. When you choose to sign in with Google:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>We collect your <strong>name</strong>, <strong>email address</strong>, and <strong>profile picture</strong>.</li>
                <li>This data is used solely to create and manage your account on Leli Rentals.</li>
                <li>We do not share your Google user data with third parties for marketing purposes.</li>
                <li>We do not use your Google user data for any purpose other than providing and improving our services.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Leli Rentals&apos; use and transfer of information received from Google APIs to any other app will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Google API Services User Data Policy</a>, including the Limited Use requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">13.</span> Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
                <p><strong>Leli Rentals Limited</strong></p>
                <p><strong>Data Protection Officer</strong></p>
                <p><strong>Email:</strong> <a href="mailto:lelirentalsmail@gmail.com" className="text-primary hover:underline">lelirentalsmail@gmail.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+254112081866" className="text-primary hover:underline">+254 112 081 866</a></p>
                <p><strong>Address:</strong> 123 Rental Street, Nairobi, Kenya 00100</p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-muted-foreground text-center">
                By using leli rentals, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
