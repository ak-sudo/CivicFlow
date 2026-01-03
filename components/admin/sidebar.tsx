"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  LayoutDashboard,
  FileText,
  Map,
  AlertCircle,
  Users,
  Building2,
  BarChart3,
  Settings,
  ScrollText,
} from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const menuItems = [
    { name: t("admin.dashboard"), href: "/admin/dashboard", icon: LayoutDashboard },
    { name: t("admin.reports"), href: "/admin/reports", icon: FileText },
    { name: t("admin.map"), href: "/admin/map", icon: Map },
    { name: t("admin.review"), href: "/admin/review", icon: AlertCircle },
    { name: t("admin.workers"), href: "/admin/workers", icon: Users },
    { name: t("admin.departments"), href: "/admin/departments", icon: Building2 },
    { name: t("admin.analytics"), href: "/admin/analytics", icon: BarChart3 },
    { name: t("admin.audit"), href: "/admin/audit", icon: ScrollText },
    { name: t("admin.settings"), href: "/admin/settings", icon: Settings },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 pb-3 bg-muted/30 fixed h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={36} height={36} className="object-contain" />
          <div>
            <p className="font-bold text-lg">{t("app.name")}</p>
            <p className="text-xs text-muted-foreground">{t("admin.panel")}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
