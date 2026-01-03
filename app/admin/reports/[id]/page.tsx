"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopNav } from "@/components/admin/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getReportById, type StoredReport } from "@/lib/utils/reports-storage"

export default function AdminReportDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [report, setReport] = useState<StoredReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReport = () => {
      const storedReport = getReportById(id)
      if (!storedReport) {
        router.push("/admin/reports")
        return
      }
      setReport(storedReport)
      setIsLoading(false)
    }

    loadReport()

    const handleReportsUpdate = () => loadReport()
    window.addEventListener("reportsUpdated", handleReportsUpdate)
    return () => window.removeEventListener("reportsUpdated", handleReportsUpdate)
  }, [id, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col ml-64 overflow-y-auto">
          <AdminTopNav userName="Admin" />
          <main className="flex-1 p-6">
            <div className="text-center py-12">Loading report details...</div>
          </main>
        </div>
      </div>
    )
  }

  if (!report) return null

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
        <AdminTopNav userName="Admin User" />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin/reports")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">Report Details</h1>
                <p className="text-muted-foreground mt-1">ID: {report.id.slice(0, 12)}</p>
              </div>
              <Badge variant="outline" className={statusColors[report.status]}>
                {report.status.replace("_", " ")}
              </Badge>
              {report.severity_level && (
                <Badge variant="outline" className={severityColors[report.severity_level]}>
                  {report.severity_level}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Images */}
                {report.report_images && report.report_images.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Issue Images</CardTitle>
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
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Issue Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Issue Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{report.complaint_text}</p>
                  </CardContent>
                </Card>

                {/* AI Analysis - Comprehensive Section */}
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
                            <p className="text-sm text-muted-foreground font-medium mb-2">AI Description</p>
                            <p className="text-foreground leading-relaxed">{report.ai_analysis.description}</p>
                          </div>
                        )}

                        {/* Measurements */}
                        {report.ai_analysis.measurements && (
                          <div>
                            <p className="text-sm text-muted-foreground font-medium mb-3">Measurements</p>
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

                    {/* Resolution Plan */}
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
                            <p className="text-sm text-muted-foreground font-medium mb-2">Action Steps</p>
                            <ol className="list-decimal list-inside space-y-1.5 text-sm">
                              {report.ai_analysis.next_steps.map((step: string, i: number) => (
                                <li key={i} className="leading-relaxed">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Work Order Details */}
                    {report.ai_analysis.work_order && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Work Order Details</CardTitle>
                          <CardDescription>Resource allocation and cost estimates</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Priority</p>
                              <Badge
                                variant={
                                  report.ai_analysis.work_order.priority === "high" ? "destructive" : "secondary"
                                }
                                className="mt-1"
                              >
                                {report.ai_analysis.work_order.priority}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Workers Needed</p>
                              <p className="font-medium text-lg">
                                {report.ai_analysis.work_order.estimated_workers || "TBD"}
                              </p>
                            </div>
                            {report.ai_analysis.work_order.estimated_duration_hours && (
                              <div>
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium text-lg">
                                  {report.ai_analysis.work_order.estimated_duration_hours}h
                                </p>
                              </div>
                            )}
                          </div>

                          {report.ai_analysis.work_order.estimated_cost_inr && (
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <p className="text-sm text-muted-foreground">Estimated Cost</p>
                              <p className="font-bold text-2xl text-primary">
                                ₹{report.ai_analysis.work_order.estimated_cost_inr.toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}

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
                                    <li key={i} className="leading-relaxed">
                                      {sp}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {report.ai_analysis.work_order.municipal_staff_instructions && (
                            <div>
                              <p className="text-sm text-muted-foreground font-medium mb-2">Staff Instructions</p>
                              <p className="text-sm leading-relaxed">
                                {report.ai_analysis.work_order.municipal_staff_instructions}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Root Cause Analysis (Issue DNA) */}
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
                              <p className="text-foreground leading-relaxed">
                                {report.ai_analysis.root_cause_analysis.primary_cause}
                              </p>
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
                                <ul className="list-disc list-inside space-y-1.5 text-sm">
                                  {report.ai_analysis.root_cause_analysis.prevention_measures.map(
                                    (measure: string, i: number) => (
                                      <li key={i} className="leading-relaxed">
                                        {measure}
                                      </li>
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
                                  className="mt-1"
                                >
                                  {report.ai_analysis.root_cause_analysis.recurring_issue ? "Yes" : "No"}
                                </Badge>
                              </div>
                            )}
                            {report.ai_analysis.root_cause_analysis.similar_issues_in_area !== undefined && (
                              <div>
                                <p className="text-sm text-muted-foreground">Similar Issues Nearby</p>
                                <p className="font-medium text-lg">
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
                          <CardTitle>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              Health Hazard Predictions
                            </div>
                          </CardTitle>
                          <CardDescription>AI-predicted risk assessments</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Mosquito Breeding Risk</p>
                              <Badge
                                variant={
                                  report.ai_analysis.health_hazard_predictions.mosquito_breeding_risk === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {report.ai_analysis.health_hazard_predictions.mosquito_breeding_risk || "Low"}
                              </Badge>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Contamination Risk</p>
                              <Badge
                                variant={
                                  report.ai_analysis.health_hazard_predictions.contamination_risk === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {report.ai_analysis.health_hazard_predictions.contamination_risk || "Low"}
                              </Badge>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Accident Risk</p>
                              <Badge
                                variant={
                                  report.ai_analysis.health_hazard_predictions.accident_risk === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {report.ai_analysis.health_hazard_predictions.accident_risk || "Low"}
                              </Badge>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground mb-1">Crime Prone</p>
                              <Badge
                                variant={
                                  report.ai_analysis.health_hazard_predictions.crime_prone_area === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {report.ai_analysis.health_hazard_predictions.crime_prone_area || "Low"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>

              {/* Sidebar - Report Metadata */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Reported By</p>
                      <p className="font-medium">{report.profiles?.full_name || "Anonymous"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{report.address || "Location not provided"}</span>
                      </p>
                    </div>

                    {report.geotag_latitude && report.geotag_longitude && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Coordinates</p>
                        <p className="font-medium text-sm">
                          {report.geotag_latitude.toFixed(6)}, {report.geotag_longitude.toFixed(6)}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>

                    {report.category && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <Badge variant="secondary" className="capitalize">
                          {report.category.replace("_", " ")}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                {report.timeline && report.timeline.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {report.timeline.map((event) => (
                          <div key={event.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <div className="w-px flex-1 bg-border" />
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="font-medium text-sm">{event.action}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.actor_name && `By ${event.actor_name} • `}
                                {new Date(event.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
