"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, User, LogOut, Home } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { RoleSwitcher } from "@/components/role-switcher"

interface NavHeaderProps {
  userName: string
  unreadCount?: number
}

export function NavHeader({ userName, unreadCount = 0 }: NavHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/citizen/dashboard" className="flex items-center gap-2">
          <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={36} height={36} className="object-contain" />
          <span className="text-xl font-bold hidden sm:inline">CivicFlow</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/citizen/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link
            href="/civicbook"
            className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            CivicBook
          </Link>
          <Link href="/citizen/report" className="text-sm font-medium hover:text-primary transition-colors">
            Report Issue
          </Link>
          <Link href="/citizen/my-reports" className="text-sm font-medium hover:text-primary transition-colors">
            My Reports
          </Link>
          <Link href="/citizen/incentives" className="text-sm font-medium hover:text-primary transition-colors">
            Incentives
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/citizen/notifications">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">Citizen Account</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/citizen/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}
