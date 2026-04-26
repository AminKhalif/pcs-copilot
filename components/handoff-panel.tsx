"use client"

import { useEffect, useRef, useState } from "react"
import { deriveEntitlements } from "@/lib/calculate-entitlements"
import type { ParsedOrders } from "@/lib/types"

const HOLD_MS = 1900   // time the panel stays fully visible
const FADE_MS = 220    // fade in / fade out duration

type Props = {
  open: boolean
  orders: ParsedOrders
  onDismiss: () => void
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
}

export function HandoffPanel({ open, orders, onDismiss }: Props) {
  const [opacity, setOpacity] = useState(0)
  const [barWidth, setBarWidth] = useState(0)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    if (!open) return

    setOpacity(0)
    setBarWidth(0)

    // Frame 1: trigger fade-in and bar growth
    const t1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacity(1)
        setBarWidth(100)
      })
    })

    // Start fade-out
    const t2 = setTimeout(() => setOpacity(0), HOLD_MS)

    // Dismiss after fade-out completes
    const t3 = setTimeout(() => onDismissRef.current(), HOLD_MS + FADE_MS)

    return () => {
      cancelAnimationFrame(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [open])

  if (!open) return null

  const lines = deriveEntitlements(orders)
  const total = lines.reduce((s, l) => s + l.amount, 0)
  const route = `${orders.fromBase}, ${orders.fromState} → ${orders.toBase}, ${orders.toCountry}`

  return (
    // Full-screen overlay — no backdrop click-to-close, auto-dismisses
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="rounded-lg shadow-2xl"
        style={{
          opacity,
          transition: `opacity ${FADE_MS}ms ease`,
          background: "#f3f8f5",
          border: "1.5px solid var(--primary)",
          width: 460,
          padding: "24px 28px 20px",
          pointerEvents: "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="h-2 w-2 rounded-full shrink-0 animate-pulse"
            style={{ background: "var(--primary)" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--primary)", letterSpacing: "0.12em" }}
          >
            Passing context to DTS agent
          </span>
        </div>

        {/* Data rows */}
        <div
          className="rounded-md px-4 py-3 font-mono text-[12px] space-y-0"
          style={{ background: "#e8f0eb", color: "var(--foreground)" }}
        >
          {/* Member */}
          <Row label="NAME"  value={`${orders.lastName}, ${orders.firstName}`} />
          <Row label="GRADE" value={`${orders.rankGrade} / ${orders.rankAbbr}`} />
          <Divider />

          {/* Travel */}
          <Row label="ROUTE"  value={route} />
          <Divider />

          {/* Entitlements */}
          {lines.map((line) => (
            <EntitlementRow key={line.citation} line={line} />
          ))}

          {/* Total */}
          <div
            className="flex justify-between pt-1.5 mt-0.5 font-semibold"
            style={{ borderTop: "1px solid rgba(31,77,63,0.25)", color: "var(--primary)" }}
          >
            <span className="tracking-wider">TOTAL</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="mt-4 h-0.5 rounded-full overflow-hidden"
          style={{ background: "rgba(31,77,63,0.15)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${barWidth}%`,
              background: "var(--primary)",
              transition: `width ${HOLD_MS + FADE_MS}ms linear`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span
        className="shrink-0 tracking-wider text-[10px]"
        style={{ color: "var(--muted-foreground)", paddingTop: 1 }}
      >
        {label}
      </span>
      <span className="text-right text-[12px]" style={{ color: "var(--foreground)" }}>
        {value}
      </span>
    </div>
  )
}

function EntitlementRow({ line }: { line: ReturnType<typeof deriveEntitlements>[0] }) {
  const fmt2 = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })

  // Shorten the label for display
  const shortLabel = line.label.replace(" (DLA)", "").replace(" (MALT)", "").replace(" (TLE)", "")

  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <div className="min-w-0">
        <span className="text-[12px]" style={{ color: "var(--foreground)" }}>
          {shortLabel}
        </span>
        {line.note && (
          <span className="ml-2 text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            {line.note}
          </span>
        )}
      </div>
      <span className="shrink-0 tabular-nums text-[12px]" style={{ color: "var(--primary)", fontWeight: 600 }}>
        {fmt2(line.amount)}
      </span>
    </div>
  )
}

function Divider() {
  return (
    <div
      className="my-1"
      style={{ borderTop: "1px solid rgba(31,77,63,0.15)" }}
    />
  )
}
