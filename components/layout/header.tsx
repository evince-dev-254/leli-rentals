"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown, ShoppingBag, User, MessageCircle, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase" // Import Supabase client
import { useRouter } from "next/navigation"

const categories = [
  { name: "Vehicles", href: "/categories/vehicles", count: "1,800+" },
  { name: "Homes", href: "/categories/homes", count: "2,500+" },
  { name: "Equipment", href: "/categories/equipment", count: "3,200+" },
  { name: "Electronics", href: "/categories/electronics", count: "950+" },
  { name: "Fashion", href: "/categories/fashion", count: "1,200+" },
  { name: "Entertainment", href: "/categories/entertainment", count: "850+" },
  { name: "Event Spaces", href: "/categories/events", count: "600+" },
]

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Help", href: "/help" },
]

const moreLinks = [
  { name: "Careers", href: "/careers" },
  { name: "Become an Owner", href: "/become-owner" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check auth state
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch unread counts
  useEffect(() => {
    if (!user) {
      setUnreadMessages(0)
      setUnreadNotifications(0)
      return
    }

    const fetchUnreadCounts = async () => {
      // Get unread messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false)

      // Get unread notifications count
      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      setUnreadMessages(messagesCount || 0)
      setUnreadNotifications(notificationsCount || 0)
    }

    fetchUnreadCounts()

    // Set up real-time subscriptions
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      }, () => {
        fetchUnreadCounts()
      })
      .subscribe()

    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchUnreadCounts()
      })
      .subscribe()

    return () => {
      messagesSubscription.unsubscribe()
      notificationsSubscription.unsubscribe()
    }
  }, [user])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-2 sm:px-4 py-2 sm:py-4">
      <div className="container mx-auto">
        <div
          className={`flex h-12 sm:h-14 items-center justify-between px-3 sm:px-6 rounded-full shadow-lg transition-all duration-300 ${isScrolled
            ? "bg-[#1a1a2e]/80 backdrop-blur-md border border-[#2a2a4e]"
            : "bg-black/10 backdrop-blur-sm border border-white/10"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="leli rentals"
              width={100}
              height={28}
              className="h-4 sm:h-5 w-auto invert"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button
                  variant="ghost"
                  className="text-gray-200 hover:text-orange-400 hover:bg-white/10 hover:scale-105 transition-all duration-300 text-sm font-medium"
                >
                  {link.name}
                </Button>
              </Link>
            ))}

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-200 hover:text-white hover:bg-white/10 text-sm font-medium"
                >
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1a1a2e] border-[#2a2a4e]">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link
                      href={category.href}
                      className="flex justify-between text-gray-200 hover:text-white focus:text-white focus:bg-white/10"
                    >
                      <span>{category.name}</span>
                      <span className="text-gray-400 text-xs">{category.count}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link href="/categories" className="text-purple-400 font-medium hover:text-purple-300">
                    View All Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-200 hover:text-orange-400 hover:bg-white/10 relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Messages Icon */}
            <Link href="/messages">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-gray-200 hover:text-orange-400 hover:bg-white/10 relative"
              >
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#1a1a2e]" />
                )}
              </Button>
            </Link>

            {/* Cart/Notifications Icon */}
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-gray-200 hover:text-orange-400 hover:bg-white/10 relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#1a1a2e]" />
                )}
              </Button>
            </Link>

            {/* Login/Profile Button - Conditional Rendering */}
            {user ? (
              <Link href="/dashboard">
                <Button className="hidden sm:flex bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-6 font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="hidden sm:flex bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-gray-200 hover:text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#1a1a2e] border-[#2a2a4e] w-80 px-6 py-8">
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-gray-200 hover:text-white py-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-gray-400 font-medium">Categories</p>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block pl-4 py-2 text-gray-300 hover:text-white"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-gray-400 font-medium">More</p>
                    {moreLinks.map((link) => (
                      <Link key={link.name} href={link.href} className="block pl-4 py-2 text-gray-300 hover:text-white">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                    <Link href="/messages" className="flex-1">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-200 bg-transparent py-6">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Messages
                      </Button>
                    </Link>
                    <Link href="/favorites" className="flex-1">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-200 bg-transparent py-6">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Favorites
                      </Button>
                    </Link>
                  </div>

                  {/* Mobile Login/Profile Button */}
                  {user ? (
                    <Link href="/dashboard">
                      <Button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full py-6">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full py-6">
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
