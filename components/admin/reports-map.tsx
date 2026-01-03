"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"

interface Report {
  id: string
  lat: number
  lng: number
  severity: "low" | "medium" | "high" | "critical"
  address: string
  complaint: string
}

interface ReportsMapProps {
  reports: Report[]
  isExpanded?: boolean
}

export function ReportsMap({ reports, isExpanded = false }: ReportsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredReport, setHoveredReport] = useState<Report | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(12)
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 })
  const [showHeatmap, setShowHeatmap] = useState(true)

  useEffect(() => {
    if (reports.length > 0) {
      const avgLat = reports.reduce((sum, r) => sum + r.lat, 0) / reports.length
      const avgLng = reports.reduce((sum, r) => sum + r.lng, 0) / reports.length
      setCenter({ lat: avgLat, lng: avgLng })
    }
  }, [reports])

  useEffect(() => {
    if (!canvasRef.current || !mapRef.current || !showHeatmap) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mapWidth = mapRef.current.clientWidth
    const mapHeight = mapRef.current.clientHeight

    canvas.width = mapWidth
    canvas.height = mapHeight

    ctx.clearRect(0, 0, mapWidth, mapHeight)

    // Draw heatmap for each report
    reports.forEach((report) => {
      const pos = getMarkerPosition(report.lat, report.lng)

      // Only draw if on screen
      if (pos.x < -100 || pos.x > mapWidth + 100 || pos.y < -100 || pos.y > mapHeight + 100) {
        return
      }

      // Intensity based on severity
      const intensityMap = {
        low: 0.3,
        medium: 0.5,
        high: 0.7,
        critical: 1.0,
      }
      const intensity = intensityMap[report.severity]

      // Create radial gradient for heatmap effect
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 60)
      gradient.addColorStop(0, `rgba(255, 100, 100, ${0.6 * intensity})`)
      gradient.addColorStop(0.5, `rgba(255, 150, 50, ${0.3 * intensity})`)
      gradient.addColorStop(1, `rgba(255, 200, 0, 0)`)

      ctx.fillStyle = gradient
      ctx.fillRect(pos.x - 60, pos.y - 60, 120, 120)
    })
  }, [reports, zoom, center, showHeatmap])

  const latLngToPixel = (lat: number, lng: number, zoom: number) => {
    const scale = 256 * Math.pow(2, zoom)
    const worldX = ((lng + 180) / 360) * scale
    const latRad = (lat * Math.PI) / 180
    const worldY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale
    return { x: worldX, y: worldY }
  }

  const getTileCoords = (lat: number, lng: number, zoom: number) => {
    const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom))
    const y = Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
        Math.pow(2, zoom),
    )
    return { x, y }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -1 : 1
    setZoom((prev) => Math.max(10, Math.min(18, prev + delta)))
  }

  const handleMarkerHover = (report: Report, e: React.MouseEvent) => {
    setHoveredReport(report)
    const rect = mapRef.current?.getBoundingClientRect()
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }

  const severityColors = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    critical: "#ef4444",
  }

  const mapWidth = mapRef.current?.clientWidth || 1200
  const mapHeight = mapRef.current?.clientHeight || 800

  const centerTile = getTileCoords(center.lat, center.lng, zoom)
  const centerPixel = latLngToPixel(center.lat, center.lng, zoom)

  const tilesX = Math.ceil(mapWidth / 256) + 2
  const tilesY = Math.ceil(mapHeight / 256) + 2

  const startTileX = centerTile.x - Math.floor(tilesX / 2)
  const startTileY = centerTile.y - Math.floor(tilesY / 2)

  const getMarkerPosition = (lat: number, lng: number) => {
    const markerPixel = latLngToPixel(lat, lng, zoom)
    const x = markerPixel.x - centerPixel.x + mapWidth / 2
    const y = markerPixel.y - centerPixel.y + mapHeight / 2
    return { x, y }
  }

  return (
    <div ref={mapRef} className="relative w-full h-full bg-gray-200 overflow-hidden" onWheel={handleWheel}>
      {/* Map tiles layer */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${-(centerPixel.x % 256)}px, ${-(centerPixel.y % 256)}px)` }}
      >
        {Array.from({ length: tilesY }).map((_, row) =>
          Array.from({ length: tilesX }).map((_, col) => {
            const tileX = startTileX + col
            const tileY = startTileY + row
            const tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`

            return (
              <img
                key={`${tileX}-${tileY}`}
                src={tileUrl || "/placeholder.svg"}
                alt=""
                className="absolute pointer-events-none"
                style={{
                  left: col * 256,
                  top: row * 256,
                  width: 256,
                  height: 256,
                }}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.backgroundColor = "#e5e7eb"
                }}
              />
            )
          }),
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: showHeatmap ? 0.6 : 0,
          mixBlendMode: "multiply",
          transition: "opacity 0.3s ease",
        }}
      />

      {reports.map((report) => {
        const pos = getMarkerPosition(report.lat, report.lng)

        if (pos.x < -50 || pos.x > mapWidth + 50 || pos.y < -50 || pos.y > mapHeight + 50) {
          return null
        }

        return (
          <div
            key={report.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110"
            style={{
              left: pos.x,
              top: pos.y,
              zIndex: 10,
            }}
            onMouseEnter={(e) => handleMarkerHover(report, e)}
            onMouseLeave={() => setHoveredReport(null)}
          >
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                style={{ backgroundColor: severityColors[report.severity] }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className="absolute left-1/2 top-full w-0 h-0 transform -translate-x-1/2"
                style={{
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: `12px solid ${severityColors[report.severity]}`,
                }}
              />
            </div>
          </div>
        )
      })}

      {/* Hover Tooltip */}
      {hoveredReport && (
        <div
          className="absolute bg-white rounded-lg shadow-xl p-4 pointer-events-none z-50 border border-gray-200"
          style={{
            left: mousePos.x + 20,
            top: mousePos.y - 60,
            maxWidth: "300px",
          }}
        >
          <h3 className="font-semibold text-sm mb-2">{hoveredReport.complaint}</h3>
          <p className="text-xs text-gray-600 mb-2">{hoveredReport.address}</p>
          <p className="text-xs text-gray-500 mb-2">
            📍 {hoveredReport.lat.toFixed(5)}, {hoveredReport.lng.toFixed(5)}
          </p>
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              hoveredReport.severity === "critical"
                ? "bg-red-100 text-red-700"
                : hoveredReport.severity === "high"
                  ? "bg-orange-100 text-orange-700"
                  : hoveredReport.severity === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
            }`}
          >
            {hoveredReport.severity.toUpperCase()}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg space-y-2">
        <p className="text-xs font-semibold mb-2">Severity / गंभीरता</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-xs">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs">Low</span>
        </div>
        <div className="pt-2 border-t border-gray-200 mt-2">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="text-xs text-primary hover:underline w-full text-left"
          >
            {showHeatmap ? "Hide" : "Show"} Heatmap
          </button>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <p className="text-sm font-semibold">📍 Active Reports Map</p>
        <p className="text-xs text-muted-foreground mt-1">{reports.length} reports on map</p>
        <p className="text-xs text-muted-foreground mt-1">Zoom Level: {zoom}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setZoom((prev) => Math.min(18, prev + 1))}
            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
          >
            Zoom In
          </button>
          <button
            onClick={() => setZoom((prev) => Math.max(10, prev - 1))}
            className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
          >
            Zoom Out
          </button>
          <button
            onClick={() => {
              if (reports.length > 0) {
                const avgLat = reports.reduce((sum, r) => sum + r.lat, 0) / reports.length
                const avgLng = reports.reduce((sum, r) => sum + r.lng, 0) / reports.length
                setCenter({ lat: avgLat, lng: avgLng })
                setZoom(12)
              } else {
                setZoom(12)
                setCenter({ lat: 28.6139, lng: 77.209 })
              }
            }}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/90"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
