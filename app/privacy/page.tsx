"use client"

import React, { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GlassCard } from "@/components/glass-card"
import { GradientText } from "@/components/gradient-text"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Database, Users, Mail, Phone, Calendar, CheckCircle, ArrowRight, FileText, Cookie } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const sections = [
    { id: "collection", title: "Information We Collect", icon: Eye },
    { id: "usage", title: "How We Use Your Data", icon: Database },
    { id: "protection", title: "Data Protection", icon: Lock },
    { id: "rights", title: "Your Rights", icon: Users },
    { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
    { id: "contact", title: "Contact Us", icon: Mail },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      <Header />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg"
            >
              <Shield className="h-10 w-10 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <GradientText from="from-blue-600" to="to-purple-600">
                Privacy Policy
              </GradientText>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>

            <Badge variant="secondary" className="px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              Last updated: January 15, 2024
            </Badge>
          </motion.div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 mb-12">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Quick Navigation
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={() => scrollToSection(section.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-200 ${activeSection === section.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 max-w-6xl">
        {/* Information We Collect */}
        <motion.div
          id="collection"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard gradient hover className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Personal Information
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Name and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Email address and phone number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Profile information and preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Payment and billing information</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  Usage Information
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Rental history and preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Search queries and browsing behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Device information and location data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Communication records</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* How We Use Your Data */}
        <motion.div
          id="usage"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard gradient hover className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Database className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Service Delivery
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Process rental bookings and payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Connect renters with item owners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Provide customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Send important service updates</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  Service Improvement
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Analyze usage patterns and preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Improve our platform and features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Develop new services and offerings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Personalize your experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Data Protection */}
        <motion.div
          id="protection"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard gradient hover className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Data Protection & Security
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  Technical Safeguards
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>End-to-end encryption for sensitive data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Secure servers and data centers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Regular security audits and updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Access controls and authentication</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  Operational Safeguards
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Limited access to authorized personnel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Regular staff training on data protection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Incident response procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Regular backup and recovery systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Your Rights */}
        <motion.div
          id="rights"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard gradient hover className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Privacy Rights
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  Access & Control
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>View and update your profile information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Download your data in a portable format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Delete your account and data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Opt out of marketing communications</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-pink-500" />
                  Data Portability
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Export your rental history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Transfer data to other services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Request data correction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Restrict data processing</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Cookies & Tracking */}
        <motion.div
          id="cookies"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard gradient hover className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                <Cookie className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Cookies & Tracking
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Required for basic website functionality, authentication, and security.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Help us understand how you use our platform to improve our services.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Used to deliver relevant advertisements and measure campaign effectiveness.
                </p>
              </div>

              <Link href="/cookies">
                <Button variant="outline" className="w-full">
                  Manage Cookie Preferences
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <GlassCard gradient hover className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Mail className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Us
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Questions about our privacy practices? We're here to help.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    lelirentalsmail@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Phone className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+254112081866</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Response Time
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Within 48 hours</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Take Control of Your Privacy
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Need help understanding your privacy rights? Our team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profile/settings">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Manage Privacy Settings
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Privacy Team
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
