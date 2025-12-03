'use client'

import { UserProfile } from '@clerk/nextjs'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your personal information, security, and preferences
          </p>
        </div>

        <div className="flex justify-center">
          <UserProfile
            path="/profile/settings"
            routing="path"
            appearance={{
              elements: {
                rootBox: "w-full shadow-none",
                card: "w-full shadow-lg border-0 rounded-xl",
                navbar: "hidden",
                navbarMobileMenuButton: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              }
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
