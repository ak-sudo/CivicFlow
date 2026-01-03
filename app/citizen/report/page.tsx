"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { NavHeader } from "@/components/citizen/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, MapPin, Loader2, CheckCircle, Upload, AlertCircle, Sparkles } from "lucide-react"
import type { ReportCategory } from "@/lib/types/database"
import { saveReportToStorage } from "@/lib/utils/reports-storage"

export default function ReportIssuePage() {
  const router = useRouter()
  const [userName] = useState("Rajesh Kumar")
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [address, setAddress] = useState("")
  const [complaintText, setComplaintText] = useState("")
  const [category, setCategory] = useState<ReportCategory | "">("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      setHasAnalyzed(false)
      setAiAnalysis(null)

      if (!location) {
        await getLocation()
      }
    }
  }

  const getLocation = async () => {
    setIsGettingLocation(true)
    setError(null)

    if (!navigator.geolocation) {
      const mockLocation = { lat: 28.6139, lng: 77.209 }
      setLocation(mockLocation)
      setAddress("Connaught Place, New Delhi, Delhi 110001, India")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLocation({ lat, lng })

        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          const data = await response.json()
          setAddress(data.display_name || `${lat}, ${lng}`)
        } catch (err) {
          setAddress(`${lat}, ${lng}`)
        }
        setIsGettingLocation(false)
      },
      (error) => {
        const mockLocation = { lat: 28.6139, lng: 77.209 }
        setLocation(mockLocation)
        setAddress("Connaught Place, New Delhi, Delhi 110001, India")
        setIsGettingLocation(false)
      },
    )
  }

  const runAIAnalysis = async () => {
    if (!imageFile || !complaintText || !location) {
      setError("Please upload image, add description, and enable location first")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const base64Image = imagePreview.split(",")[1]

      const response = await fetch("/api/ai/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Image,
          complaintText,
          location,
        }),
      })

      const data = await response.json()

      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis)
        setHasAnalyzed(true)
        setCategory(data.analysis.predicted_category)
        console.log("[v0] AI Analysis complete:", data.analysis)
      } else {
        throw new Error("AI analysis failed")
      }
    } catch (err: any) {
      console.error("[v0] AI analysis error:", err)
      setError("AI analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasAnalyzed) {
      setError("Please run AI Analysis before submitting the report")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!imageFile) {
        throw new Error("Please upload an image")
      }

      if (!location) {
        throw new Error("Please enable location")
      }

      if (!complaintText) {
        throw new Error("Please describe the issue")
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        reporter_id: "citizen_mock_id",
        category: category || aiAnalysis?.predicted_category || "other",
        status: "submitted" as const,
        complaint_text: complaintText,
        latitude: location.lat,
        longitude: location.lng,
        address: address || `${location.lat}, ${location.lng}`,
        severity_score: aiAnalysis?.final_severity || 50,
        severity_level: aiAnalysis?.severity_level || "medium",
        ai_analysis: aiAnalysis || null,
        needs_human_review: aiAnalysis?.needs_human_review || false,
        assigned_department: aiAnalysis?.assigned_department || null,
        assigned_worker_id: null,
        estimated_sla: aiAnalysis?.expected_resolution_time || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: null,
        verified_at: null,
        report_images: [
          {
            id: `img_${Date.now()}`,
            report_id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            image_url: imagePreview,
            image_type: "original",
            geotag_latitude: location.lat,
            geotag_longitude: location.lng,
            uploaded_by: "citizen_mock_id",
            created_at: new Date().toISOString(),
          },
        ],
        profiles: {
          id: "citizen_mock_id",
          full_name: userName,
          role: "citizen" as const,
        },
      }

      saveReportToStorage(newReport)
      console.log("[v0] Report saved with AI analysis:", newReport.id)

      setSuccess(true)
      setTimeout(() => {
        router.push(`/citizen/dashboard`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to submit report")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <NavHeader userName={userName} />
        <main className="container px-4 md:px-6 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">रिपोर्ट सफलतापूर्वक जमा की गई!</h2>
              <p className="text-lg font-semibold mb-2">Report Submitted Successfully!</p>
              <p className="text-muted-foreground mb-4">You earned 10 EcoCoins</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader userName={userName} />

      <main className="container px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>नागरिक समस्या रिपोर्ट करें / Report a Civic Issue</CardTitle>
              <CardDescription>Help make your community better by reporting problems</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Image / फोटो अपलोड करें *</Label>
                  <div className="flex flex-col gap-4">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview("")
                            setHasAnalyzed(false)
                            setAiAnalysis(null)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer flex flex-col items-center gap-2">
                          <Camera className="h-12 w-12 text-muted-foreground" />
                          <div className="text-sm">
                            <span className="text-primary font-medium">Click to upload</span> or use camera
                          </div>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location - Auto-fetched */}
                <div className="space-y-2">
                  <Label>Location / स्थान *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getLocation}
                      disabled={isGettingLocation}
                      className="w-full bg-transparent"
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting location...
                        </>
                      ) : location ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Location captured
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Get Current Location
                        </>
                      )}
                    </Button>
                  </div>
                  {address && <p className="text-sm text-muted-foreground">{address}</p>}
                </div>

                {/* Complaint Text */}
                <div className="space-y-2">
                  <Label htmlFor="complaint">Describe the Issue / समस्या का विवरण *</Label>
                  <Textarea
                    id="complaint"
                    placeholder="Describe what you see and why it's a problem... (समस्या का विवरण दें)"
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                {/* Run AI Analysis button */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={runAIAnalysis}
                    disabled={isAnalyzing || !imageFile || !location || !complaintText}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : hasAnalyzed ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        AI Analysis Complete
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                  {!hasAnalyzed && !isAnalyzing && (
                    <p className="text-xs text-center text-muted-foreground">
                      AI analysis is required before submitting the report
                    </p>
                  )}
                </div>

                {/* AI Analysis Results */}
                {aiAnalysis && hasAnalyzed && (
                  <div className="space-y-4 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="font-bold text-blue-900 dark:text-blue-100">AI Analysis Results</p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{aiAnalysis.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            <span className="text-blue-700 dark:text-blue-300">
                              {aiAnalysis.predicted_category.replace(/_/g, " ").toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Confidence:</span>{" "}
                            <span className="text-blue-700 dark:text-blue-300">
                              {(aiAnalysis.category_confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Severity:</span>{" "}
                            <span
                              className={
                                aiAnalysis.severity_level === "critical"
                                  ? "text-red-600 font-bold"
                                  : aiAnalysis.severity_level === "high"
                                    ? "text-orange-600 font-bold"
                                    : "text-blue-700"
                              }
                            >
                              {aiAnalysis.severity_level.toUpperCase()} ({aiAnalysis.final_severity})
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Department:</span>{" "}
                            <span className="text-blue-700 dark:text-blue-300">{aiAnalysis.assigned_department}</span>
                          </div>
                        </div>

                        {aiAnalysis.health_risks && aiAnalysis.health_risks.length > 0 && (
                          <div>
                            <p className="font-medium text-sm mb-1">Health Risks:</p>
                            <div className="flex flex-wrap gap-1">
                              {aiAnalysis.health_risks.map((risk: string, index: number) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                >
                                  {risk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-sm mb-1">Resolution Time:</p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            {aiAnalysis.expected_resolution_time}
                          </p>
                        </div>

                        {aiAnalysis.auto_escalate && (
                          <div className="p-2 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                            <p className="text-xs font-medium text-red-900 dark:text-red-100">
                              ⚠️ Auto-Escalated: {aiAnalysis.escalation_reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category / श्रेणी</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as ReportCategory)} disabled>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          aiAnalysis
                            ? `AI detected: ${aiAnalysis.predicted_category.replace(/_/g, " ")}`
                            : "Run AI analysis first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pothole">गड्ढा / Pothole</SelectItem>
                      <SelectItem value="waste_overflow">कचरा ओवरफ्लो / Waste Overflow</SelectItem>
                      <SelectItem value="streetlight_out">स्ट्रीटलाइट बंद / Streetlight Out</SelectItem>
                      <SelectItem value="traffic_signal_fault">ट्रैफिक सिग्नल खराब / Traffic Signal Fault</SelectItem>
                      <SelectItem value="carcass_on_road">सड़क पर पशु शव / Animal Carcass on Road</SelectItem>
                      <SelectItem value="public_toilet_unclean">सार्वजनिक शौचालय गंदा / Public Toilet Unclean</SelectItem>
                      <SelectItem value="damaged_pathway">क्षतिग्रस्त रास्ता / Damaged Pathway</SelectItem>
                      <SelectItem value="other">अन्य / Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Category is auto-detected by AI</p>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit button */}
                <Button type="submit" className="w-full" disabled={isLoading || !hasAnalyzed} size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Report / रिपोर्ट जमा करें
                    </>
                  )}
                </Button>
                {!hasAnalyzed && (
                  <p className="text-xs text-center text-muted-foreground">Please run AI analysis before submitting</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
