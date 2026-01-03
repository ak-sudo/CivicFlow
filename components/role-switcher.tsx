"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, Users, HardHat, Home, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RoleSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            Landing Page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/citizen/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Citizen View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/worker/dashboard" className="cursor-pointer">
            <HardHat className="mr-2 h-4 w-4" />
            Worker View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/dashboard" className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            Admin View
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
