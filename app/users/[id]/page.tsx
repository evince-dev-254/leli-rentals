import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { MapPin, Calendar, ShieldCheck, Star, Mail, Phone, Crown } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const dynamic = 'force-dynamic'

// Helper function to generate role-specific default bios
function getDefaultBio(role: string, fullName: string): string {
    const firstName = fullName.split(' ')[0]

    const bioTemplates: Record<string, string> = {
        owner: `Hi, I'm ${fullName}! As a verified owner on Leli Rentals, I take pride in providing high-quality items and exceptional service to my renters. I believe in building trust through transparency and ensuring every rental experience is smooth and reliable. Whether you're looking for equipment, vehicles, or property rentals, I'm here to help you find exactly what you need. Feel free to reach out with any questions!`,

        renter: `Hello! I'm ${fullName}, an active renter on Leli Rentals. I love exploring the wide variety of quality items available on this platform. From special occasions to everyday needs, Leli has made it easy for me to access what I need without the commitment of ownership. I value great service and always leave honest reviews to help the community. Looking forward to more great rental experiences!`,

        affiliate: `Hey there! I'm ${fullName}, a proud Leli Rentals affiliate partner. I'm passionate about connecting people with amazing rental opportunities and helping them discover how easy and affordable renting can be. As an affiliate, I earn commissions by sharing Leli with my network, and I love being part of a platform that's transforming how Kenyans access the things they need. Join me in the Leli community!`
    }

    return bioTemplates[role] || `Hi, I'm ${fullName}. Welcome to my Leli Rentals profile!`
}

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch User Profile
    const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", id)
        .single()

    if (profileError || !profile) {
        notFound()
    }

    // Get current user to check if viewing own profile
    const cookieStore = await cookies()
    const supabaseServer = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
            },
        }
    )
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser()

    // Get user auth metadata for avatar fallback
    const { data: { user } } = await supabase.auth.admin.getUserById(id)
    const userMeta = user?.user_metadata || {}

    // Use fallback logic for avatar similar to dashboard
    const avatarUrl = profile.avatar_url || userMeta.avatar_url || userMeta.picture || "/african-man-portrait.png"


    // Fetch Verification Status
    const { data: verification } = await supabase
        .from("verification_documents")
        .select("status")
        .eq("user_id", id)
        .eq("status", "approved")
        .limit(1)

    const isVerified = verification && verification.length > 0

    // Fetch Subscription Status
    const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status, plan_type")
        .eq("user_id", id)
        .in("status", ["active", "trialing"])
        .order("end_date", { ascending: false })
        .limit(1)
        .single()

    const isPremium = subscription?.plan_type === 'premium' || subscription?.plan_type === 'enterprise'

    // Fetch Listings
    const { data: listings } = await supabase
        .from("listings")
        .select("*")
        .eq("owner_id", id)
        .eq("status", "approved")
        .eq("availability_status", "available")

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto space-y-8">

                    <div className="flex items-center gap-4 mb-2 -ml-2">
                        <BackButton href="/dashboard" label="Back to Dashboard" />
                    </div>

                    {/* Profile Header Card */}
                    <Card className="glass-card overflow-hidden border-border/50">
                        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
                        <div className="px-8 pb-8">
                            <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-12 gap-6 text-center sm:text-left">
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden bg-muted relative">
                                        <img
                                            src={avatarUrl}
                                            alt={profile.full_name}
                                            className="w-full h-full object-cover cmp-ignore"
                                            loading="eager"
                                            fetchPriority="high"
                                            data-cmp-ignore
                                            onError={(e) => {
                                                e.currentTarget.src = "/african-man-portrait.png"
                                            }}
                                        />
                                    </div>
                                    {isVerified && (
                                        <div className="absolute bottom-1 right-1 bg-green-500 text-white p-1 rounded-full border-2 border-background" title="Verified Owner">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-2 mb-2">
                                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start">
                                        <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                                        {isPremium && (
                                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                                                <Crown className="w-3 h-3 mr-1 fill-amber-800" />
                                                Premium
                                            </Badge>
                                        )}
                                        {isVerified && (
                                            <Badge variant="outline" className="border-green-500/50 text-green-600 bg-green-50/50">
                                                Verified
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {profile.location || "Kenya"}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            4.8 (Reviews) {/* Placeholder for aggregated rating */}
                                        </div>
                                    </div>
                                </div>

                                {profile.role === 'owner' && currentUser?.id !== profile.id && (
                                    <div className="flex gap-3 justify-center sm:justify-start w-full sm:w-auto mt-4 sm:mt-0">
                                        <Button asChild>
                                            <Link href={`/dashboard/messages?contact=${profile.id}&name=${encodeURIComponent(profile.full_name)}`}>
                                                Contact Owner
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">About</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {profile.bio || getDefaultBio(profile.role || 'renter', profile.full_name)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Card className="bg-secondary/20 border-none shadow-none">
                                        <CardContent className="p-4 space-y-3">
                                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Verifications</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <ShieldCheck className={`w-4 h-4 ${isVerified ? 'text-green-600' : 'text-muted-foreground'}`} />
                                                    <span className={isVerified ? 'text-foreground' : 'text-muted-foreground'}>Identity Verified</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className={`w-4 h-4 ${profile.email_verified ? 'text-green-600' : 'text-muted-foreground'}`} />
                                                    <span className={profile.email_verified ? 'text-foreground' : 'text-muted-foreground'}>Email Confirmed</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className={`w-4 h-4 ${profile.phone_verified ? 'text-green-600' : 'text-muted-foreground'}`} />
                                                    <span className={profile.phone_verified ? 'text-foreground' : 'text-muted-foreground'}>Phone Confirmed</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Listings Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Listings by {profile.full_name?.split(' ')[0]}</h2>

                        {listings && listings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listings.map((listing: any) => (
                                    <Link href={`/listings/${listing.id}`} key={listing.id} className="group block">
                                        <Card className="h-full overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg glass-card">
                                            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                                                {listing.images && listing.images[0] ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={listing.images[0]}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 cmp-ignore"
                                                        data-cmp-ignore
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/placeholder.svg"
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-background/80 backdrop-blur text-foreground hover:bg-background/90">
                                                        {listing.category_id} {/* Could look up category name if needed */}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold truncate pr-2 group-hover:text-primary transition-colors">{listing.title}</h3>
                                                    <span className="flex items-center text-xs font-medium bg-secondary px-2 py-1 rounded">
                                                        <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                                                        {listing.rating_average || "New"}
                                                    </span>
                                                </div>
                                                <div className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                    {listing.description}
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <p className="font-bold text-lg">
                                                        {listing.currency} {listing.price_per_day} <span className="text-sm font-normal text-muted-foreground">/ day</span>
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-secondary/10 rounded-xl">
                                <p className="text-muted-foreground">No active listings yet.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}
