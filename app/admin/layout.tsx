"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Package, ShoppingBag, Timer, LogOut, Menu, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { checkAuth, logout } from "@/lib/auth"
import ToastContainer from "@/components/ui/toast-container"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuth = await checkAuth()
        setIsAuthenticated(isAuth)

        if (!isAuth && pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [pathname, router])

  const handleLogout = async () => {
    await logout()
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return children
  }

  const navItems = [
    { name: "Products", href: "/admin/dashboard", icon: ShoppingBag },
    { name: "Drops", href: "/admin/drops", icon: Timer },
    { name: "Site Settings", href: "/admin/site-settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="font-bold text-xl">Admin Panel</div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col h-full">
              <div className="font-bold text-xl py-4 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Admin Panel
              </div>
              <nav className="flex-1">
                <ul className="space-y-2 py-4">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Button
                        variant={pathname === item.href ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button variant="outline" className="mt-auto" onClick={handleLogout}>
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
          <div className="p-6 font-bold text-xl flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Admin Panel
          </div>
          <nav className="flex-1">
            <ul className="space-y-2 p-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => router.push(item.href)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
      <ToastContainer />
    </div>
  )
}
