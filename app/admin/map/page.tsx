"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Maximize2, X } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { useState, useEffect } from "react"
import { ReportsMap } from "@/components/admin/reports-map"
import { getReportsFromStorage, type StoredReport } from "@/lib/utils/reports-storage"

export default function AdminMapPage() {
  const { t } = useLanguage()
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [reports, setReports] = useState<StoredReport[]>([])

  useEffect(() => {
    const loadReports = () => {
      const allReports = getReportsFromStorage()
      const reportsWithLocation = allReports.filter((r) => r.latitude && r.longitude)
      setReports(reportsWithLocation)
    }

    loadReports()

    const handleReportsUpdate = () => loadReports()
    window.addEventListener("reportsUpdated", handleReportsUpdate)
    return () => window.removeEventListener("reportsUpdated", handleReportsUpdate)
  }, [])

  const mapReports = reports.map((report) => ({
    id: report.id,
    lat: report.latitude!,
    lng: report.longitude!,
    severity: (report.severity_level || "medium") as "low" | "medium" | "high" | "critical",
    address: report.address || `${report.latitude}, ${report.longitude}`,
    complaint: report.complaint_text,
  }))

  const filteredReports = searchQuery
    ? mapReports.filter(
        (r) =>
          r.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.complaint.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mapReports

  const severityColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-700",
    medium: "bg-yellow-500/10 text-yellow-700",
    high: "bg-orange-500/10 text-orange-700",
    critical: "bg-red-500/10 text-red-700",
  }

  const stats = {
    total: filteredReports.length,
    critical: filteredReports.filter((r) => r.severity === "critical").length,
    high: filteredReports.filter((r) => r.severity === "high").length,
    medium: filteredReports.filter((r) => r.severity === "medium").length,
    low: filteredReports.filter((r) => r.severity === "low").length,
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-y-auto">
        <AdminTopNav userName="सुनीता मेहता / Sunita Mehta" onSearch={setSearchQuery} />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <div className="space-y-6">
            <div className="text-center mx-auto">
              <h1 className="text-3xl font-bold">{t("admin.map")}</h1>
              <p className="text-muted-foreground mt-1">Geographic view of all civic reports with heatmap</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground mt-1">On map</p>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Critical</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
                  <p className="text-xs text-muted-foreground mt-1">Urgent action</p>
                </CardContent>
              </Card>
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-700">High</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{stats.high}</div>
                  <p className="text-xs text-muted-foreground mt-1">Priority</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">Medium</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-700">{stats.medium}</div>
                  <p className="text-xs text-muted-foreground mt-1">Standard</p>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Low</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">{stats.low}</div>
                  <p className="text-xs text-muted-foreground mt-1">Routine</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Area */}
              <Card className={`${isMapExpanded ? "fixed inset-4 z-50 lg:col-span-3" : "lg:col-span-2"}`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>रिपोर्ट मानचित्र / Reports Map with Heatmap</CardTitle>
                    <CardDescription>Interactive map showing report locations and issue density</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="flex-shrink-0"
                  >
                    {isMapExpanded ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div
                    className={`${isMapExpanded ? "h-[calc(100vh-12rem)]" : "h-[600px]"} rounded-lg overflow-hidden`}
                  >
                    <ReportsMap reports={filteredReports} isExpanded={isMapExpanded} />
                  </div>
                </CardContent>
              </Card>

              {/* Reports List */}
              {!isMapExpanded && (
                <Card>
                  <CardHeader>
                    <CardTitle>स्थान के अनुसार रिपोर्ट / Reports by Location</CardTitle>
                    <CardDescription>{filteredReports.length} active reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredReports.length === 0 ? (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                          <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p>No reports with location data yet</p>
                          <p className="text-xs mt-2">Reports will appear here once citizens submit issues</p>
                        </div>
                      ) : (
                        filteredReports.map((report) => (
                          <a
                            key={report.id}
                            href={`/admin/reports/${report.id}`}
                            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                          >
                            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{report.complaint}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.address}</p>
                              <p className="text-xs text-muted-foreground mt-1 font-mono">
                                📍 {report.lat.toFixed(5)}, {report.lng.toFixed(5)}
                              </p>
                              <Badge variant="secondary" className={`mt-2 ${severityColors[report.severity]}`}>
                                {report.severity}
                              </Badge>
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
