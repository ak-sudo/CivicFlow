"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle, MapPin, Calendar } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { useState, useEffect } from "react"
import { getReportsFromStorage, updateReportInStorage } from "@/lib/utils/reports-storage"
import { toast } from "sonner"

export default function HumanReviewPage() {
  const { t } = useLanguage()
  const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    const allReports = getReportsFromStorage()
    const reviewNeeded = allReports.filter(
      (r) =>
        r.status === "needs_human_review" ||
        (r.ai_analysis?.category_confidence && r.ai_analysis.category_confidence < 0.75),
    )
    setReports(reviewNeeded)
  }, [])

  const handleApprove = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    updateReportInStorage(reportId, {
      status: "submitted",
      verified_at: new Date().toISOString(),
    })

    // Add timeline entry
    const updatedReport = getReportsFromStorage().find((r) => r.id === reportId)
    if (updatedReport) {
      const newTimeline = [
        {
          id: `timeline_${Date.now()}`,
          action: "Report approved by admin after manual review",
          created_at: new Date().toISOString(),
          actor_name: "सुनीता मेहता / Sunita Mehta (Admin)",
          details: { previous_status: "needs_human_review", new_status: "submitted" },
        },
        ...(updatedReport.timeline || []),
      ]
      updateReportInStorage(reportId, { timeline: newTimeline })
    }

    setReports(reports.filter((r) => r.id !== reportId))
    toast.success("Report approved and moved to submission queue")
  }

  const handleReject = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    updateReportInStorage(reportId, {
      status: "rejected",
    })

    // Add timeline entry
    const updatedReport = getReportsFromStorage().find((r) => r.id === reportId)
    if (updatedReport) {
      const newTimeline = [
        {
          id: `timeline_${Date.now()}`,
          action: "Report rejected by admin after manual review",
          created_at: new Date().toISOString(),
          actor_name: "सुनीता मेहता / Sunita Mehta (Admin)",
          details: { reason: "Does not meet quality standards or invalid report" },
        },
        ...(updatedReport.timeline || []),
      ]
      updateReportInStorage(reportId, { timeline: newTimeline })
    }

    setReports(reports.filter((r) => r.id !== reportId))
    toast.success("Report rejected")
  }

  const severityColors: Record<string, string> = {
    low: "bg-green-500/10 text-green-700",
    medium: "bg-yellow-500/10 text-yellow-700",
    high: "bg-orange-500/10 text-orange-700",
    critical: "bg-red-500/10 text-red-700",
  }

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopNav userName="सुनीता मेहता / Sunita Mehta" />

        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold">{t("admin.review")}</h1>
              <p className="text-muted-foreground mt-1">Citizen-submitted reports requiring manual verification</p>
            </div>

            {reports.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">No reports need human review at this time</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reports.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <CardHeader className="bg-orange-50 dark:bg-orange-950/20 border-b">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            <CardTitle className="text-lg">Manual Review Required</CardTitle>
                          </div>
                          <CardDescription>
                            AI Confidence:{" "}
                            {report.ai_analysis?.category_confidence
                              ? (report.ai_analysis.category_confidence * 100).toFixed(0)
                              : "N/A"}
                            %
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className={severityColors[report.severity_level]}>
                          {report.severity_level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Image */}
                        <div>
                          {report.report_images && report.report_images[0] ? (
                            <img
                              src={report.report_images[0].image_url || "/placeholder.svg"}
                              alt="Report"
                              className="w-full aspect-video object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-full aspect-video bg-muted rounded-lg border flex items-center justify-center">
                              <p className="text-muted-foreground">No image available</p>
                            </div>
                          )}
                          <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{report.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(report.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-2">Report Description</h3>
                            <p className="text-sm">{report.complaint_text}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">AI Analysis</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Category:</span>
                                <span className="font-medium">{report.category.replace("_", " ")}</span>
                              </div>
                              {report.ai_analysis?.category_confidence && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Confidence:</span>
                                  <span className="font-medium">
                                    {(report.ai_analysis.category_confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              )}
                              {report.ai_analysis?.category_confidence &&
                                report.ai_analysis.category_confidence < 0.75 && (
                                  <div className="mt-3 p-3 bg-muted rounded-md">
                                    <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                                      ⚠️ AI confidence below threshold - manual verification required
                                    </p>
                                  </div>
                                )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">Reporter</h3>
                            <p className="text-sm text-muted-foreground">
                              {report.profiles?.full_name || "Anonymous Citizen"}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4">
                            <Button onClick={() => handleApprove(report.id)} className="flex-1 gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Approve & Process
                            </Button>
                            <Button
                              onClick={() => handleReject(report.id)}
                              variant="destructive"
                              className="flex-1 gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
