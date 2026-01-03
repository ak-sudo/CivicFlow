import type { StoredReport } from "./reports-storage"

export interface CivicBookVote {
  id: string
  reportId: string
  userId: string
  voteType: "upvote" | "downvote" // upvote = real issue, downvote = fake report
  createdAt: string
  userLocation?: {
    latitude: number
    longitude: number
  }
}

export interface CivicBookPost extends StoredReport {
  upvotes: number
  downvotes: number
  userVote?: "upvote" | "downvote"
  distance?: number // distance from user in km
}

const VOTES_KEY = "civicflow_civicbook_votes"

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function getVotesFromStorage(): CivicBookVote[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(VOTES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveVoteToStorage(vote: CivicBookVote): void {
  if (typeof window === "undefined") return
  try {
    const votes = getVotesFromStorage()

    // Remove existing vote by same user on same report
    const filtered = votes.filter((v) => !(v.reportId === vote.reportId && v.userId === vote.userId))

    filtered.push(vote)
    localStorage.setItem(VOTES_KEY, JSON.stringify(filtered))

    // Dispatch event for real-time updates
    window.dispatchEvent(new CustomEvent("civicbookVotesUpdated", { detail: { votes: filtered } }))
  } catch (error) {
    console.error("Failed to save vote:", error)
  }
}

export function removeVoteFromStorage(reportId: string, userId: string): void {
  if (typeof window === "undefined") return
  try {
    const votes = getVotesFromStorage()
    const filtered = votes.filter((v) => !(v.reportId === reportId && v.userId === userId))
    localStorage.setItem(VOTES_KEY, JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent("civicbookVotesUpdated", { detail: { votes: filtered } }))
  } catch (error) {
    console.error("Failed to remove vote:", error)
  }
}

export function getVotesForReport(reportId: string): { upvotes: number; downvotes: number } {
  const votes = getVotesFromStorage()
  const reportVotes = votes.filter((v) => v.reportId === reportId)

  return {
    upvotes: reportVotes.filter((v) => v.voteType === "upvote").length,
    downvotes: reportVotes.filter((v) => v.voteType === "downvote").length,
  }
}

export function getUserVoteForReport(reportId: string, userId: string): "upvote" | "downvote" | null {
  const votes = getVotesFromStorage()
  const userVote = votes.find((v) => v.reportId === reportId && v.userId === userId)
  return userVote ? userVote.voteType : null
}

export function getReportVotingStats() {
  const votes = getVotesFromStorage()
  const reportMap = new Map<string, { upvotes: number; downvotes: number }>()

  votes.forEach((vote) => {
    if (!reportMap.has(vote.reportId)) {
      reportMap.set(vote.reportId, { upvotes: 0, downvotes: 0 })
    }
    const stats = reportMap.get(vote.reportId)!
    if (vote.voteType === "upvote") {
      stats.upvotes++
    } else {
      stats.downvotes++
    }
  })

  return reportMap
}
