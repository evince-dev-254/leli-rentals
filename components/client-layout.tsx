"use client"

import { Suspense, useState, ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AISupportChat from "@/components/ai-support-chat"
import { AuthProvider } from "@/components/auth-provider"
import { NotificationProvider } from "@/lib/notification-context"

interface ClientLayoutProps {
  children: any
}

function ClientLayoutContent({ children }: ClientLayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const toggleChat = () => setIsChatOpen(!isChatOpen)
  
  return (
    <NotificationProvider>
      <Suspense fallback={null}>{children}</Suspense>
      <AISupportChat isOpen={isChatOpen} onToggle={toggleChat} />
      <Toaster />
    </NotificationProvider>
  )
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <ClientLayoutContent>{children}</ClientLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  )
}
