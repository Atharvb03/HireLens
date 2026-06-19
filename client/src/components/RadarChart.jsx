import React from 'react'

/**
 * Pure SVG radar chart — no external library needed.
 * Props:
 *   scores: { skills, experience, education, projects, overall }  (0-100 each)
 *   size:   number (default 220)
 */
export default function RadarChart({ scores = {}, size = 220 }) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.36

  const axes = [
    { key: 'skillMatchScore', label: 'Skills',      color: '#60a5fa' },
    { key: 'experienceMatch', label: 'Experience',  color: '#a78bfa' },
    { key: 'educationMatch',  label: 'Education',   color: '#34d399' },
    { key: 'projectRelevance',label: 'Projects',    color: '#f59e0b' },
    { key: 'matchScore',      label: 'Overall',     color: '#f472b6' },
  ]

  const n = axes.length
  const angleStep = (2 * Math.PI) / n
  // Start from top (-π/2)
  const angle = (i) => -Math.PI / 2 + i * angleStep

  // Convert (value 0-100, axis index) → SVG point
  const point = (value, i) => {
    const r = (value / 100) * radius
    return {
      x: cx + r * Math.cos(angle(i)),
      y: cy + r * Math.sin(angle(i))
    }
  }

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100]

  // Polygon points for a ring
  const ringPoints = (pct) =>
    axes.map((_, i) => {
      const r = (pct / 100) * radius
      return `${cx + r * Math.cos(angle(i))},${cy + r * Math.sin(angle(i))}`
    }).join(' ')

  // Data polygon
  const dataPoints = axes.map((ax, i) => {
    const val = Math.min(100, Math.max(0, scores[ax.key] || 0))
    const p = point(val, i)
    return `${p.x},${p.y}`
  }).join(' ')

  // Label positions (slightly outside the outermost ring)
  const labelPos = (i) => {
    const r = radius * 1.28
    return {
      x: cx + r * Math.cos(angle(i)),
      y: cy + r * Math.sin(angle(i))
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map(pct => (
          <polygon
            key={pct}
            points={ringPoints(pct)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axes.map((_, i) => {
          const outer = point(100, i)
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          )
        })}

        {/* Data polygon fill */}
        <polygon
          points={dataPoints}
          fill="rgba(99,102,241,0.15)"
          stroke="rgba(99,102,241,0.6)"
          strokeWidth="1.5"
        />

        {/* Data dots */}
        {axes.map((ax, i) => {
          const val = Math.min(100, Math.max(0, scores[ax.key] || 0))
          const p = point(val, i)
          return (
            <circle
              key={i}
              cx={p.x} cy={p.y} r="4"
              fill={ax.color}
              stroke="#0f1729"
              strokeWidth="1.5"
            />
          )
        })}

        {/* Labels */}
        {axes.map((ax, i) => {
          const lp = labelPos(i)
          const val = Math.min(100, Math.max(0, scores[ax.key] || 0))
          return (
            <g key={i}>
              <text
                x={lp.x} y={lp.y - 5}
                textAnchor="middle"
                fill={ax.color}
                fontSize="10"
                fontWeight="600"
              >
                {ax.label}
              </text>
              <text
                x={lp.x} y={lp.y + 8}
                textAnchor="middle"
                fill="rgba(255,255,255,0.5)"
                fontSize="9"
              >
                {val}%
              </text>
            </g>
          )
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="2" fill="rgba(255,255,255,0.2)" />
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1">
        {axes.map((ax) => (
          <div key={ax.key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ax.color }} />
            <span className="text-xs text-slate-400">{ax.label}</span>
            <span className="text-xs font-semibold ml-auto" style={{ color: ax.color }}>
              {scores[ax.key] || 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
