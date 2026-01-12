import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const platformLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
]

const categoryLinks = [
  { name: "Homes", href: "/categories/homes" },
  { name: "Vehicles", href: "/categories/vehicles" },
  { name: "Equipment", href: "/categories/equipment" },
  { name: "Event Spaces", href: "/categories/events" },
  { name: "Electronics", href: "/categories/electronics" },
]

const supportLinks = [
  { name: "Help Center", href: "/help" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Become an Owner", href: "/become-owner" },
  { name: "Affiliate Program", href: "/affiliate" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="leli rentals"
                width={140}
                height={36}
                className="h-9 w-auto dark:invert"
                style={{ width: "auto", height: "auto" }}
                suppressHydrationWarning
              />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              The premier destination for all your rental needs. Experience seamless booking, verified listings, and
              premium support.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com/lelirentals" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/lelirentals" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/lelirentals" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/company/lelirentals" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Sarah Plaza 5th Floor, Meru County, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+254785063461</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0" />
                <span>support@leli.rentals</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Leli Rentals. All rights reserved.</p>
            <span className="hidden md:inline text-muted-foreground">•</span>
            <p className="text-sm text-muted-foreground">
              Developed by <Link href="/" className="hover:text-primary transition-colors">Leli Rentals</Link>
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
            <a href="?cmpscreen" className="cmpfooterlink cmpfooterlinkcmp text-muted-foreground hover:text-foreground transition-colors">
              Privacy Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
