"use client"

import { useState, useEffect } from "react"
import { WorkerNavHeader } from "@/components/worker/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ClipboardList, MapPin, CheckCircle2 } from "lucide-react"
import { getReportsFromStorage, updateReportInStorage, type StoredReport } from "@/lib/utils/reports-storage"

export default function WorkerTasksPage() {
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

  const assignedTasks = reports.filter(
    (r) => r.status === "submitted" || r.status === "assigned" || r.status === "in_progress",
  )

  const completedTasks = reports.filter((r) => r.status === "completed" || r.status === "verified")

  const handleMarkComplete = (taskId: string) => {
    updateReportInStorage(taskId, {
      status: "completed",
      completed_at: new Date().toISOString(),
    })
  }

  const profile = { full_name: "राजेश वर्मा / Rajesh Verma", role: "worker" }
  const unreadNotifications = 0

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-500/10 text-blue-700",
    assigned: "bg-purple-500/10 text-purple-700",
    in_progress: "bg-yellow-500/10 text-yellow-700",
    completed: "bg-green-500/10 text-green-700",
    verified: "bg-green-600/10 text-green-800",
  }

  const severityColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-700",
    medium: "bg-yellow-500/10 text-yellow-700",
    high: "bg-orange-500/10 text-orange-700",
    critical: "bg-red-500/10 text-red-700",
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerNavHeader userName={profile.full_name} unreadCount={unreadNotifications || 0} />

      <main className="container px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>All your assigned and completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="assigned" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="assigned">Assigned ({assignedTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
              </TabsList>

              {/* Assigned Tasks */}
              <TabsContent value="assigned" className="space-y-4">
                {assignedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No assigned tasks</h3>
                    <p className="text-sm text-muted-foreground">You are all caught up</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignedTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                        {task.report_images && task.report_images[0] ? (
                          <img
                            src={task.report_images[0].image_url || "/placeholder.svg"}
                            alt="Task"
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            <ClipboardList className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link
                              href={`/citizen/reports/${task.id}`}
                              className="font-medium line-clamp-2 hover:underline"
                            >
                              {task.complaint_text}
                            </Link>
                            <Badge variant="outline" className={statusColors[task.status]}>
                              {task.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {task.address || "Location pending"}
                            </span>
                            {task.category && <Badge variant="secondary">{task.category.replace("_", " ")}</Badge>}
                            {task.severity_level && (
                              <Badge variant="secondary" className={severityColors[task.severity_level]}>
                                {task.severity_level}
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleMarkComplete(task.id)}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Mark as Complete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Completed Tasks */}
              <TabsContent value="completed" className="space-y-4">
                {completedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No completed tasks</h3>
                    <p className="text-sm text-muted-foreground">Complete your first task to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedTasks.map((task) => (
                      <Link
                        key={task.id}
                        href={`/citizen/reports/${task.id}`}
                        className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        {task.report_images && task.report_images[0] ? (
                          <img
                            src={task.report_images[0].image_url || "/placeholder.svg"}
                            alt="Task"
                            className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            <ClipboardList className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium line-clamp-2">{task.complaint_text}</p>
                            <Badge variant="outline" className={statusColors[task.status]}>
                              {task.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {task.address || "Location pending"}
                            </span>
                            {task.completed_at && (
                              <span>Completed: {new Date(task.completed_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
