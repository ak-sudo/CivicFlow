"use client"

import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, MapPin, Calendar } from "lucide-react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"
import { useEffect, useState } from "react"
import type { Report } from "@/lib/types/database"

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      window.removeEventListener("reportsUpdated", handleReportsUpdated as EventListener)
    }
  }, [])

  const profile = { full_name: "Priya Sharma" }
  const unreadNotifications = 0

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-500/10 text-blue-700",
    assigned: "bg-purple-500/10 text-purple-700",
    in_progress: "bg-yellow-500/10 text-yellow-700",
    completed: "bg-green-500/10 text-green-700",
    verified: "bg-green-600/10 text-green-800",
    needs_human_review: "bg-orange-500/10 text-orange-700",
  }

  const severityColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-700",
    medium: "bg-yellow-500/10 text-yellow-700",
    high: "bg-orange-500/10 text-orange-700",
    critical: "bg-red-500/10 text-red-700",
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader userName={profile.full_name} unreadCount={unreadNotifications || 0} />

      <main className="container px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>मेरी रिपोर्ट / My Reports</CardTitle>
                <CardDescription>All your civic issue submissions from localStorage</CardDescription>
              </div>
              <Button asChild>
                <Link href="/citizen/report">Report New Issue</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <p className="text-muted-foreground">Loading reports...</p>
              </div>
            ) : !reports || reports.length === 0 ? (
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
                {reports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/citizen/reports/${report.id}`}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    {report.image_url ? (
                      <img
                        src={report.image_url || "/placeholder.svg"}
                        alt="Report"
                        className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium line-clamp-2">{report.complaint_text}</p>
                        <Badge variant="outline" className={statusColors[report.status]}>
                          {report.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.address || "Location pending"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        {report.category && <Badge variant="secondary">{report.category.replace("_", " ")}</Badge>}
                        {report.severity_level && (
                          <Badge variant="secondary" className={severityColors[report.severity_level]}>
                            {report.severity_level}
                          </Badge>
                        )}
                      </div>
                      {report.ai_analysis && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          AI Confidence: {Math.round((report.ai_analysis as any).confidence * 100)}%
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
