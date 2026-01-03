import type React from "react"
import { RoleSwitcher } from "@/components/role-switcher"
import { LandingFooter } from "@/components/landing/footer"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{children}</div>
      <LandingFooter />
      <RoleSwitcher />
    </div>
  )
}
