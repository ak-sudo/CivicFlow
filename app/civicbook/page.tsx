"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, MapPin, Clock, AlertCircle, TrendingUp, Navigation, Filter } from "lucide-react"
import { getReportsFromStorage } from "@/lib/utils/reports-storage"
import {
  calculateDistance,
  getVotesForReport,
  getUserVoteForReport,
  saveVoteToStorage,
  removeVoteFromStorage,
  type CivicBookPost,
} from "@/lib/utils/civicbook-storage"
import { format } from "date-fns"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CivicBookPage() {
  const [posts, setPosts] = useState<CivicBookPost[]>([])
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"recent" | "trending">("recent")
  const userId = "current_user" // In real app, get from auth

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setLoading(false)
        },
      )
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userLocation) {
      loadPosts()
    }
  }, [userLocation, filterCategory, filterSeverity, sortBy])

  const loadPosts = () => {
    const reports = getReportsFromStorage()

    // Filter reports within 3km radius and have valid coordinates
    const nearbyReports = reports
      .filter((report) => {
        if (!report.latitude || !report.longitude || !userLocation) return false

        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          report.latitude,
          report.longitude,
        )

        return distance <= 3 // Within 3km
      })
      .map((report) => {
        const votes = getVotesForReport(report.id)
        const userVote = getUserVoteForReport(report.id, userId)
        const distance = calculateDistance(
          userLocation!.latitude,
          userLocation!.longitude,
          report.latitude!,
          report.longitude!,
        )

        return {
          ...report,
          upvotes: votes.upvotes,
          downvotes: votes.downvotes,
          userVote,
          distance,
        } as CivicBookPost
      })

    // Apply filters
    let filtered = nearbyReports
    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.category === filterCategory)
    }
    if (filterSeverity !== "all") {
      filtered = filtered.filter((p) => p.severity_level === filterSeverity)
    }

    // Apply sorting
    if (sortBy === "trending") {
      filtered.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes
        const scoreB = b.upvotes - b.downvotes
        return scoreB - scoreA
      })
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setPosts(filtered)
    setLoading(false)
  }

  const handleVote = (reportId: string, voteType: "upvote" | "downvote") => {
    const currentPost = posts.find((p) => p.id === reportId)
    if (!currentPost) return

    // If user already voted with same type, remove the vote
    if (currentPost.userVote === voteType) {
      removeVoteFromStorage(reportId, userId)
    } else {
      // Save new vote (will replace old one if exists)
      saveVoteToStorage({
        id: `vote_${Date.now()}_${Math.random()}`,
        reportId,
        userId,
        voteType,
        createdAt: new Date().toISOString(),
        userLocation,
      })
    }

    // Reload posts to reflect changes
    loadPosts()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    return "🏗️" // Default icon
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CivicBookHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <Navigation className="h-12 w-12 animate-spin mx-auto text-accent" />
            <p className="text-muted-foreground">Locating nearby civic issues...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userLocation) {
    return (
      <div className="min-h-screen bg-background">
        <CivicBookHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-accent" />
                <h3 className="text-lg font-semibold">Location Required</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                CivicBook needs your location to show civic issues near you. Please enable location access in your
                browser settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <CivicBookHeader />

      <div className="container max-w-4xl mx-auto py-6 px-4">
        {/* Filter Bar */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="streetlight">Streetlight</SelectItem>
                    <SelectItem value="garbage">Waste Management</SelectItem>
                    <SelectItem value="traffic_signal">Traffic Signal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "recent" | "trending")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card className="border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Issues Nearby</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are no civic issues reported within 3km of your location. Be the first to report an issue in
                  your area!
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="border-2 hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {post.profiles?.full_name?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{post.profiles?.full_name || "Anonymous Citizen"}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")}
                          <span>•</span>
                          <MapPin className="h-3 w-3" />
                          {post.distance?.toFixed(1)} km away
                        </div>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(post.severity_level)}>{post.severity_level}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Post Content */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(post.category)}</span>
                      <h3 className="font-semibold text-lg capitalize">{post.category.replace("_", " ")}</h3>
                    </div>
                    {post.description && <p className="text-sm leading-relaxed">{post.description}</p>}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{post.location}</span>
                    </div>
                  </div>

                  {/* Post Image */}
                  {post.report_images && post.report_images.length > 0 && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={post.report_images[0].image_url || "/placeholder.svg"}
                        alt="Issue photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* AI Analysis Badge */}
                  {post.ai_analysis && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/5 px-3 py-2 rounded-md">
                      <AlertCircle className="h-3 w-3" />
                      <span>
                        AI Verified: {Math.round((post.ai_analysis.category_confidence || 0) * 100)}% confidence
                      </span>
                    </div>
                  )}

                  <Separator />

                  {/* Voting Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant={post.userVote === "upvote" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVote(post.id, "upvote")}
                        className="gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-semibold">{post.upvotes}</span>
                        <span className="hidden sm:inline">Real Issue</span>
                      </Button>

                      <Button
                        variant={post.userVote === "downvote" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleVote(post.id, "downvote")}
                        className="gap-2"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span className="font-semibold">{post.downvotes}</span>
                        <span className="hidden sm:inline">Fake Report</span>
                      </Button>
                    </div>

                    {/* Net Score */}
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span>{post.upvotes - post.downvotes} Community Score</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={post.status === "completed" ? "default" : "secondary"}>Status: {post.status}</Badge>
                    {post.assigned_worker_id && <span className="text-xs text-muted-foreground">Worker assigned</span>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function CivicBookHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Image src="/civiflow-logo.png" alt="CivicFlow Logo" width={36} height={36} className="object-contain" />
          <div>
            <h1 className="text-xl font-bold">CivicBook</h1>
            <p className="text-xs text-muted-foreground">Community Issue Feed</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/citizen/dashboard">Dashboard</a>
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href="/citizen/report">Report Issue</a>
          </Button>
        </nav>
      </div>
    </header>
  )
}
