import type React from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Bell, Menu, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart/cart-provider"
import { CartDropdown } from "@/components/cart/cart-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Elegance - Women's Accessories Boutique",
  description: "Discover our curated collection of elegant women's accessories.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
                          <div className="flex flex-col gap-6 py-4">
                            <div className="flex items-center justify-between">
                              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-6 w-6"
                                >
                                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                                </svg>
                                Elegance
                              </Link>
                              <ThemeToggle />
                            </div>

                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input type="search" placeholder="Search..." className="w-full bg-background pl-8" />
                            </div>

                            <nav className="flex flex-col gap-2">
                              <Link
                                href="/marketplace"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                All Products
                              </Link>
                              <Link
                                href="/marketplace?category=Earrings"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Earrings
                              </Link>
                              <Link
                                href="/marketplace?category=Necklaces"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Necklaces
                              </Link>
                              <Link
                                href="/marketplace?category=Bracelets"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Bracelets
                              </Link>
                              <Link
                                href="/marketplace?category=Rings"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Rings
                              </Link>
                              <Link
                                href="/marketplace?category=Bags"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Bags
                              </Link>
                              <Link
                                href="/marketplace?category=Scarves"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Scarves
                              </Link>
                              <Link
                                href="/marketplace?category=Hair+Accessories"
                                className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                              >
                                Hair Accessories
                              </Link>
                            </nav>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Bell className="mr-2 h-4 w-4" />
                                Notifications
                              </Button>
                              <Link href="/cart" className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 h-4 w-4"
                                  >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                  </svg>
                                  Cart
                                </Button>
                              </Link>
                            </div>

                            <Link href="/auth/login">
                              <Button className="w-full bg-primary hover:bg-primary/90">
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                              </Button>
                            </Link>
                          </div>
                        </SheetContent>
                      </Sheet>
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold text-primary transition-colors hover:text-primary/90"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 animate-pulse-subtle"
                        >
                          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                        </svg>
                        Elegance
                      </Link>
                      <nav className="hidden md:flex md:gap-6">
                        <Link
                          href="/marketplace"
                          className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          All Products
                          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                          href="/marketplace?category=Earrings"
                          className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Earrings
                          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                          href="/marketplace?category=Necklaces"
                          className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Necklaces
                          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                          href="/marketplace?category=Bracelets"
                          className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Bracelets
                          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </nav>
                    </div>
                    <div className="hidden md:flex md:items-center md:gap-4">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="w-[200px] bg-background pl-8 transition-all duration-300 focus:w-[300px] md:w-[300px] md:focus:w-[400px]"
                        />
                      </div>
                      <ThemeToggle />
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
                        <span className="absolute right-1 top-1 flex h-2 w-2 animate-pulse rounded-full bg-red-600"></span>
                      </Button>
                      <CartDropdown />
                      <Link href="/auth/login">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                        >
                          <User className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </header>
                <main className="flex-1">{children}</main>
                <footer className="border-t bg-muted/30 py-8 dark:bg-muted/10">
                  <div className="container mx-auto px-4">
                    <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                        </svg>
                        Elegance
                      </Link>
                      <div className="flex gap-4">
                        <Link
                          href="#"
                          className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </Link>
                        <Link
                          href="#"
                          className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                        </Link>
                        <Link
                          href="#"
                          className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </Link>
                      </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                      <div>
                        <h3 className="mb-4 text-lg font-bold">Shop</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link
                              href="/marketplace"
                              className="text-muted-foreground transition-colors hover:text-primary"
                            >
                              All Products
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/marketplace?featured=true"
                              className="text-muted-foreground transition-colors hover:text-primary"
                            >
                              Featured Items
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/marketplace?category=Bags"
                              className="text-muted-foreground transition-colors hover:text-primary"
                            >
                              Bags
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-bold">Support</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                              Help Center
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                              Shipping Info
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                              Returns & Exchanges
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-bold">Legal</h3>
                        <ul className="space-y-2">
                          <li>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                              Terms of Service
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                              Privacy Policy
                            </Link>
                          </li>
                          <li>
                            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                              Cookie Policy
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Subscribe to our newsletter for the latest updates and offers.
                        </p>
                        <div className="flex gap-2">
                          <Input placeholder="Your email" className="bg-background" />
                          <Button className="bg-primary hover:bg-primary/90">Subscribe</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
                      <p>© 2025 Elegance. All rights reserved.</p>
                    </div>
                  </div>
                </footer>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'