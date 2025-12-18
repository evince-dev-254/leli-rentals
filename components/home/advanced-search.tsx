"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Briefcase, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories } from "@/lib/categories-data"

const KENYAN_CITIES = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Meru",
    "Diani",
    "Malindi",
    "Naivasha",
    "Nanyuki"
]

const KEYWORD_CATEGORY_MAP: Record<string, string> = {
    car: "vehicles",
    vehicle: "vehicles",
    truck: "vehicles",
    van: "vehicles",
    suv: "vehicles",
    sedan: "vehicles",
    motorcycle: "vehicles",
    bike: "vehicles",
    apartment: "homes",
    house: "homes",
    home: "homes",
    villa: "homes",
    stay: "homes",
    room: "homes",
    tool: "equipment",
    machine: "equipment",
    camera: "photography",
    lens: "photography",
    suit: "fashion",
    dress: "fashion",
    party: "events",
    venue: "events",
    event: "events",
    hall: "events",
    tent: "events",
}

export function AdvancedSearch() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [category, setCategory] = useState("all")
    const [city, setCity] = useState("all")

    // Auto-detect category from query
    const handleQueryChange = (val: string) => {
        setQuery(val)
        const lowerVal = val.toLowerCase()
        const detected = Object.entries(KEYWORD_CATEGORY_MAP).find(([kw]) => lowerVal.includes(kw))
        if (detected) {
            setCategory(detected[1])
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        if (category && category !== "all") params.set("category", category)
        if (city && city !== "all") params.set("city", city)

        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="w-full max-w-3xl mx-auto mb-10">
            <form
                onSubmit={handleSearch}
                className="glass-card p-1 sm:p-1.5 rounded-xl sm:rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-1 border border-white/20"
            >
                {/* Keywords */}
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:scale-110 transition-transform" />
                    <Input
                        placeholder="Search keywords..."
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        className="h-9 sm:h-11 pl-10 bg-white/5 border-none text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full sm:rounded-l-full sm:rounded-r-none text-sm"
                    />
                </div>

                <div className="hidden sm:block w-px h-6 bg-white/20 ml-1" />

                {/* Category */}
                <div className="w-full sm:w-40 relative group">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:scale-110 transition-transform z-10 pointer-events-none" />
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="h-9 sm:h-11 pl-10 bg-white/5 border-none text-white focus:ring-0 focus:ring-offset-0 rounded-full sm:rounded-none text-sm">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 text-white">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="hidden sm:block w-px h-6 bg-white/20" />

                {/* Location */}
                <div className="w-full sm:w-40 relative group">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary group-focus-within:scale-110 transition-transform z-10 pointer-events-none" />
                    <Select value={city} onValueChange={setCity}>
                        <SelectTrigger className="h-9 sm:h-11 pl-10 bg-white/5 border-none text-white focus:ring-0 focus:ring-offset-0 rounded-full sm:rounded-none text-sm">
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900/95 backdrop-blur-xl border-white/10 text-white">
                            <SelectItem value="all">Everywhere</SelectItem>
                            {KENYAN_CITIES.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button */}
                <Button
                    type="submit"
                    className="w-full sm:w-auto px-6 h-9 sm:h-11 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold text-sm shadow-md hover:shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </form>

            {/* Trust Tagline */}
            <div className="mt-3 flex flex-wrap justify-center items-center gap-3 text-white/50 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    Trusted by 10,000+ users
                </div>
                <span className="opacity-20">•</span>
                <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    Kenya&apos;s #1 Rental App
                </div>
            </div>
        </div>
    )
}
