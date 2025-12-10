import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { FileText, Shield, Users, CreditCard, AlertCircle, Scale } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Terms of Service - leli rentals",
  description: "Terms and conditions for using leli rentals platform.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using leli rentals.
            </p>
            <p className="text-sm text-muted-foreground mt-2">Last updated: January 2025</p>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">User Responsibilities</h3>
                <p className="text-xs text-muted-foreground">Your obligations as a user</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Payments & Fees</h3>
                <p className="text-xs text-muted-foreground">Billing and refund policies</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Liability & Protection</h3>
                <p className="text-xs text-muted-foreground">Your rights and our limits</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="glass-card p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">1.</span> Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using leli rentals (&quot;the Platform&quot;), you accept and agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These Terms constitute a legally binding agreement between you and leli rentals Limited, a company registered in Kenya. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">2.</span> Definitions
              </h2>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>&quot;Platform&quot;</strong> refers to the leli rentals website and mobile applications</li>
                <li><strong>&quot;User&quot;</strong> refers to any person who accesses or uses the Platform</li>
                <li><strong>&quot;Owner&quot;</strong> refers to users who list items for rent</li>
                <li><strong>&quot;Renter&quot;</strong> refers to users who rent items from Owners</li>
                <li><strong>&quot;Listing&quot;</strong> refers to any item posted for rent on the Platform</li>
                <li><strong>&quot;Transaction&quot;</strong> refers to any rental agreement facilitated through the Platform</li>
                <li><strong>&quot;Affiliate&quot;</strong> refers to users who earn commissions by referring others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">3.</span> User Accounts
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-4">3.1 Registration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use certain features of the Platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Be at least 18 years of age</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">3.2 Account Types</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Renter Account:</strong> Browse and rent items</li>
                <li><strong>Owner Account:</strong> List items for rent (requires verification)</li>
                <li><strong>Affiliate Account:</strong> Earn commissions through referrals</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">3.3 Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Owners and Affiliates must complete identity verification before accessing full platform features. We reserve the right to request additional verification at any time.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">3.4 Identity Verification and Biometrics</h3>
              <p className="text-muted-foreground leading-relaxed">
                To ensure the safety and security of our platform, we may require you to provide government-issued identification and a live selfie. By using our verification services, you consent to the collection and processing of your biometric data (facial images) solely for the purpose of identity verification and fraud prevention. This data is handled securely in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">4.</span> Listings and Rentals
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.1 Owner Responsibilities</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">As an Owner, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Provide accurate descriptions and images of your items</li>
                <li>Set fair and reasonable rental prices</li>
                <li>Maintain items in good working condition</li>
                <li>Honor confirmed bookings</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Have legal right to rent the items you list</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.2 Renter Responsibilities</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">As a Renter, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Use rented items responsibly and as intended</li>
                <li>Return items in the same condition as received</li>
                <li>Pay all fees and charges on time</li>
                <li>Report any damage or issues immediately</li>
                <li>Comply with the Owner&apos;s terms and conditions</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">4.3 Prohibited Items</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">The following items may not be listed:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Illegal items or items used for illegal purposes</li>
                <li>Weapons, explosives, or hazardous materials</li>
                <li>Stolen or counterfeit goods</li>
                <li>Items that violate intellectual property rights</li>
                <li>Living animals (except service animals)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">5.</span> Payments and Fees
              </h2>

              <h3 className="font-semibold text-lg mb-2 mt-4">5.1 Service Fees</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                leli rentals charges a service fee on each transaction. The fee structure is:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Renter fee: 5% of the rental amount</li>
                <li>Owner fee: 10% of the rental amount</li>
                <li>Payment processing fees may apply</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">5.2 Subscription Plans</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Owners may subscribe to premium plans for additional features. Subscription fees are non-refundable except as required by law.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">5.3 Payments</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All payments are processed through Paystack. You agree to pay all charges incurred under your account. We reserve the right to suspend access for non-payment.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">5.4 Refunds and Cancellations</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Cancellations made 48+ hours before rental: Full refund minus service fee</li>
                <li>Cancellations made 24-48 hours before: 50% refund</li>
                <li>Cancellations made less than 24 hours before: No refund</li>
                <li>Owner cancellations may result in penalties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">6.</span> Liability and Insurance
              </h2>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Important Notice</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      leli rentals is a marketplace platform. We do not own, control, or manage the items listed. All transactions are between Owners and Renters.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.1 Platform Liability</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                leli rentals provides the Platform &quot;as is&quot; without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Quality, safety, or legality of items listed</li>
                <li>Accuracy of listings or user content</li>
                <li>Performance or conduct of users</li>
                <li>Damage, loss, or injury arising from rentals</li>
                <li>Disputes between Owners and Renters</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.2 User Liability</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are responsible for your use of the Platform and any content you post. You agree to indemnify leli rentals against claims arising from your breach of these Terms.
              </p>

              <h3 className="font-semibold text-lg mb-2 mt-4">6.3 Insurance</h3>
              <p className="text-muted-foreground leading-relaxed">
                We strongly recommend that Owners maintain appropriate insurance for their items. Renters should verify their personal insurance covers rented items.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">7.</span> Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Platform and its content (excluding user content) are owned by leli rentals and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By posting content on the Platform, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">8.</span> Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Abuse of the Platform or other users</li>
                <li>Non-payment of fees</li>
                <li>Any reason at our sole discretion</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You may close your account at any time. Termination does not affect existing rental agreements or payment obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">9.</span> Dispute Resolution
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Any disputes arising from these Terms or use of the Platform shall be resolved through:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Good faith negotiation between the parties</li>
                <li>Mediation, if negotiation fails</li>
                <li>Arbitration under the Arbitration Act of Kenya</li>
              </ol>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of Kenya. The courts of Nairobi shall have exclusive jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-primary">10.</span> Contact Information
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-secondary/50 p-4 rounded-lg space-y-2 text-sm">
                <p><strong>leli rentals Limited</strong></p>
                <p><strong>Email:</strong> <a href="mailto:lelirentalsmail@gmail.com" className="text-primary hover:underline">lelirentalsmail@gmail.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+254112081866" className="text-primary hover:underline">+254 112 081 866</a></p>
                <p><strong>Address:</strong> 123 Rental Street, Nairobi, Kenya 00100</p>
              </div>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-muted-foreground text-center">
                By using leli rentals, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
