"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, Clock, AlertTriangle, TrendingUp, Users, ThumbsUp, ThumbsDown } from "lucide-react"
import { useEffect, useState } from "react"
import { getReportsFromStorage, type StoredReport } from "@/lib/utils/reports-storage"
import { getReportVotingStats } from "@/lib/utils/civicbook-storage"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [reports, setReports] = useState<StoredReport[]>([])
  const [votingStats, setVotingStats] = useState<Map<string, { upvotes: number; downvotes: number }>>(new Map())
  const profile = { full_name: "Demo Admin", role: "admin" as const }

  useEffect(() => {
    loadData()

    // Listen for updates
    const handleUpdate = () => {
      loadData()
    }
    window.addEventListener("reportsUpdated", handleUpdate)
    window.addEventListener("civicbookVotesUpdated", handleUpdate)
    return () => {
      window.removeEventListener("reportsUpdated", handleUpdate)
      window.removeEventListener("civicbookVotesUpdated", handleUpdate)
    }
  }, [])

  const loadData = () => {
    const loadedReports = getReportsFromStorage()
    setReports(loadedReports)
    const stats = getReportVotingStats()
    setVotingStats(stats)
  }

  // Calculate statistics from localStorage data
  const totalReports = reports.length
  const openReports = reports.filter((r) => !["completed", "verified"].includes(r.status)).length
  const verifiedToday = reports.filter(
    (r) =>
      ["completed", "verified"].includes(r.status) &&
      r.updated_at &&
      new Date(r.updated_at).toDateString() === new Date().toDateString(),
  ).length
  const needsReview = reports.filter((r) => r.needs_human_review).length
  const avgResolutionTime = "24"

  const totalVotes = Array.from(votingStats.values()).reduce((acc, stats) => acc + stats.upvotes + stats.downvotes, 0)
  const totalUpvotes = Array.from(votingStats.values()).reduce((acc, stats) => acc + stats.upvotes, 0)
  const totalDownvotes = Array.from(votingStats.values()).reduce((acc, stats) => acc + stats.downvotes, 0)
  const communityVerifiedReports = Array.from(votingStats.entries()).filter(([_, stats]) => stats.upvotes > 2).length

  // Get recent reports with voting data (last 5)
  const recentReportsWithVotes = reports.slice(0, 5).map((report) => ({
    ...report,
    votes: votingStats.get(report.id) || { upvotes: 0, downvotes: 0 },
    communityScore: (votingStats.get(report.id)?.upvotes || 0) - (votingStats.get(report.id)?.downvotes || 0),
  }))

  const topValidatedIssues = reports
    .map((report) => {
      const votes = votingStats.get(report.id) || { upvotes: 0, downvotes: 0 }
      return {
        ...report,
        votes,
        communityScore: votes.upvotes - votes.downvotes,
      }
    })
    .filter((r) => r.communityScore > 0)
    .sort((a, b) => b.communityScore - a.communityScore)
    .slice(0, 5)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-y-auto">
        <AdminTopNav userName={profile.full_name} />

        <main className="flex-1 p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of all civic reports and system metrics</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Open Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openReports}</div>
                <p className="text-xs text-muted-foreground">
                  {totalReports} total • {totalReports > 0 ? Math.round((openReports / totalReports) * 100) : 0}% open
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedToday}</div>
                <p className="text-xs text-muted-foreground">Verified and completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgResolutionTime}h</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500" /> Based on completed reports
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needs Human Review</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{needsReview}</div>
                <p className="text-xs text-muted-foreground">AI flagged for review</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Votes</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVotes}</div>
                <p className="text-xs text-muted-foreground">Total community engagement</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Validated Issues</CardTitle>
                <ThumbsUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalUpvotes}</div>
                <p className="text-xs text-muted-foreground">{communityVerifiedReports} reports with 3+ upvotes</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged as Fake</CardTitle>
                <ThumbsDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalDownvotes}</div>
                <p className="text-xs text-muted-foreground">Community reported as fake</p>
              </CardContent>
            </Card>
          </div>

          {topValidatedIssues.length > 0 && (
            <Card className="border-2 border-accent/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Top Community-Validated Issues
                </CardTitle>
                <CardDescription>Issues with highest community verification scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topValidatedIssues.map((report) => (
                    <a
                      key={report.id}
                      href={`/admin/reports/${report.id}`}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {report.report_images && report.report_images[0] ? (
                        <img
                          src={report.report_images[0].image_url || "/placeholder.svg"}
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
                          <Badge className="bg-accent shrink-0">+{report.communityScore} Score</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.profiles?.full_name || "Anonymous"} • {report.location}
                        </p>
                        <div className="mt-2 flex gap-3 items-center">
                          <div className="flex items-center gap-1 text-sm">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {report.votes.upvotes}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <ThumbsDown className="h-4 w-4 text-red-500" />
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {report.votes.downvotes}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              report.severity_level === "critical"
                                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                : report.severity_level === "high"
                                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {report.severity_level?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest submissions from citizens with community feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {recentReportsWithVotes.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No reports yet. Citizens can submit reports to see them here.
                </p>
              ) : (
                <div className="space-y-4">
                  {recentReportsWithVotes.map((report) => (
                    <a
                      key={report.id}
                      href={`/admin/reports/${report.id}`}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {report.report_images && report.report_images[0] ? (
                        <img
                          src={report.report_images[0].image_url || "/placeholder.svg"}
                          alt="Report"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-2">{report.complaint_text}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {report.profiles?.full_name || "Anonymous"} • {new Date(report.created_at).toLocaleString()}
                        </p>
                        <div className="mt-2 flex gap-2 flex-wrap items-center">
                          {(report.votes.upvotes > 0 || report.votes.downvotes > 0) && (
                            <>
                              <div className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-950 px-2 py-1 rounded">
                                <ThumbsUp className="h-3 w-3 text-green-600" />
                                <span className="font-semibold">{report.votes.upvotes}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-950 px-2 py-1 rounded">
                                <ThumbsDown className="h-3 w-3 text-red-600" />
                                <span className="font-semibold">{report.votes.downvotes}</span>
                              </div>
                              {report.communityScore > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  Community Score: +{report.communityScore}
                                </Badge>
                              )}
                            </>
                          )}
                          {report.ai_analysis && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              AI: {(report.ai_analysis.category_confidence * 100).toFixed(0)}% confident
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              report.severity_level === "critical"
                                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                : report.severity_level === "high"
                                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {report.severity_level?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Reports Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalReports}</div>
                <p className="text-sm text-muted-foreground mt-1">Total reports submitted by citizens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Processing Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Auto-classified:</span>
                  <span className="font-medium">
                    {totalReports > 0
                      ? Math.round((reports.filter((r) => r.ai_analysis).length / totalReports) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">High confidence:</span>
                  <span className="font-medium">
                    {totalReports > 0
                      ? Math.round(
                          (reports.filter((r) => r.ai_analysis && r.ai_analysis.category_confidence > 0.8).length /
                            totalReports) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Critical issues:</span>
                  <span className="font-medium">{reports.filter((r) => r.severity_level === "critical").length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
