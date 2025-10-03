"use client"

import { Suspense, useState, ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ProfessionalAIChat from "@/components/professional-ai-chat"
import MessagingApp from "@/components/messaging-app"
import { AuthProvider } from "@/lib/auth-context"
import { NotificationProvider } from "@/lib/notification-context"

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <NotificationProvider>
          {children}
          <Toaster />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
