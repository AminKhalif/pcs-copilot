"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { AgentEvent, EventKind } from "@/lib/agent-events"

// ── Status phase list ──────────────────────────────────────────────────────────

const PHASES = [
  { id: "opening_portal",  label: "Opening DTS portal" },
  { id: "logging_in",      label: "Logging in" },
  { id: "navigating_form", label: "Navigating to voucher form" },
  { id: "filling_member",  label: "Filling member info" },
  { id: "filling_travel",  label: "Filling travel details" },
  { id: "filling_amounts", label: "Filling entitlement amounts" },
  { id: "reviewing",       label: "Reviewing entries" },
  { id: "submitting",      label: "Submitting voucher" },
  { id: "confirmed",       label: "Confirmation #DTS-2026-09451" },
]

// ── Security log helpers ───────────────────────────────────────────────────────

const KIND_CFG: Record<EventKind, { color: string; glow: string; dot: string }> = {
  info:    { color: "#8b949e", glow: "none",               dot: "·" },
  success: { color: "#3fb950", glow: "0 0 6px #3fb95066",  dot: "✓" },
  warning: { color: "#e3b341", glow: "0 0 6px #e3b34166",  dot: "⚠" },
  blocked: { color: "#f85149", glow: "0 0 8px #f8514966",  dot: "✗" },
}

function fmtTime(ts: string) {
  const d = new Date(ts)
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":")
}

