"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    Shield,
    CreditCard,
    Bell,
    Settings,
    ExternalLink,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { DatabaseService } from "@/lib/database-service"

export default function SettingsPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const { toast } = useToast()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [bio, setBio] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!user && isLoaded) {
            router.push('/sign-in')
        }
    }, [user, isLoaded, router])

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
            // Load additional data from database if needed
        }
    }, [user])

    if (!isLoaded || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    const handleSaveChanges = async () => {
        setIsLoading(true)
        try {
            // Update Clerk user
            await user.update({
                firstName,
                lastName,
            })

            // Update database
            await DatabaseService.updateUser(user.id, {
                name: `${firstName} ${lastName}`.trim(),
                phone,
                location,
                bio,
            })

            toast({
                title: "Settings saved",
                description: "Your profile has been updated successfully.",
            })
        } catch (error) {
            console.error('Error saving settings:', error)
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Link href="/profile">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Profile
                    </Button>
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your personal information, security, and preferences
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Quick Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Quick Settings
                            </CardTitle>
                            <CardDescription>Access different settings sections</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Link href="/profile/settings/clerk">
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Clerk Account Settings
                                    </span>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/profile/security">
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Security & Privacy
                                    </span>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/profile/billing">
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        Billing & Plans
                                    </span>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/profile/notifications">
                                <Button variant="outline" className="w-full justify-between">
                                    <span className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        Notifications
                                    </span>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Update your personal details and profile information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="email"
                                        value={user.primaryEmailAddress?.emailAddress || ""}
                                        disabled
                                        className="flex-1"
                                    />
                                    <Badge variant="secondary">Cannot be changed</Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+254700000000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Nairobi, Kenya"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>

                            <Separator />

                            <Button
                                onClick={handleSaveChanges}
                                disabled={isLoading}
                                className="w-full"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    )
}
