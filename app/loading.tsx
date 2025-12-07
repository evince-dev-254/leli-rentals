import { LoadingLogo } from "@/components/ui/loading-logo"

export default function Loading() {
    return (
        <div className="fixed inset-0 min-h-screen flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <LoadingLogo size={80} />
            <p className="mt-6 text-muted-foreground animate-pulse font-medium">Loading Leli Rentals...</p>
        </div>
    )
}
