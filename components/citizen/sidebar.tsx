"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { LayoutDashboard, FileText, Gift, AlertCircle } from "lucide-react"

export function CitizenSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { name: "Dashboard", href: "/citizen/dashboard", icon: LayoutDashboard },
    { name: "Report Issue", href: "/citizen/report", icon: AlertCircle },
    { name: "My Reports", href: "/citizen/my-reports", icon: FileText },
    { name: "Rewards", href: "/citizen/incentives", icon: Gift },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-muted/30">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={36} height={36} className="object-contain" />
          <div>
            <p className="font-bold text-lg">CivicFlow</p>
            <p className="text-xs text-muted-foreground">Citizen Portal</p>
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
