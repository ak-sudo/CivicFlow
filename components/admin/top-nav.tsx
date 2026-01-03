"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/contexts/language-context"
import { useState, useEffect } from "react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RoleSwitcher } from "@/components/role-switcher"

interface TopNavProps {
  userName: string
  unreadCount?: number
  onSearch?: (query: string) => void
}

export function AdminTopNav({ userName, unreadCount: propUnreadCount, onSearch }: TopNavProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(propUnreadCount || 0)

  useEffect(() => {
    const checkForNewReports = () => {
      const reports = getReportsFromStorage()
      const recentReports = reports.filter((r) => {
        const createdAt = new Date(r.created_at)
        const now = new Date()
        const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60
        return diffMinutes < 60 // Reports from last hour
      })

      const newNotifications = recentReports.map((report) => ({
        id: report.id,
        title: `New Report: ${report.category || "Unknown"}`,
        message: report.complaint_text.slice(0, 80) + "...",
        created_at: report.created_at,
        type: "new_report",
        severity: report.severity_level,
      }))

      setNotifications(newNotifications)
      setUnreadCount(newNotifications.length)
    }

    checkForNewReports()

    const handleReportsUpdate = () => {
      checkForNewReports()
    }

    window.addEventListener("reportsUpdated", handleReportsUpdate)
    return () => window.removeEventListener("reportsUpdated", handleReportsUpdate)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("search.placeholder")}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-xs text-muted-foreground">{unreadCount} new notifications</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">No new notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/admin/reports/${notif.id}`)}
                    >
                      <div className="flex items-start gap-2">
                        <Bell className="h-4 w-4 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                        {notif.severity && (
                          <Badge
                            variant="secondary"
                            className={
                              notif.severity === "critical"
                                ? "bg-red-500/10 text-red-700"
                                : notif.severity === "high"
                                  ? "bg-orange-500/10 text-orange-700"
                                  : "bg-yellow-500/10 text-yellow-700"
                            }
                          >
                            {notif.severity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">{userName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{t("admin.panel")}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/")} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t("action.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <RoleSwitcher />
        </div>
      </div>
    </header>
  )
}
