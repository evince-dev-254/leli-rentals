"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Crown, Clock } from "lucide-react"
import { staggerContainer, fadeInUp, hoverScale } from "@/lib/animations"

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
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                variants={hoverScale}
                className="glass-card rounded-2xl p-6 text-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full border border-white/10"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
