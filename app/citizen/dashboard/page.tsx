"use client"

import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, CheckCircle2, Coins, AlertCircle, Plus, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"
import { getProfileFromStorage, initializeDefaultProfile } from "@/lib/utils/profile-storage"
import { useEffect, useState } from "react"
import type { Report } from "@/lib/types/database"

export default function CitizenDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{ full_name: string; role: "citizen" }>({
    full_name: "Amit Verma",
    role: "citizen",
  })

  useEffect(() => {
    // Initialize default profile if not exists
    initializeDefaultProfile()

    // Load profile from localStorage
    const userProfile = getProfileFromStorage()
    if (userProfile) {
      setProfile({ full_name: userProfile.full_name, role: "citizen" })
    }

    // Listen for profile updates
    const handleProfileUpdated = (event: CustomEvent) => {
      const updatedProfile = event.detail.profile
      setProfile({ full_name: updatedProfile.full_name, role: "citizen" })
    }

    window.addEventListener("profileUpdated", handleProfileUpdated as EventListener)

    // Load reports from localStorage on mount
    const storedReports = getReportsFromStorage()
    setReports(storedReports)
    setLoading(false)

    // Listen for report updates
    const handleReportsUpdated = (event: CustomEvent) => {
      setReports(event.detail.reports)
    }

    window.addEventListener("reportsUpdated", handleReportsUpdated as EventListener)
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated as EventListener)
      window.removeEventListener("reportsUpdated", handleReportsUpdated as EventListener)
    }
  }, [])

  const totalReports = reports.length
  const verifiedReports = reports.filter((r) => ["completed", "verified"].includes(r.status)).length
  const pendingReports = reports.filter((r) => ["submitted", "assigned", "in_progress"].includes(r.status)).length

  const wallet = { points_balance: verifiedReports * 50 + totalReports * 10 } // 50 for verified, 10 for submitted
  const unreadNotifications = 0

  const recentReports = reports.slice(0, 3)

  const severityColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-700 dark:text-green-400",
    medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    high: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    critical: "bg-red-500/10 text-red-700 dark:text-red-400",
  }

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-500/10 text-blue-700",
    assigned: "bg-purple-500/10 text-purple-700",
    in_progress: "bg-yellow-500/10 text-yellow-700",
    completed: "bg-green-500/10 text-green-700",
    verified: "bg-green-600/10 text-green-800",
    needs_human_review: "bg-orange-500/10 text-orange-700",
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader userName={profile.full_name} unreadCount={unreadNotifications} />

      <main className="container px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">नमस्ते, {profile.full_name}! / Welcome back!</h1>
              <p className="text-muted-foreground mt-1">Track your reports and make your community better</p>
            </div>
            <Button size="lg" asChild>
              <Link href="/citizen/report">
                <Plus className="mr-2 h-5 w-5" />
                नई समस्या रिपोर्ट करें
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReports}</div>
                <p className="text-xs text-muted-foreground">Issues reported by you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedReports}</div>
                <p className="text-xs text-muted-foreground">Successfully resolved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">In progress or assigned</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wallet.points_balance}</div>
                <p className="text-xs text-muted-foreground">
                  <Link href="/citizen/incentives" className="text-primary hover:underline">
                    View rewards
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>हाल की रिपोर्ट / Recent Reports</CardTitle>
                  <CardDescription>Your latest civic issue submissions from localStorage</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/citizen/my-reports">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <p className="text-muted-foreground">Loading reports...</p>
                </div>
              ) : !recentReports || recentReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No reports yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start making a difference by reporting your first issue
                  </p>
                  <Button asChild>
                    <Link href="/citizen/report">Report an Issue</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/citizen/reports/${report.id}`}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {report.image_url ? (
                        <img
                          src={report.image_url || "/placeholder.svg"}
                          alt="Report"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium line-clamp-2">{report.complaint_text}</p>
                          {report.severity_level && (
                            <Badge variant="secondary" className={severityColors[report.severity_level]}>
                              {report.severity_level}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.address || "Location pending"}
                          </span>
                          <Badge variant="outline" className={statusColors[report.status]}>
                            {report.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-primary transition-colors cursor-pointer" asChild>
              <Link href="/citizen/report">
                <CardHeader>
                  <Plus className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Report New Issue</CardTitle>
                  <CardDescription>Submit a new civic problem</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:border-primary transition-colors cursor-pointer" asChild>
              <Link href="/citizen/my-reports">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Track Reports</CardTitle>
                  <CardDescription>View all your submissions</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:border-primary transition-colors cursor-pointer" asChild>
              <Link href="/citizen/incentives">
                <CardHeader>
                  <Coins className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Redeem Rewards</CardTitle>
                  <CardDescription>Use your earned points</CardDescription>
                </CardHeader>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
