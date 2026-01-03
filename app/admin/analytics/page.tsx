"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown, Users, Clock, MapPin, Calendar, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { useEffect, useState } from "react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const [analytics, setAnalytics] = useState<any>({
    totalReports: 0,
    avgResolution: "0h",
    activeWorkers: 0,
    satisfaction: 0,
    topLocations: [],
    categoryBreakdown: [],
    monthlyTrend: [],
    severityBreakdown: [],
  })

  useEffect(() => {
    const reports = getReportsFromStorage()

    // Simulate large-scale data (multiply real data for demo)
    const scaleFactor = reports.length > 0 ? Math.max(10000 / reports.length, 100) : 100
    const scaledTotal = reports.length * scaleFactor

    // Calculate average resolution time
    const completedReports = reports.filter((r) => r.status === "completed" || r.status === "verified")
    let avgHours = 24.5
    if (completedReports.length > 0) {
      const totalHours = completedReports.reduce((sum, r) => {
        const created = new Date(r.created_at).getTime()
        const verified = new Date(r.verified_at || r.updated_at).getTime()
        return sum + (verified - created) / (1000 * 60 * 60)
      }, 0)
      avgHours = totalHours / completedReports.length
    }

    // Top locations from real data
    const locationCounts: Record<string, number> = {}
    reports.forEach((r) => {
      const location = r.address?.split(",")[0] || "Unknown"
      locationCounts[location] = (locationCounts[location] || 0) + 1
    })
    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([area, count], idx) => ({
        area,
        reports: count * Math.floor(scaleFactor / 10),
        trend: idx % 2 === 0 ? `+${8 + idx * 2}%` : `-${3 + idx}%`,
      }))

    // Category breakdown from real data
    const categoryCounts: Record<string, number> = {}
    reports.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1
    })
    const total = reports.length || 1
    const categoryBreakdown = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name: name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        count: count * Math.floor(scaleFactor / 10),
        percentage: Math.round((count / total) * 100),
      }))

    // Severity breakdown
    const severityCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 }
    reports.forEach((r) => {
      severityCounts[r.severity_level] = (severityCounts[r.severity_level] || 0) + 1
    })
    const severityBreakdown = Object.entries(severityCounts).map(([level, count]) => ({
      level,
      count: count * Math.floor(scaleFactor / 10),
      percentage: Math.round((count / (reports.length || 1)) * 100),
    }))

    // Monthly trend - simulate 6 months of growing data
    const monthlyTrend = [
      { month: "Aug '24", count: Math.floor(scaledTotal * 0.5), growth: 12 },
      { month: "Sep '24", count: Math.floor(scaledTotal * 0.6), growth: 18 },
      { month: "Oct '24", count: Math.floor(scaledTotal * 0.7), growth: 15 },
      { month: "Nov '24", count: Math.floor(scaledTotal * 0.8), growth: 22 },
      { month: "Dec '24", count: Math.floor(scaledTotal * 0.9), growth: 28 },
      { month: "Jan '25", count: scaledTotal, growth: 35 },
    ]

    setAnalytics({
      totalReports: scaledTotal,
      avgResolution: `${avgHours.toFixed(1)}h`,
      activeWorkers: 124,
      satisfaction: 94,
      topLocations,
      categoryBreakdown,
      monthlyTrend,
      severityBreakdown,
    })
  }, [])

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopNav userName="सुनीता मेहता / Sunita Mehta" />

        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{t("admin.analytics")}</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive insights from {(analytics.totalReports / 1000).toFixed(1)}K+ reports
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalReports.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" /> +35% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.avgResolution}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-500" /> 15% faster
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.activeWorkers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.satisfaction}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Citizen satisfaction rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Top Reporting Areas
                  </CardTitle>
                  <CardDescription>Hotspot areas with most civic issues</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.topLocations.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.topLocations.map((location: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{location.area}</p>
                              <p className="text-xs text-muted-foreground">{location.reports} reports</p>
                            </div>
                          </div>
                          <span
                            className={`text-sm font-medium ${location.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {location.trend}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No location data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Report Categories
                  </CardTitle>
                  <CardDescription>Distribution by issue type</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.categoryBreakdown.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.categoryBreakdown.map((category: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-muted-foreground">
                              {category.count} ({category.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${category.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No category data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Severity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Severity Distribution
                  </CardTitle>
                  <CardDescription>Reports categorized by urgency level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.severityBreakdown.map((item: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{item.level}</span>
                          <span className="text-muted-foreground">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              item.level === "critical"
                                ? "bg-red-500"
                                : item.level === "high"
                                  ? "bg-orange-500"
                                  : item.level === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Monthly Growth Trend
                  </CardTitle>
                  <CardDescription>Report submissions over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px] flex items-end justify-around gap-2">
                    {analytics.monthlyTrend.map((data: any, index: number) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-primary rounded-t-lg transition-all hover:bg-primary/80 cursor-pointer relative group"
                          style={{
                            height: `${(data.count / Math.max(...analytics.monthlyTrend.map((d: any) => d.count))) * 100}%`,
                            minHeight: "40px",
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {data.count.toLocaleString()} reports
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium">{(data.count / 1000).toFixed(1)}K</p>
                          <p className="text-xs text-muted-foreground">{data.month}</p>
                          <p className="text-xs text-green-600">+{data.growth}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1.2L - 1.8L</div>
                  <p className="text-xs text-muted-foreground mt-1">Peak traffic: 5-7 PM</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">92.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">Reports addressed within SLA</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Platform Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">99.8%</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days availability</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
