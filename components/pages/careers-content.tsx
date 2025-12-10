"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Clock, Briefcase, Users, Heart, Zap, Globe, Coffee, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const benefits = [
  { icon: Heart, title: "Health Insurance", description: "Comprehensive medical cover for you and family" },
  { icon: Globe, title: "Remote Friendly", description: "Work from anywhere in Kenya" },
  { icon: Zap, title: "Learning Budget", description: "KSh 50,000/year for courses and conferences" },
  { icon: Coffee, title: "Flexible Hours", description: "Results matter, not hours at desk" },
  { icon: Users, title: "Great Team", description: "Collaborate with passionate people" },
  { icon: Briefcase, title: "Equity Options", description: "Own a piece of what you build" },
]

const openPositions = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Nairobi / Remote",
    type: "Full-time",
    salary: "KSh 150,000 - 250,000",
    description: "Build and maintain our core rental platform using Next.js, TypeScript, and PostgreSQL.",
    requirements: [
      "5+ years experience in full-stack development",
      "Strong proficiency in React/Next.js and Node.js",
      "Experience with PostgreSQL and Supabase",
      "Excellent problem-solving skills",
    ],
  },
  {
    id: 2,
    title: "Product Designer",
    department: "Design",
    location: "Nairobi",
    type: "Full-time",
    salary: "KSh 100,000 - 180,000",
    description: "Create intuitive user experiences for our web and mobile platforms.",
    requirements: [
      "3+ years experience in product design",
      "Proficiency in Figma and design systems",
      "Strong portfolio showcasing UX process",
      "Experience with mobile-first design",
    ],
  },
  {
    id: 3,
    title: "Customer Success Manager",
    department: "Operations",
    location: "Nairobi / Mombasa",
    type: "Full-time",
    salary: "KSh 80,000 - 120,000",
    description: "Help owners and renters succeed on our platform with excellent support.",
    requirements: [
      "2+ years in customer success or support",
      "Excellent communication skills in English and Swahili",
      "Experience with support tools (Zendesk, Intercom)",
      "Problem-solving mindset",
    ],
  },
  {
    id: 4,
    title: "Affiliate Program Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "KSh 90,000 - 140,000",
    description: "Grow and manage our affiliate network across East Africa.",
    requirements: [
      "3+ years in affiliate or partnership management",
      "Strong network in the rental/sharing economy",
      "Data-driven decision making",
      "Excellent negotiation skills",
    ],
  },
  {
    id: 5,
    title: "Mobile Developer (React Native)",
    department: "Engineering",
    location: "Nairobi / Remote",
    type: "Full-time",
    salary: "KSh 120,000 - 200,000",
    description: "Build our mobile apps for iOS and Android using React Native.",
    requirements: [
      "3+ years React Native experience",
      "Published apps on App Store and Play Store",
      "Experience with mobile payments (M-Pesa)",
      "Strong TypeScript skills",
    ],
  },
]

export function CareersContent() {
  const [selectedJob, setSelectedJob] = useState<(typeof openPositions)[0] | null>(null)

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              We&apos;re Hiring
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Join the <span className="text-primary">leli rentals</span> Team
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Help us build the future of rentals in Africa. We&apos;re looking for passionate people who want to make a
              difference.
            </p>
            <Button size="lg" asChild>
              <a href="#positions">View Open Positions</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Culture Image */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image src="/diverse-african-tech-team-working-together-modern-.jpg" alt="leli rentals Team" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white max-w-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Build Something Meaningful</h2>
              <p className="text-white/80">Join a team that&apos;s transforming how people access what they need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe in taking care of our team so they can take care of our users.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Find your next opportunity at leli rentals.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {openPositions.map((job) => (
              <Card
                key={job.id}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="py-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{job.salary}</Badge>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="outline">{selectedJob.department}</Badge>
                  <Badge variant="outline">{selectedJob.location}</Badge>
                  <Badge variant="outline">{selectedJob.type}</Badge>
                  <Badge>{selectedJob.salary}</Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-semibold mb-2">About the Role</h4>
                  <p className="text-muted-foreground">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Apply for this Position</h4>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="john@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+254 700 000 000" />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn / Portfolio URL</Label>
                      <Input placeholder="https://" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cover Letter</Label>
                      <Textarea placeholder="Tell us why you'd be a great fit..." rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Resume / CV</Label>
                      <Input type="file" accept=".pdf,.doc,.docx" />
                    </div>
                    <Button type="submit" className="w-full">
                      Submit Application
                    </Button>
                  </form>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-border/50 max-w-3xl mx-auto">
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Don&apos;t see a perfect fit?</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future
                opportunities.
              </p>
              <Button variant="outline" asChild>
                <a href="mailto:careers@leli.rentals">Send Open Application</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
