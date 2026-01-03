"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollText, User, FileText, Shield, Activity, Clock, UserCheck, UserX } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { useEffect, useState } from "react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"

export default function AuditLogsPage() {
  const { t } = useLanguage()
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeUsers: 0,
    reportsCreated: 0,
    attendanceEvents: 0,
  })

  useEffect(() => {
    const loadAuditLogs = () => {
      const reports = getReportsFromStorage()
      const logs: any[] = []

      // Load attendance audit logs
      try {
        const attendanceAuditLogs = JSON.parse(localStorage.getItem("civicflow_audit_logs") || "[]")
        logs.push(...attendanceAuditLogs)
      } catch (error) {
        console.error("[v0] Failed to load attendance audit logs:", error)
      }

      // Load report events
      reports.forEach((report) => {
        // Add report submission event
        logs.push({
          id: `log_${report.id}_submit`,
          action: "REPORT_SUBMITTED",
          actor: report.profiles?.full_name || "Citizen",
          role: "Citizen",
          details: `New report #${report.id.slice(0, 8)} created - ${report.category}: ${report.complaint_text?.slice(0, 50)}...`,
          timestamp: report.created_at,
          type: "info",
        })

        // Add status change events from timeline
        if (report.timeline) {
          report.timeline.forEach((entry: any) => {
            logs.push({
              id: `log_timeline_${entry.id}`,
              action: entry.action.toUpperCase().replace(/\s+/g, "_"),
              actor: entry.actor_name || "System",
              role: entry.action.includes("verified")
                ? "Admin"
                : entry.action.includes("assigned")
                  ? "Admin"
                  : "Worker",
              details: `${entry.action} - Report #${report.id.slice(0, 8)}`,
              timestamp: entry.created_at,
              type: entry.action.includes("completed") || entry.action.includes("verified") ? "success" : "info",
            })
          })
        }
      })

      // Sort by timestamp descending (most recent first)
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setAuditLogs(logs)

      const attendanceEvents = logs.filter(
        (l) => l.action === "WORKER_CHECK_IN" || l.action === "WORKER_CHECK_OUT",
      ).length

      setStats({
        totalEvents: logs.length,
        activeUsers: new Set(logs.map((l) => l.actor)).size,
        reportsCreated: reports.length,
        attendanceEvents: attendanceEvents,
      })
    }

    // Initial load
    loadAuditLogs()

    // Set up real-time polling every 5 seconds
    const interval = setInterval(loadAuditLogs, 5000)

    // Listen for custom events
    const handleAttendanceUpdate = () => {
      console.log("[v0] Attendance updated, reloading audit logs")
      loadAuditLogs()
    }
    const handleReportsUpdate = () => {
      console.log("[v0] Reports updated, reloading audit logs")
      loadAuditLogs()
    }
    const handleAuditLogUpdate = () => {
      console.log("[v0] Audit log updated directly")
      loadAuditLogs()
    }

    window.addEventListener("attendanceUpdated", handleAttendanceUpdate)
    window.addEventListener("reportsUpdated", handleReportsUpdate)
    window.addEventListener("auditLogUpdated", handleAuditLogUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener("attendanceUpdated", handleAttendanceUpdate)
      window.removeEventListener("reportsUpdated", handleReportsUpdate)
      window.removeEventListener("auditLogUpdated", handleAuditLogUpdate)
    }
  }, [])

  const typeColors: Record<string, { bg: string; icon: any }> = {
    success: { bg: "bg-green-500/10 text-green-700", icon: Shield },
    info: { bg: "bg-blue-500/10 text-blue-700", icon: Activity },
    warning: { bg: "bg-orange-500/10 text-orange-700", icon: Activity },
    error: { bg: "bg-red-500/10 text-red-700", icon: Activity },
  }

  const getActionIcon = (action: string) => {
    if (action.includes("CHECK_IN")) return UserCheck
    if (action.includes("CHECK_OUT")) return UserX
    if (action.includes("REPORT")) return FileText
    return Activity
  }

  const getActionDisplay = (action: string) => {
    const actionMap: Record<string, string> = {
      WORKER_CHECK_IN: "Worker Check In",
      WORKER_CHECK_OUT: "Worker Check Out",
      REPORT_SUBMITTED: "Report Submitted",
      REPORT_ASSIGNED: "Report Assigned",
      REPORT_IN_PROGRESS: "Work In Progress",
      REPORT_COMPLETED: "Report Completed",
      REPORT_VERIFIED: "Report Verified",
    }
    return actionMap[action] || action.replace(/_/g, " ")
  }

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopNav userName="सुनीता मेहता / Sunita Mehta" />

        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{t("admin.audit")}</h1>
              <p className="text-muted-foreground mt-1">
                Complete system activity and security logs (Real-time monitoring)
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <ScrollText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground mt-1">All tracked activities</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Unique participants</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reports Created</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reportsCreated}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total submissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Events</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.attendanceEvents}</div>
                  <p className="text-xs text-muted-foreground mt-1">Worker check-ins/outs</p>
                </CardContent>
              </Card>
            </div>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Activity Timeline
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    Live
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Recent system events and user actions (Auto-refreshes every 5 seconds)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLogs.length > 0 ? (
                  <div className="space-y-4">
                    {auditLogs.slice(0, 100).map((log) => {
                      const ActionIcon = getActionIcon(log.action)
                      const typeColor = typeColors[log.type]?.bg || "bg-gray-500/10"

                      return (
                        <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="flex-shrink-0 mt-1">
                            <div className={`p-2 rounded-full ${typeColor}`}>
                              <ActionIcon className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium">{getActionDisplay(log.action)}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {log.details.duration_minutes && (
                                    <span className="font-medium text-blue-600 mr-2">
                                      Duration: {Math.floor(log.details.duration_minutes / 60)}h{" "}
                                      {log.details.duration_minutes % 60}m
                                    </span>
                                  )}
                                  {typeof log.details === "string"
                                    ? log.details
                                    : JSON.stringify(log.details, null, 2).slice(0, 150)}
                                </p>
                                <div className="flex items-center gap-3 mt-2 flex-wrap">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {log.user_name || log.actor}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {log.user_role || log.role}
                                  </Badge>
                                  {log.ip_address && (
                                    <span className="text-xs text-muted-foreground">IP: {log.ip_address}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No audit logs available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Activity will appear here as users interact with the system
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
