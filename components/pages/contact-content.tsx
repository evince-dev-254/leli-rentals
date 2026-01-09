"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { sendContactFormEmail } from "@/lib/actions/email-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const contactMethods = [
  {
    icon: Sparkles,
    title: "Leli AI Assistant",
    value: "Instant Support",
    description: "Available 24/7 for quick answers",
    action: "Chat with AI",
    href: "/ai",
    isInternal: true,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+254785063461",
    description: "Quick responses, 9am - 9pm",
    action: "Chat Now",
    href: "https://wa.me/254785063461",
  },
  {
    icon: Mail,
    title: "Email",
    value: "support@gurucrafts.agency",
    description: "We reply within 24 hours",
    action: "Send Email",
    href: "mailto:support@gurucrafts.agency",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+254785063461",
    description: "Mon - Fri, 9am - 6pm",
    action: "Call Us",
    href: "tel:+254785063461",
  },
]

const offices = [
  {
    city: "Meru",
    address: "Sarah Plaza 5th Floor, Meru County, Kenya",
    phone: "+254785063461",
  },
]

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const result = await sendContactFormEmail(formData)
      if (result.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        setSubmitted(true)
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error("An error occurred while sending your message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Have questions? We&apos;re here to help. Reach out through any of our channels.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                  <p className="text-foreground font-medium">{method.value}</p>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                    {method.isInternal ? (
                      <Link href={method.href}>
                        {method.action}
                      </Link>
                    ) : (
                      <a href={method.href} target="_blank" rel="noopener noreferrer">
                        {method.action}
                      </a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Offices */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="verification">Verification Help</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Our Offices</h2>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{office.city}</h3>
                          <p className="text-muted-foreground">{office.address}</p>
                          <p className="text-sm text-primary">{office.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Placeholder */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <div className="relative h-[200px] bg-secondary/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive map coming soon</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
