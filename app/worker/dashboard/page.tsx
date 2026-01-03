"use client"

import { useState, useEffect } from "react"
import { WorkerNavHeader } from "@/components/worker/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ClipboardList, CheckCircle2, Clock, Coins, MapPin } from "lucide-react"
import { getReportsFromStorage, updateReportInStorage, type StoredReport } from "@/lib/utils/reports-storage"

export default function WorkerDashboard() {
  const [reports, setReports] = useState<StoredReport[]>([])

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

  const assignedTasks = reports
    .filter((r) => r.status === "submitted" || r.status === "assigned" || r.status === "in_progress")
    .slice(0, 3) // Show first 3

  const completedTasks = reports.filter((r) => r.status === "completed" || r.status === "verified")
  const completedToday = completedTasks.filter((r) => {
    const completedDate = new Date(r.completed_at || r.updated_at || "")
    const today = new Date()
    return completedDate.toDateString() === today.toDateString()
  }).length

  const profile = { full_name: "राजेश वर्मा / Rajesh Verma", role: "worker" as const }
  const worker = {
    current_tasks_count: assignedTasks.length,
    total_completed_tasks: completedTasks.length,
    department: "PWD (सार्वजनिक निर्माण विभाग)",
  }
  const wallet = { points_balance: completedTasks.length * 10 }
  const unreadNotifications = 1

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-500/10 text-blue-700",
    assigned: "bg-purple-500/10 text-purple-700",
    in_progress: "bg-yellow-500/10 text-yellow-700",
    completed: "bg-green-500/10 text-green-700",
  }

  const severityColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-700",
    medium: "bg-yellow-500/10 text-yellow-700",
    high: "bg-orange-500/10 text-orange-700",
    critical: "bg-red-500/10 text-red-700",
  }

  const handleMarkComplete = (taskId: string) => {
    updateReportInStorage(taskId, {
      status: "completed",
      completed_at: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerNavHeader userName={profile.full_name} unreadCount={unreadNotifications} />

      <main className="container px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold">नमस्ते, {profile.full_name}!</h1>
            <p className="text-muted-foreground mt-1">
              {worker.department && `विभाग / Department: ${worker.department}`}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">सौंपे गए कार्य / Assigned Tasks</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{worker.current_tasks_count || 0}</div>
                <p className="text-xs text-muted-foreground">Current active tasks</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">आज समाप्त किए गए / Completed Today</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedToday || 0}</div>
                <p className="text-xs text-muted-foreground">Tasks finished today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">कुल समाप्त किए गए / Total Completed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{worker.total_completed_tasks || 0}</div>
                <p className="text-xs text-muted-foreground">All-time completions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">कमाई / Earnings</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wallet.points_balance || 0}</div>
                <p className="text-xs text-muted-foreground">Points earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>सौंपे गए कार्य / Assigned Tasks</CardTitle>
                  <CardDescription>Tasks waiting for your action</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/worker/tasks">सभी देखें / View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {assignedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">कोई कार्य नहीं / No tasks assigned</h3>
                  <p className="text-sm text-muted-foreground">Check back later for new assignments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      {task.report_images && task.report_images[0] ? (
                        <img
                          src={task.report_images[0].image_url || "/placeholder.svg"}
                          alt="Task"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                          <ClipboardList className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/citizen/reports/${task.id}`}
                            className="font-medium line-clamp-2 hover:underline"
                          >
                            {task.complaint_text}
                          </Link>
                          {task.severity_level && (
                            <Badge variant="secondary" className={severityColors[task.severity_level]}>
                              {task.severity_level}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {task.address || "Location pending"}
                          </span>
                          <Badge variant="outline" className={statusColors[task.status]}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleMarkComplete(task.id)}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            पूर्ण करें / Mark Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
