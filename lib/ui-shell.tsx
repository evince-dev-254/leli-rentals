"use client"

import { ReactNode } from "react"
import ProfessionalAIChat from "@/components/professional-ai-chat"

export function UIShell({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ProfessionalAIChat isOpen={false} onToggle={() => {}} />
    </>
  )
}