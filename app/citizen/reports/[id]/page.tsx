"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, CheckCircle2, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getReportById, type StoredReport } from "@/lib/utils/reports-storage"

export default function ReportDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [report, setReport] = useState<StoredReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReport = () => {
      const storedReport = getReportById(id)
      if (!storedReport) {
        router.push("/citizen/my-reports")
        return
      }
      setReport(storedReport)
      setIsLoading(false)
    }

    loadReport()

    // Listen for report updates
    const handleReportsUpdate = () => {
      loadReport()
    }
    window.addEventListener("reportsUpdated", handleReportsUpdate)
    return () => window.removeEventListener("reportsUpdated", handleReportsUpdate)
  }, [id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader userName="Loading..." unreadCount={0} />
        <main className="container px-4 md:px-6 py-8">
          <div className="text-center py-12">Loading report details...</div>
        </main>
      </div>
    )
  }

  if (!report) {
    return null
  }

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
      <NavHeader userName={report.profiles?.full_name || "Demo Citizen"} unreadCount={0} />

      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Report Details</h1>
              <p className="text-muted-foreground mt-1">ID: {report.id.slice(0, 8)}</p>
            </div>
            <Badge variant="outline" className={statusColors[report.status]}>
              {report.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              {report.report_images && report.report_images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {report.report_images.map((img: any) => (
                        <div key={img.id} className="relative">
                          <img
                            src={img.image_url || "/placeholder.svg"}
                            alt="Report"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <Badge className="absolute top-2 right-2">{img.image_type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Issue Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{report.complaint_text}</p>
                </CardContent>
              </Card>

              {/* AI Analysis */}
              {report.ai_analysis && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis Results</CardTitle>
                      <CardDescription>Comprehensive automated assessment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Detected Category</p>
                          <p className="font-medium capitalize text-lg">
                            {report.ai_analysis.predicted_category?.replace("_", " ") || "Pending"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">AI Confidence</p>
                          <p className="font-medium text-lg">
                            {report.ai_analysis.category_confidence
                              ? `${Math.round(report.ai_analysis.category_confidence * 100)}%`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {report.ai_analysis.description && (
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-2">Description</p>
                          <p className="text-foreground leading-relaxed">{report.ai_analysis.description}</p>
                        </div>
                      )}

                      {/* Measurements */}
                      {report.ai_analysis.measurements && (
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-2">Measurements</p>
                          <div className="grid grid-cols-2 gap-3">
                            {report.ai_analysis.measurements.pothole_depth_cm && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground">Pothole Depth</p>
                                <p className="font-semibold">{report.ai_analysis.measurements.pothole_depth_cm} cm</p>
                              </div>
                            )}
                            {report.ai_analysis.measurements.garbage_volume_cubic_meters && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground">Garbage Volume</p>
                                <p className="font-semibold">
                                  {report.ai_analysis.measurements.garbage_volume_cubic_meters} m³
                                </p>
                              </div>
                            )}
                            {report.ai_analysis.measurements.affected_area_square_meters && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground">Affected Area</p>
                                <p className="font-semibold">
                                  {report.ai_analysis.measurements.affected_area_square_meters} m²
                                </p>
                              </div>
                            )}
                            {report.ai_analysis.measurements.is_dead_animal && (
                              <div className="p-3 bg-red-500/10 rounded-lg">
                                <p className="text-xs text-red-700">Dead Animal Detected</p>
                                <p className="font-semibold text-red-700">Yes</p>
                              </div>
                            )}
                            {report.ai_analysis.measurements.is_low_light_area && (
                              <div className="p-3 bg-yellow-500/10 rounded-lg">
                                <p className="text-xs text-yellow-700">Low Light Area</p>
                                <p className="font-semibold text-yellow-700">Yes</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Health Risks */}
                      {report.ai_analysis.health_risks && report.ai_analysis.health_risks.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-2">Health Risks</p>
                          <div className="flex flex-wrap gap-2">
                            {report.ai_analysis.health_risks.map((risk: string, i: number) => (
                              <Badge key={i} variant="destructive">
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Resolution Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resolution Plan</CardTitle>
                      <CardDescription>Expected timeline and action steps</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Expected Resolution</p>
                          <p className="font-medium">{report.ai_analysis.expected_resolution_time || "Pending"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Assigned Department</p>
                          <p className="font-medium">{report.ai_analysis.assigned_department || "Pending"}</p>
                        </div>
                      </div>

                      {report.ai_analysis.possible_cause && (
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-2">Possible Cause</p>
                          <p className="text-foreground">{report.ai_analysis.possible_cause}</p>
                        </div>
                      )}

                      {report.ai_analysis.next_steps && report.ai_analysis.next_steps.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-2">Next Steps</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {report.ai_analysis.next_steps.map((step: string, i: number) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Work Order */}
                  {report.ai_analysis.work_order && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Order Details</CardTitle>
                        <CardDescription>Resource allocation and requirements</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Priority</p>
                            <Badge
                              variant={report.ai_analysis.work_order.priority === "high" ? "destructive" : "secondary"}
                            >
                              {report.ai_analysis.work_order.priority}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated Workers</p>
                            <p className="font-medium">{report.ai_analysis.work_order.estimated_workers || "TBD"}</p>
                          </div>
                          {report.ai_analysis.work_order.estimated_duration_hours && (
                            <div>
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="font-medium">{report.ai_analysis.work_order.estimated_duration_hours}h</p>
                            </div>
                          )}
                        </div>

                        {report.ai_analysis.work_order.required_equipment &&
                          report.ai_analysis.work_order.required_equipment.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground font-medium mb-2">Required Equipment</p>
                              <div className="flex flex-wrap gap-2">
                                {report.ai_analysis.work_order.required_equipment.map((eq: string, i: number) => (
                                  <Badge key={i} variant="outline">
                                    {eq}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                        {report.ai_analysis.work_order.safety_precautions &&
                          report.ai_analysis.work_order.safety_precautions.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground font-medium mb-2">Safety Precautions</p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {report.ai_analysis.work_order.safety_precautions.map((sp: string, i: number) => (
                                  <li key={i}>{sp}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {report.ai_analysis.work_order.estimated_cost_inr && (
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated Cost</p>
                            <p className="font-medium text-lg">₹{report.ai_analysis.work_order.estimated_cost_inr}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Root Cause Analysis */}
                  {report.ai_analysis.root_cause_analysis && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Root Cause Analysis (Issue DNA)</CardTitle>
                        <CardDescription>Understanding the underlying problem</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {report.ai_analysis.root_cause_analysis.primary_cause && (
                          <div>
                            <p className="text-sm text-muted-foreground font-medium mb-1">Primary Cause</p>
                            <p className="text-foreground">{report.ai_analysis.root_cause_analysis.primary_cause}</p>
                          </div>
                        )}

                        {report.ai_analysis.root_cause_analysis.contributing_factors &&
                          report.ai_analysis.root_cause_analysis.contributing_factors.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground font-medium mb-2">Contributing Factors</p>
                              <div className="flex flex-wrap gap-2">
                                {report.ai_analysis.root_cause_analysis.contributing_factors.map(
                                  (factor: string, i: number) => (
                                    <Badge key={i} variant="secondary">
                                      {factor}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {report.ai_analysis.root_cause_analysis.prevention_measures &&
                          report.ai_analysis.root_cause_analysis.prevention_measures.length > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground font-medium mb-2">Prevention Measures</p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {report.ai_analysis.root_cause_analysis.prevention_measures.map(
                                  (measure: string, i: number) => (
                                    <li key={i}>{measure}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          {report.ai_analysis.root_cause_analysis.recurring_issue !== undefined && (
                            <div>
                              <p className="text-sm text-muted-foreground">Recurring Issue</p>
                              <Badge
                                variant={
                                  report.ai_analysis.root_cause_analysis.recurring_issue ? "destructive" : "secondary"
                                }
                              >
                                {report.ai_analysis.root_cause_analysis.recurring_issue ? "Yes" : "No"}
                              </Badge>
                            </div>
                          )}
                          {report.ai_analysis.root_cause_analysis.similar_issues_in_area !== undefined && (
                            <div>
                              <p className="text-sm text-muted-foreground">Similar Issues Nearby</p>
                              <p className="font-medium">
                                {report.ai_analysis.root_cause_analysis.similar_issues_in_area}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Health Hazard Predictions */}
                  {report.ai_analysis.health_hazard_predictions && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Health Hazard Predictions</CardTitle>
                        <CardDescription>AI-predicted risk assessments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Mosquito Breeding Risk</p>
                            <Badge
                              variant={
                                report.ai_analysis.health_hazard_predictions.mosquito_breeding_risk === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {report.ai_analysis.health_hazard_predictions.mosquito_breeding_risk}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Contamination Risk</p>
                            <Badge
                              variant={
                                report.ai_analysis.health_hazard_predictions.contamination_risk === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {report.ai_analysis.health_hazard_predictions.contamination_risk}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Accident Risk</p>
                            <Badge
                              variant={
                                report.ai_analysis.health_hazard_predictions.accident_risk === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {report.ai_analysis.health_hazard_predictions.accident_risk}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Crime Risk (Darkness)</p>
                            <Badge
                              variant={
                                report.ai_analysis.health_hazard_predictions.crime_risk_due_to_darkness === "high"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {report.ai_analysis.health_hazard_predictions.crime_risk_due_to_darkness}
                            </Badge>
                          </div>
                        </div>
                        {report.ai_analysis.health_hazard_predictions.overall_risk_score !== undefined && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                                <div
                                  className={`h-full ${
                                    report.ai_analysis.health_hazard_predictions.overall_risk_score > 75
                                      ? "bg-red-500"
                                      : report.ai_analysis.health_hazard_predictions.overall_risk_score > 50
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{
                                    width: `${report.ai_analysis.health_hazard_predictions.overall_risk_score}%`,
                                  }}
                                />
                              </div>
                              <span className="font-semibold text-lg">
                                {report.ai_analysis.health_hazard_predictions.overall_risk_score}/100
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription>Status updates and activity log</CardDescription>
                </CardHeader>
                <CardContent>
                  {report.timeline && report.timeline.length > 0 ? (
                    <div className="space-y-4">
                      {report.timeline.map((entry: any, index: number) => (
                        <div key={entry.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {index === 0 ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            </div>
                            {index < report.timeline.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium">{entry.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(entry.created_at).toLocaleString()}
                            </p>
                            {entry.actor_name && <p className="text-sm text-muted-foreground">by {entry.actor_name}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No activity yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant="outline" className={statusColors[report.status]}>
                      {report.status.replace("_", " ")}
                    </Badge>
                  </div>
                  {report.category && (
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium capitalize">{report.category.replace("_", " ")}</p>
                    </div>
                  )}
                  {report.severity_level && (
                    <div>
                      <p className="text-sm text-muted-foreground">Severity</p>
                      <Badge variant="secondary" className={severityColors[report.severity_level]}>
                        {report.severity_level}
                        {report.severity_score && ` (${report.severity_score}/100)`}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{new Date(report.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{report.address || `${report.latitude}, ${report.longitude}`}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Assignment */}
              {report.assigned_department && (
                <Card>
                  <CardHeader>
                    <CardTitle>Assignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{report.assigned_department}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
