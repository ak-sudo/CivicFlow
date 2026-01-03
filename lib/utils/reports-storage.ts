import type { Report } from "@/lib/types/database"

export interface ReportTimeline {
  id: string
  action: string
  created_at: string
  actor_name?: string
  details?: any
}

export interface StoredReport extends Report {
  timeline?: ReportTimeline[]
  report_images?: Array<{
    id: string
    report_id: string
    image_url: string
    image_type: string
    geotag_latitude?: number
    geotag_longitude?: number
    uploaded_by: string
    created_at: string
  }>
  profiles?: {
    id: string
    full_name: string
    role: string
  }
  verified_at?: string
}

const REPORTS_KEY = "civicflow_reports"

export function getReportsFromStorage(): StoredReport[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(REPORTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveReportToStorage(report: StoredReport): void {
  if (typeof window === "undefined") return
  try {
    const reports = getReportsFromStorage()

    if (!report.timeline) {
      report.timeline = [
        {
          id: `timeline_${Date.now()}`,
          action: "Report submitted",
          created_at: new Date().toISOString(),
          actor_name: report.profiles?.full_name || "Citizen",
          details: {
            category: report.category,
            severity: report.severity_level,
            ai_confidence: report.ai_analysis?.category_confidence,
          },
        },
      ]
    }

    reports.unshift(report)
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))

    window.dispatchEvent(new CustomEvent("reportsUpdated", { detail: { reports } }))
  } catch (error) {
    console.error("Failed to save report to localStorage:", error)
  }
}

export function updateReportInStorage(reportId: string, updates: Partial<StoredReport>): void {
  if (typeof window === "undefined") return
  try {
    const reports = getReportsFromStorage()
    const index = reports.findIndex((r) => r.id === reportId)
    if (index !== -1) {
      if (updates.status && updates.status !== reports[index].status) {
        const newTimelineEntry: ReportTimeline = {
          id: `timeline_${Date.now()}`,
          action: `Status changed to ${updates.status}`,
          created_at: new Date().toISOString(),
          actor_name: updates.status === "completed" ? "Worker" : "System",
        }
        reports[index].timeline = reports[index].timeline || []
        reports[index].timeline.unshift(newTimelineEntry)
      }

      if (updates.status === "completed" || updates.status === "verified") {
        updates.verified_at = new Date().toISOString()
      }

      reports[index] = { ...reports[index], ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
      window.dispatchEvent(new CustomEvent("reportsUpdated", { detail: { reports } }))
    }
  } catch (error) {
    console.error("Failed to update report in localStorage:", error)
  }
}

export function getReportById(reportId: string): StoredReport | null {
  const reports = getReportsFromStorage()
  return reports.find((r) => r.id === reportId) || null
}
