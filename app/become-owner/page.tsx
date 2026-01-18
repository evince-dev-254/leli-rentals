import { BecomeOwnerContent } from "@/components/pages/become-owner-content"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BecomeOwnerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 gradient-mesh">
        <BecomeOwnerContent />
      </main>
      <Footer />
    </div>
  )
}
