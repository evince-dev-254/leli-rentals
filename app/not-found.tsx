import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-8xl font-black text-white mb-4">404</h2>
            <p className="text-2xl font-bold text-white/90 mb-8">This page could not be found.</p>
            <Link href="/">
                <Button variant="secondary" size="lg" className="font-semibold">
                    Return Home
                </Button>
            </Link>
        </div>
    )
}
