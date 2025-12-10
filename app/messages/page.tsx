import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MessagesContent } from "@/components/messages/messages-content"

export const metadata = {
  title: "Messages - leli rentals",
  description: "Chat with rental owners and manage your conversations",
}

export default function MessagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MessagesContent />
      </main>
      <Footer />
    </div>
  )
}
