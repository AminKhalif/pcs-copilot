"use client"

import { useEffect, useRef, useState } from "react"
import type { AgentEvent, EventKind } from "@/lib/agent-events"

const KIND_CONFIG: Record<EventKind, { color: string; glow: string; dot: string }> = {
  info:    { color: "#8b949e", glow: "none",               dot: "·" },
  success: { color: "#3fb950", glow: "0 0 6px #3fb95066",  dot: "✓" },
  warning: { color: "#e3b341", glow: "0 0 6px #e3b34166",  dot: "⚠" },
  blocked: { color: "#f85149", glow: "0 0 8px #f8514966",  dot: "✗" },
}

function Timestamp({ ts }: { ts: string }) {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  const ss = String(d.getSeconds()).padStart(2, "0")
  return <span style={{ color: "#3d444d", userSelect: "none" }}>{hh}:{mm}:{ss}</span>
}

function Entry({ ev, isNew }: { ev: AgentEvent; isNew: boolean }) {
  const cfg = KIND_CONFIG[ev.kind] ?? KIND_CONFIG.info
  return (
    <div
      style={{
        padding: "4px 12px",
        borderLeft:
          ev.kind === "blocked" || ev.kind === "warning"
            ? `2px solid ${cfg.color}`
            : "2px solid transparent",
        background: isNew ? `${cfg.color}0a` : "transparent",
        transition: "background 1.2s ease",
      }}
    >
      <div style={{ display: "flex", gap: "6px", alignItems: "baseline", lineHeight: 1.5 }}>
        <Timestamp ts={ev.ts} />
        <span
          style={{
            color: cfg.color,
            fontWeight: 700,
            flexShrink: 0,
            fontSize: "11px",
            textShadow: cfg.glow,
          }}
        >
          {cfg.dot}
        </span>
        <span
          style={{
            color: "#6e7681",
            flexShrink: 0,
            fontSize: "9px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: "1px",
          }}
        >
          {ev.phase}
        </span>
        <span
          style={{
            color:
              ev.kind === "blocked"
                ? "#f85149"
                : ev.kind === "warning"
                ? "#e3b341"
                : "#c9d1d9",
            wordBreak: "break-word",
          }}
        >
          {ev.message}
        </span>
      </div>
      {ev.detail && (
        <p
          style={{
            color: "#484f58",
            margin: "2px 0 0 0",
            paddingLeft: "80px",
            lineHeight: 1.45,
            wordBreak: "break-word",
            fontSize: "10px",
          }}
        >
          {ev.detail}
        </p>
      )}
    </div>
  )
}

type Props = {
  visible: boolean
}

export function SecuritySidebar({ visible }: Props) {
  const [events, setEvents] = useState<AgentEvent[]>([])
  const [newIdx, setNewIdx] = useState<number>(-1)
  const [live, setLive] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevVisible = useRef(visible)

  // Clear log when sidebar hides
  useEffect(() => {
    if (prevVisible.current && !visible) {
      setEvents([])
      setNewIdx(-1)
    }
    prevVisible.current = visible
  }, [visible])

  useEffect(() => {
    const es = new EventSource("/api/agent/stream")
    es.onopen = () => setLive(true)
    es.onerror = () => setLive(false)
    es.onmessage = (e) => {
      try {
        const ev: AgentEvent = JSON.parse(e.data)
        setEvents((prev) => {
          setNewIdx(prev.length)
          setTimeout(() => setNewIdx(-1), 1200)
          return [...prev, ev]
        })
      } catch {
        // malformed line — ignore
      }
    }
    return () => es.close()
  }, [])

  useEffect(() => {
    if (visible) bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [events.length, visible])

  const blockedCount = events.filter((e) => e.kind === "blocked").length
  const warnCount = events.filter((e) => e.kind === "warning").length

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        top: "73px",
        bottom: "16px",
        width: "288px",
        background: "#0d1117",
        border: "1px solid #30363d",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', ui-monospace, monospace",
        fontSize: "11px",
        overflow: "hidden",
        zIndex: 50,
        boxShadow: "0 8px 32px #00000066",
        // Slide in/out from right
        transform: visible ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 220ms cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #21262d",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          flexShrink: 0,
          background: "#161b22",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: live ? "#3fb950" : "#30363d",
            flexShrink: 0,
            boxShadow: live ? "0 0 6px #3fb950" : "none",
            transition: "all 0.4s",
            animation: live ? "pulse-dot 2s ease-in-out infinite" : "none",
          }}
        />
        <span
          style={{
            color: "#8b949e",
            fontWeight: 600,
            letterSpacing: "0.07em",
            fontSize: "10px",
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          Agent Security Monitor
        </span>

        {blockedCount > 0 && (
          <span
            style={{
              background: "#f8514922",
              color: "#f85149",
              border: "1px solid #f8514944",
              borderRadius: "4px",
              padding: "1px 5px",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            {blockedCount} BLOCKED
          </span>
        )}
        {warnCount > 0 && blockedCount === 0 && (
          <span
            style={{
              background: "#e3b34122",
              color: "#e3b341",
              border: "1px solid #e3b34144",
              borderRadius: "4px",
              padding: "1px 5px",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.06em",
            }}
          >
            {warnCount} WARN
          </span>
        )}
      </div>

      {/* ── Column labels ── */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "5px 12px 4px",
          borderBottom: "1px solid #161b22",
          color: "#3d444d",
          fontSize: "9px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        <span style={{ width: "44px" }}>TIME</span>
        <span style={{ width: "8px" }} />
        <span style={{ width: "52px" }}>PHASE</span>
        <span>EVENT</span>
      </div>

      {/* ── Log area ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 8px" }}>
        {events.length === 0 ? (
          <div style={{ color: "#3d444d", padding: "16px 14px", lineHeight: 1.6 }}>
            {"// agent idle — waiting for task"}
          </div>
        ) : (
          events.map((ev, i) => <Entry key={i} ev={ev} isNew={i === newIdx} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "7px 12px",
          borderTop: "1px solid #21262d",
          display: "flex",
          justifyContent: "space-between",
          color: "#3d444d",
          fontSize: "9px",
          letterSpacing: "0.06em",
          flexShrink: 0,
          background: "#0d1117",
        }}
      >
        <span>{events.length} events</span>
        <span>
          {blockedCount > 0 ? (
            <span style={{ color: "#f85149" }}>
              {blockedCount} threat{blockedCount !== 1 ? "s" : ""} blocked
            </span>
          ) : events.length > 0 ? (
            <span style={{ color: "#3fb950" }}>no threats detected</span>
          ) : (
            <span>offline</span>
          )}
        </span>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
