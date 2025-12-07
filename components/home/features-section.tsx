import { Shield, Zap, Crown, Clock } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified & Secure",
    description:
      "Every listing is verified by our team. Payments are held securely until your rental is successfully completed.",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "No more waiting for approvals. Look for the instant book icon to secure your rental immediately.",
  },
  {
    icon: Crown,
    title: "Premium Experience",
    description: "From luxury cars to high-end cameras, access premium items without the cost of ownership.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist you with any questions or issues.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
