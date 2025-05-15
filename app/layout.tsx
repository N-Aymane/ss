import { Inter, Playfair_Display } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Menu, User, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata = {
  title: "SALESUCRE CO. | Luxury Essentials",
  description: "Timeless pieces for the modern wardrobe",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-offwhite/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
              <div className="flex items-center gap-12">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-offwhite">
                    <nav className="flex flex-col gap-10">
                      <Link href="/" className="w-48">
                        <Image src="/images/logo.png" alt="SALESUCRE CO." width={192} height={48} />
                      </Link>
                      <div className="flex flex-col space-y-6">
                        <Link href="/" className="text-lg font-light tracking-wide transition-colors hover:text-gold">
                          Home
                        </Link>
                        <Link
                          href="/shop"
                          className="text-lg font-light tracking-wide transition-colors hover:text-gold"
                        >
                          Shop
                        </Link>
                        <Link
                          href="/about"
                          className="text-lg font-light tracking-wide transition-colors hover:text-gold"
                        >
                          About
                        </Link>
                        <Link
                          href="/contact"
                          className="text-lg font-light tracking-wide transition-colors hover:text-gold"
                        >
                          Contact
                        </Link>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
                <Link href="/" className="hidden lg:block">
                  <Image src="/images/logo.png" alt="SALESUCRE CO." width={180} height={45} />
                </Link>
                <nav className="hidden gap-10 lg:flex">
                  <Link href="/" className="text-sm font-light tracking-wide transition-colors hover:text-gold">
                    Home
                  </Link>
                  <Link href="/shop" className="text-sm font-light tracking-wide transition-colors hover:text-gold">
                    Shop
                  </Link>
                  <Link href="/about" className="text-sm font-light tracking-wide transition-colors hover:text-gold">
                    About
                  </Link>
                  <Link href="/contact" className="text-sm font-light tracking-wide transition-colors hover:text-gold">
                    Contact
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/" className="lg:hidden">
                  <Image src="/images/logo.png" alt="SALESUCRE CO." width={100} height={25} />
                </Link>
                <Button variant="ghost" size="icon" className="rounded-full hover:text-gold">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:text-gold">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:text-gold">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="sr-only">Cart</span>
                </Button>
              </div>
            </div>
          </header>
          <Suspense>
            <main className="flex-1">{children}</main>
          </Suspense>
          <footer className="border-t border-gold/20 bg-cream">
            <div className="container mx-auto px-4 py-20">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                <div>
                  <div className="mb-6">
                    <Image src="/images/logo.png" alt="SALESUCRE CO." width={180} height={45} />
                  </div>
                  <p className="text-gray-600 mb-4 font-light leading-relaxed">
                    Timeless pieces for the modern wardrobe. Crafted with exceptional materials and thoughtful design
                    for those who appreciate subtle luxury.
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg tracking-wide mb-6">NAVIGATION</h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/" className="text-gray-600 hover:text-gold font-light tracking-wide">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/shop" className="text-gray-600 hover:text-gold font-light tracking-wide">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="text-gray-600 hover:text-gold font-light tracking-wide">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-600 hover:text-gold font-light tracking-wide">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-lg tracking-wide mb-6">NEWSLETTER</h3>
                  <p className="text-gray-600 mb-6 font-light leading-relaxed">
                    Subscribe to our newsletter for early access to new drops and exclusive offers.
                  </p>
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 rounded-none border-b border-gold/30 px-0 py-2 text-sm font-light bg-transparent focus:outline-none focus:border-gold"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="rounded-none font-light tracking-wide hover:bg-transparent hover:text-gold"
                    >
                      Subscribe
                    </Button>
                  </form>
                </div>
              </div>
              <div className="mt-16 border-t border-gold/20 pt-8 text-center text-gray-500 font-light text-sm tracking-wide">
                <p>© {new Date().getFullYear()} SALESUCRE CO. ALL RIGHTS RESERVED.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
