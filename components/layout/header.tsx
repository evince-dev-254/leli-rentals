"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, ChevronDown, ShoppingBag, User, MessageCircle, Sun, Moon, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase" // Import Supabase client
import { useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BackButton } from "@/components/ui/back-button"
import { NotificationDropdown } from "./notification-dropdown"

const categories = [
  { name: "Vehicles", href: "/categories/vehicles", count: "1,800+" },
  { name: "Living Spaces", href: "/categories/living", count: "2,500+" },
  { name: "Homes", href: "/categories/homes", count: "2,500+" },
  { name: "Equipment", href: "/categories/equipment", count: "3,200+" },
  { name: "Electronics", href: "/categories/electronics", count: "950+" },
  { name: "Fashion", href: "/categories/fashion", count: "1,200+" },
  { name: "Entertainment", href: "/categories/entertainment", count: "850+" },
  { name: "Event Spaces", href: "/categories/utility", count: "600+" },
]

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Help", href: "/help" },
]

const moreLinks = [
  { name: "Become an Owner", href: "/become-owner" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full px-2 sm:px-4 py-6 transition-[padding,background-color] duration-300 ease-in-out ${isScrolled ? "bg-background/80 backdrop-blur-md" : ""}`}>
      <div className="container mx-auto">
        <div
          className={`flex h-11 sm:h-14 items-center justify-between px-3 sm:px-6 rounded-full shadow-lg transition-[background-color,border-color] duration-300 ease-in-out ${isScrolled
            ? "bg-[#1a1a2e]/95 backdrop-blur-md border border-[#2a2a4e]"
            : "bg-black/80 backdrop-blur-md border border-white/10"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Leli Rentals"
              width={100}
              height={28}
              priority
              className="h-4 sm:h-5 w-auto invert"
              style={{ width: "auto" }}
              suppressHydrationWarning
            />
          </Link>

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
            {/* Theme Toggle - Multi-theme support */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-200 hover:text-orange-400 hover:bg-white/10 relative h-9 w-9"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a4e] text-gray-200">
                <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

            {/* Notifications Icon */}
            {user && (
              <NotificationDropdown userId={user.id} unreadCount={unreadNotifications} />
            )}

            {/* Favorites Icon */}
            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex text-gray-200 hover:text-orange-400 hover:bg-white/10 relative"
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
            </Link>

            {/* Login/Profile Button - Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="hidden lg:flex cursor-pointer">
                    <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-white/50 transition-all">
                      <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture} loading="eager" fetchPriority="high" />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a2e] border-[#2a2a4e] text-gray-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                    <Link href="/dashboard" className="w-full flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10 cursor-pointer">
                    <Link href="/dashboard/settings" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 focus:bg-rose-500/10 cursor-pointer" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="hidden lg:flex bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}



            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-gray-200 hover:text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0f0f1a] border-[#1e1e30] w-full sm:w-[350px] p-0 overflow-y-auto flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Back Button for mobile navigation */}
                <div className="px-4 pt-4 flex items-center justify-between">
                  <BackButton
                    className="text-gray-400 hover:text-white"
                    label="Close Menu"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                </div>

                {/* User Profile / Login Header */}
                <div className="p-6 pt-10 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border-b border-white/5">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/10">
                        <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture} loading="eager" fetchPriority="high" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg">
                          {user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-white tracking-tight">
                          {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                        </span>
                        <span className="text-sm text-gray-400 truncate max-w-[180px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link href="/login" className="block">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-6 shadow-lg shadow-purple-900/30 font-bold transition-all active:scale-[0.98]">
                        <User className="mr-2 h-5 w-5" />
                        <span className="text-lg">Sign In / Join Leli</span>
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="flex-1 px-4 py-6 space-y-8">
                  {/* Action Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/messages" className="group">
                      <div className="h-28 rounded-2xl bg-[#1a1a2e] border border-white/5 p-4 flex flex-col items-center justify-center gap-2 transition-all group-active:scale-[0.97] hover:bg-[#252540] hover:border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="text-sm font-semibold text-gray-200">Messages</span>
                        {unreadMessages > 0 && (
                          <span className="absolute top-3 right-3 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link href="/favorites" className="group">
                      <div className="h-28 rounded-2xl bg-[#1a1a2e] border border-white/5 p-4 flex flex-col items-center justify-center gap-2 transition-all group-active:scale-[0.97] hover:bg-[#252540] hover:border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-rose-400" />
                        </div>
                        <span className="text-sm font-semibold text-gray-200">Favorites</span>
                        {unreadNotifications > 0 && (
                          <span className="absolute top-3 right-3 h-3 w-3 rounded-full bg-orange-500 ring-2 ring-[#1a1a2e]" />
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Main Links */}
                  <div className="space-y-1">
                    {user && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 text-lg font-medium text-gray-200 hover:text-white py-3 px-3 rounded-xl hover:bg-white/5 transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-400" />
                        </div>
                        Dashboard
                      </Link>
                    )}
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-3 text-lg font-medium text-gray-200 hover:text-white py-3 px-3 rounded-xl hover:bg-white/5 transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                        </div>
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* Accordion Sections */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories" className="border-white/5">
                      <AccordionTrigger className="text-gray-200 hover:text-white text-lg font-medium py-4 px-3 hover:no-underline">
                        Explore Categories
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="grid grid-cols-1 gap-1 px-2">
                          {categories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="text-gray-400 hover:text-white py-3 px-3 text-base rounded-xl hover:bg-white/5 transition-colors flex justify-between items-center"
                            >
                              <span>{category.name}</span>
                              <span className="text-[10px] font-bold py-0.5 px-2 bg-white/5 rounded-full text-gray-500">{category.count}</span>
                            </Link>
                          ))}
                          <Link href="/categories" className="text-purple-400 font-semibold py-3 px-3 mt-1 inline-flex items-center gap-2">
                            View All Categories <ChevronDown className="h-4 w-4 -rotate-90" />
                          </Link>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="more" className="border-white/5">
                      <AccordionTrigger className="text-gray-200 hover:text-white text-lg font-medium py-4 px-3 hover:no-underline">
                        Resources
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="flex flex-col space-y-1 px-2">
                          {moreLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="text-gray-400 hover:text-white py-3 px-3 text-base rounded-xl hover:bg-white/5">
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Footer / Logout */}
                <div className="p-6 mt-auto bg-gradient-to-t from-[#1a1a2e] to-transparent border-t border-white/5">
                  {user ? (
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await supabase.auth.signOut()
                        router.push('/')
                      }}
                      className="w-full border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl py-6 font-bold transition-all"
                    >
                      Logout Device
                    </Button>
                  ) : (
                    <p className="text-center text-sm text-gray-500">
                      Experience the best of Leli Rentals
                    </p>
                  )}
                  <div className="mt-6 flex justify-center gap-6 grayscale opacity-50">
                    <Image src="/logo.png" alt="Leli" width={60} height={15} className="invert" suppressHydrationWarning />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