function SecEntry({ ev }: { ev: AgentEvent }) {
  const cfg = KIND_CFG[ev.kind] ?? KIND_CFG.info
  return (
    <div
      style={{
        padding: "3px 10px",
        borderLeft:
          ev.kind === "blocked" || ev.kind === "warning"
            ? `2px solid ${cfg.color}`
            : "2px solid transparent",
      }}
    >
      <div style={{ display: "flex", gap: "5px", alignItems: "baseline", lineHeight: 1.5 }}>
        <span style={{ color: "#3d444d", flexShrink: 0, fontSize: "10px" }}>{fmtTime(ev.ts)}</span>
        <span style={{ color: cfg.color, fontWeight: 700, flexShrink: 0, textShadow: cfg.glow }}>
          {cfg.dot}
        </span>
        <span
          style={{
            color: "#6e7681",
            flexShrink: 0,
            fontSize: "9px",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          {ev.phase}
        </span>
        <span
          style={{
            color: ev.kind === "blocked" ? "#f85149" : ev.kind === "warning" ? "#e3b341" : "#c9d1d9",
            wordBreak: "break-word",
            fontSize: "10.5px",
          }}
        >
          {ev.message}
        </span>
      </div>
      {ev.detail && (
        <p
          style={{
            color: "#484f58",
            margin: "1px 0 0",
            paddingLeft: "72px",
            lineHeight: 1.4,
            wordBreak: "break-word",
            fontSize: "9.5px",
          }}
        >
          {ev.detail}
        </p>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

type AgentStatus = "idle" | "starting" | "running" | "done" | "error"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone?: () => void
}

export function AgentPanel({ open, onOpenChange, onDone }: Props) {
  // ── Phase tracking ──
  const [revealedCount, setRevealedCount] = useState(0)
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("starting")
  const revealedRef     = useRef(0)
  const completedRef    = useRef<string[]>([])
  const revealTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pollTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneNotifiedRef = useRef(false)
  // Timestamp guard — only accept "done" from this run, not a stale status file
  const openedAtRef     = useRef<number>(0)

  // ── Security log ──
  const [events, setEvents]   = useState<AgentEvent[]>([])
  const [secLive, setSecLive] = useState(false)
  const evBottomRef           = useRef<HTMLDivElement>(null)

  const revealNext = useCallback(() => {
    const pending = completedRef.current.length - revealedRef.current
    if (pending <= 0) return
    revealedRef.current += 1
    setRevealedCount(revealedRef.current)
    if (completedRef.current.length - revealedRef.current > 0) {
      revealTimerRef.current = setTimeout(revealNext, 700)
    }
  }, [])

  // Reset everything when panel opens / closes
  useEffect(() => {
    if (!open) {
      setEvents([])
      return
    }
    revealedRef.current    = 0
    completedRef.current   = []
    doneNotifiedRef.current = false
    openedAtRef.current    = Date.now()
    setRevealedCount(0)
    setAgentStatus("starting")
  }, [open])

  // Polling loop
  useEffect(() => {
    if (!open) return
    let stopped = false

    async function poll() {
      if (stopped) return
      try {
        const res  = await fetch("/api/agent/status")
        const data = await res.json()

        // Reject stale "done" from a previous run
        const statusTs = new Date(data.updatedAt ?? 0).getTime()
        const isDoneStale = data.status === "done" && statusTs < openedAtRef.current

        if (!isDoneStale) {
          const serverPhases: string[] = data.completedPhases ?? []
          if (serverPhases.length > completedRef.current.length) {
            completedRef.current = serverPhases
            if (!revealTimerRef.current) revealNext()
          }
          setAgentStatus(data.status as AgentStatus)
        }

        if (!isDoneStale && (data.status === "done" || data.status === "error")) {
          if (completedRef.current.length > revealedRef.current) {
            revealTimerRef.current = setTimeout(revealNext, 700)
          }
          return
        }
      } catch { /* keep polling */ }

      if (!stopped) pollTimerRef.current = setTimeout(poll, 1500)
    }

    poll()
    return () => {
      stopped = true
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current)
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
  }, [open, revealNext])

  // PDF download + done callback — only fires for a fresh run
  const isDone  = agentStatus === "done"
  const isError = agentStatus === "error"

  useEffect(() => {
    if (isDone && !doneNotifiedRef.current) {
      doneNotifiedRef.current = true
      const a = document.createElement("a")
      a.href = "/api/agent/receipt"
      a.download = "pcs-voucher-receipt.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      onDone?.()
    }
  }, [isDone, onDone])

  // SSE connection for security log
  useEffect(() => {
    const es = new EventSource("/api/agent/stream")
    es.onopen  = () => setSecLive(true)
    es.onerror = () => setSecLive(false)
    es.onmessage = (e) => {
      try {
        const ev: AgentEvent = JSON.parse(e.data)
        setEvents((prev) => [...prev, ev])
      } catch { /* ignore */ }
    }
    return () => es.close()
  }, [])

  // Auto-scroll security log
  useEffect(() => {
    if (open) evBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [events.length, open])

  const blockedCount = events.filter((e) => e.kind === "blocked").length
  const warnCount    = events.filter((e) => e.kind === "warning").length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 overflow-hidden"
        style={{
          width: "min(820px, 90vw)",
          maxWidth: "none",
          borderColor: "var(--border)",
        }}
      >
        <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

          {/* ── Left column — agent phase list ── */}
          <div
            style={{
              width: "340px",
              flexShrink: 0,
              background: "#ffffff",
              borderRight: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <SheetHeader
              className="px-6 py-5 border-b"
              style={{ borderColor: "var(--border)", flexShrink: 0 }}
            >
              <SheetTitle className="font-serif text-[20px] font-medium text-foreground">
                {isDone ? "Voucher filed." : "Agent working…"}
              </SheetTitle>
              <p className="text-[13px] text-muted-foreground">
                {isDone
                  ? "DD 1351-2 submitted to DTS. Confirmation #DTS-2026-09451."
                  : "Watch the agent complete each step in the DTS browser window."}
              </p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-2" style={{ padding: "8px 24px" }}>
              {PHASES.map((phase, i) => {
                const isRevealed  = i < revealedCount
                const isActiveStep = i === revealedCount - 1 && !isDone
                const isLast      = phase.id === "confirmed"

                if (!isRevealed) {
                  return (
                    <div
                      key={phase.id}
                      className="flex items-center gap-3 py-3 px-1"
                      style={{ opacity: 0.22 }}
                    >
                      <div
                        className="h-5 w-5 rounded-full border shrink-0"
                        style={{ borderColor: "var(--border)" }}
                      />
                      <span className="text-[14px] text-muted-foreground">{phase.label}</span>
                    </div>
                  )
                }

                return (
                  <div
                    key={phase.id}
                    className="flex items-center gap-3 py-3 px-1"
                    style={{
                      borderBottom: !isLast ? "1px solid var(--border)" : "none",
                      animation: "fadeSlideIn 0.3s ease",
                    }}
                  >
                    {isActiveStep ? (
                      <Loader2
                        className="h-5 w-5 shrink-0 animate-spin"
                        style={{ color: "var(--primary)" }}
                        strokeWidth={2}
                      />
                    ) : (
                      <div
                        className="h-5 w-5 rounded-full shrink-0 flex items-center justify-center"
                        style={{
                          background: isLast && isDone ? "var(--gold, var(--primary))" : "var(--primary)",
                        }}
                      >
                        <Check
                          className="h-3 w-3"
                          style={{ color: "var(--primary-foreground)" }}
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                    <span
                      className="text-[14px]"
                      style={{
                        color: isActiveStep ? "var(--foreground)" : "var(--muted-foreground)",
                        fontWeight: isActiveStep ? 500 : 400,
                      }}
                    >
                      {phase.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {isDone && (
              <div
                className="mx-5 mb-5 rounded-md px-4 py-4 text-[13px]"
                style={{ background: "var(--secondary)", flexShrink: 0 }}
              >
                <div className="font-semibold text-foreground mb-1">Filed successfully.</div>
                <div className="text-muted-foreground">
                  DLA $3,521.49 · Per diem $612.52 · MALT $154.00 · TLE $226.20
                </div>
                <a
                  href="/api/agent/receipt"
                  download="pcs-voucher-receipt.pdf"
                  className="mt-2 inline-flex text-[12px] font-medium"
                  style={{ color: "var(--primary)" }}
                >
                  Download receipt →
                </a>
              </div>
            )}

            {isError && (
              <div
                className="mx-5 mb-5 rounded-md px-4 py-4 text-[13px]"
                style={{ background: "#fff3f3", border: "1px solid #b50909", flexShrink: 0 }}
              >
                <div className="font-semibold" style={{ color: "#b50909" }}>
                  Agent encountered an error.
                </div>
                <div style={{ color: "#b50909" }} className="mt-1">
                  Check that the dev server is running and try again.
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — security log ── */}
          <div
            style={{
              flex: 1,
              background: "#0d1117",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              fontFamily:
                "'JetBrains Mono','Fira Code','Cascadia Code','SF Mono',ui-monospace,monospace",
              fontSize: "11px",
            }}
          >
            {/* Header */}
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
                  background: secLive ? "#3fb950" : "#30363d",
                  flexShrink: 0,
                  boxShadow: secLive ? "0 0 6px #3fb950" : "none",
                  transition: "all 0.4s",
                  animation: secLive ? "pulse-dot 2s ease-in-out infinite" : "none",
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
                Security Monitor
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

            {/* Column labels */}
            <div
              style={{
                display: "flex",
                gap: "5px",
                padding: "4px 10px",
                borderBottom: "1px solid #161b22",
                color: "#3d444d",
                fontSize: "9px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              <span style={{ width: "40px" }}>TIME</span>
              <span style={{ width: "8px" }} />
              <span style={{ width: "50px" }}>PHASE</span>
              <span>EVENT</span>
            </div>

            {/* Log entries */}
            <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 8px" }}>
              {events.length === 0 ? (
                <div style={{ color: "#3d444d", padding: "14px 12px", lineHeight: 1.6 }}>
                  {"// agent idle — waiting for task"}
                </div>
              ) : (
                events.map((ev, i) => <SecEntry key={i} ev={ev} />)
              )}
              <div ref={evBottomRef} />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "6px 12px",
                borderTop: "1px solid #21262d",
                display: "flex",
                justifyContent: "space-between",
                color: "#3d444d",
                fontSize: "9px",
                letterSpacing: "0.06em",
                flexShrink: 0,
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
          </div>
        </div>

        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.4; }
          }
        `}</style>
      </SheetContent>
    </Sheet>
  )
}
