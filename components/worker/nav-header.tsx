"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell, User, LogOut } from "lucide-react"
import Image from "next/image"

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
import { useEffect, useState } from "react"
import { getUnreadWorkerNotificationCount } from "@/lib/utils/worker-notifications-storage"
import { getProfileFromStorage } from "@/lib/utils/profile-storage"
import { RoleSwitcher } from "@/components/role-switcher"

interface NavHeaderProps {
  userName: string
  unreadCount?: number
}

export function WorkerNavHeader({ userName }: NavHeaderProps) {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const profile = getProfileFromStorage()
  const workerId = profile?.id || "worker_default"

  useEffect(() => {
    const updateUnreadCount = () => {
      const count = getUnreadWorkerNotificationCount(workerId)
      setUnreadCount(count)
    }

    updateUnreadCount()

    // Listen for notification updates
    window.addEventListener("workerNotificationAdded", updateUnreadCount)
    window.addEventListener("workerNotificationUpdated", updateUnreadCount)

    return () => {
      window.removeEventListener("workerNotificationAdded", updateUnreadCount)
      window.removeEventListener("workerNotificationUpdated", updateUnreadCount)
    }
  }, [workerId])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/citizen/dashboard" className="flex items-center gap-2">
          <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={36} height={36} className="object-contain" />
          <span className="text-xl font-bold hidden sm:inline">CivicFlow</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/worker/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/worker/tasks" className="text-sm font-medium hover:text-primary transition-colors">
            My Tasks
          </Link>
          <Link href="/worker/attendance" className="text-sm font-medium hover:text-primary transition-colors">
            Attendance
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/worker/notifications">
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
                  <p className="text-xs text-muted-foreground">Worker Account</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/worker/profile">Profile Settings</Link>
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
