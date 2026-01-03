"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, MapPin, Filter } from "lucide-react"
import { getReportsFromStorage, type StoredReport } from "@/lib/utils/reports-storage"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminReportsPage() {
  const [reports, setReports] = useState<StoredReport[]>([])
  const [locationFilter, setLocationFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [severityFilter, setSeverityFilter] = useState<string[]>([])

  useEffect(() => {
    const loadReports = () => {
      const allReports = getReportsFromStorage()
      setReports(allReports)
    }

    loadReports()

    // Listen for report updates
    const handleReportsUpdate = () => loadReports()
    window.addEventListener("reportsUpdated", handleReportsUpdate)

    return () => window.removeEventListener("reportsUpdated", handleReportsUpdate)
  }, [])

  const profile = { full_name: "Admin User", role: "admin" }

  const uniqueLocations = Array.from(new Set(reports.map((r) => r.address).filter(Boolean)))
  const uniqueTypes = Array.from(new Set(reports.map((r) => r.category).filter(Boolean)))
  const uniqueSeverities = ["low", "medium", "high", "critical"]

  const filteredReports = reports.filter((report) => {
    const matchesLocation =
      locationFilter.length === 0 || (report.address && locationFilter.some((loc) => report.address?.includes(loc)))
    const matchesType = typeFilter.length === 0 || (report.category && typeFilter.includes(report.category))
    const matchesSeverity =
      severityFilter.length === 0 || (report.severity_level && severityFilter.includes(report.severity_level))
    return matchesLocation && matchesType && matchesSeverity
  })

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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-y-auto">
        <AdminTopNav userName={profile.full_name} />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Reports</CardTitle>
                  <CardDescription>Manage and review civic issue reports</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Issues
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {uniqueLocations.slice(0, 5).map((location) => (
                        <DropdownMenuCheckboxItem
                          key={location}
                          checked={locationFilter.includes(location)}
                          onCheckedChange={(checked) => {
                            setLocationFilter(
                              checked ? [...locationFilter, location] : locationFilter.filter((l) => l !== location),
                            )
                          }}
                        >
                          {location.slice(0, 30)}...
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {uniqueTypes.map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={typeFilter.includes(type)}
                          onCheckedChange={(checked) => {
                            setTypeFilter(checked ? [...typeFilter, type] : typeFilter.filter((t) => t !== type))
                          }}
                        >
                          {type.replace("_", " ")}
                        </DropdownMenuCheckboxItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Filter by Severity</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {uniqueSeverities.map((severity) => (
                        <DropdownMenuCheckboxItem
                          key={severity}
                          checked={severityFilter.includes(severity)}
                          onCheckedChange={(checked) => {
                            setSeverityFilter(
                              checked ? [...severityFilter, severity] : severityFilter.filter((s) => s !== severity),
                            )
                          }}
                        >
                          {severity.toUpperCase()}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {(locationFilter.length > 0 || typeFilter.length > 0 || severityFilter.length > 0) && (
                        <>
                          <DropdownMenuSeparator />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              setLocationFilter([])
                              setTypeFilter([])
                              setSeverityFilter([])
                            }}
                          >
                            Clear All Filters
                          </Button>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Badge variant="secondary">
                    {filteredReports.length} / {reports.length} Reports
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    {reports.length === 0 ? "No reports yet" : "No reports match filters"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reports.length === 0
                      ? "Reports will appear here as they are submitted"
                      : "Try adjusting your filters to see more reports"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/admin/reports/${report.id}`}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {report.report_images && report.report_images[0] ? (
                        <img
                          src={report.report_images[0].image_url || "/placeholder.svg"}
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
                          <span>By {report.profiles?.full_name || "Citizen"}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.address || "Location pending"}
                          </span>
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          {report.severity_level && (
                            <Badge variant="secondary" className={severityColors[report.severity_level]}>
                              {report.severity_level}
                            </Badge>
                          )}
                          {report.ai_analysis?.category_confidence && (
                            <Badge variant="outline">
                              AI: {Math.round(report.ai_analysis.category_confidence * 100)}% confidence
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
