"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { CitationPill } from "@/components/citation-pill"
import { deriveEntitlements } from "@/lib/calculate-entitlements"
import type { ParsedOrders, EntitlementLine } from "@/lib/types"

const FALLBACK_LINES: EntitlementLine[] = [
  {
    label: "Dislocation Allowance (DLA)",
    amount: 3521.49,
    citation: "JTR 050201",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
    note: "With dependents rate",
    whyAmount: "You're owed $3,521.49 in DLA because you're an E-6 with authorized dependents on accompanied OCONUS orders. The JTR sets this as a flat rate by grade.",
    mathBreakdown: [
      { label: "FY26 DLA rate — E-6 with dependents", value: "$3,521.49" },
      { label: "Total", value: "$3,521.49" },
    ],
    sourceExcerpt: "JTR §050201: DLA is a flat allowance based on pay grade and dependency status, set annually by the Under Secretary of Defense.",
  },
  {
    label: "Per Diem (travel days)",
    amount: 612.52,
    citation: "JTR 020204",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
    note: "4 days in transit",
    whyAmount: "You're owed $612.52 in per diem for 4 days of authorized travel to Camp Humphreys. The Korea/Camp Humphreys daily rate is $153.13.",
    mathBreakdown: [
      { label: "Daily rate (Korea / Camp Humphreys, FY26)", value: "$153.13" },
      { label: "Days in transit", value: "× 4 days" },
      { label: "Total", value: "$612.52" },
    ],
    sourceExcerpt: "JTR §020204: Per diem is paid for each day of authorized travel, at the rate applicable to the duty location.",
  },
  {
    label: "Mileage Allowance (MALT)",
    amount: 154.00,
    citation: "JTR 020403",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
    note: "700 mi × $0.22/mi",
    whyAmount: "You're owed $154.00 in MALT for driving from Fort Bragg to the departure port. The JTR uses a constructed mileage of 700 miles for this route.",
    mathBreakdown: [
      { label: "Distance (Fort Bragg → departure port)", value: "700 miles" },
      { label: "MALT rate (FY26)", value: "× $0.22/mi" },
      { label: "Total", value: "$154.00" },
    ],
    sourceExcerpt: "JTR §020403: MALT is paid at the published per-mile rate for each authorized privately owned vehicle used to travel between duty stations.",
  },
  {
    label: "Temporary Lodging Expense (TLE)",
    amount: 226.20,
    citation: "JTR 050601",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
    note: "Up to 10 days",
    whyAmount: "You're owed up to $226.20 in TLE for temporary lodging costs while your household goods are in transit — covers up to 10 days at $22.62/day.",
    mathBreakdown: [
      { label: "TLE daily rate (departure side)", value: "$22.62" },
      { label: "Days authorized", value: "× 10 days" },
      { label: "Total", value: "$226.20" },
    ],
    sourceExcerpt: "JTR §050601: TLE reimburses actual lodging costs (up to the daily maximum) for up to 10 days at the departure permanent duty station.",
  },
]

type Props = {
  parsedOrders?: ParsedOrders
  dtsDone?: boolean
}

function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function MoneyCard({ parsedOrders, dtsDone }: Props) {
  const lines = parsedOrders ? deriveEntitlements(parsedOrders) : FALLBACK_LINES
  const total = lines.reduce((sum, l) => sum + l.amount, 0)
  const [value, setValue] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue((1 - Math.pow(1 - t, 3)) * total)
      if (t < 1) frameRef.current = requestAnimationFrame(tick)
      else setValue(total)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [total])

  return (
    <section className="card-surface px-10 py-10">
      <div className="label-eyebrow">What you&apos;re owed</div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <span
          aria-live="polite"
          className="font-serif font-medium leading-none tracking-tight tabular-nums"
          style={{ fontSize: 64, color: "var(--gold)" }}
        >
          {formatMoney(value)}
        </span>
        <div>
          <p className="text-[14px] text-muted-foreground">
            Most service members miss claiming this.
          </p>
          {dtsDone && (
            <div
              className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium rounded-full px-2.5 py-0.5"
              style={{ background: "#e0ede8", color: "var(--primary)" }}
            >
              <Check className="h-3 w-3" strokeWidth={2.5} />
              {formatMoney(total)} of {formatMoney(total)} claimed
            </div>
          )}
        </div>
      </div>

      <ul className="mt-8">
        {lines.map((line, i) => {
          const isExpanded = expandedId === line.citation
          const hasDetail = !!line.whyAmount

          return (
            <li
              key={line.citation + line.label}
              className={i !== 0 ? "border-t border-[var(--border)]" : ""}
            >
              {/* Row */}
              <div
                className="flex items-center gap-4 px-3 py-4 -mx-3 rounded-md transition-colors"
                style={{ cursor: hasDetail ? "pointer" : "default" }}
                onClick={() => hasDetail && setExpandedId(isExpanded ? null : line.citation)}
                role={hasDetail ? "button" : undefined}
                tabIndex={hasDetail ? 0 : undefined}
                onKeyDown={(e) => {
                  if (hasDetail && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    setExpandedId(isExpanded ? null : line.citation)
                  }
                }}
              >
                <span className="flex-1 text-[15px] text-foreground">
                  {line.label}
                  {line.note && (
                    <span className="ml-2 text-[12px] text-muted-foreground">{line.note}</span>
                  )}
                </span>

                {dtsDone && (
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#e0ede8", color: "var(--primary)" }}
                  >
                    ✓ Claimed
                  </span>
                )}

                <CitationPill label={line.citation} href={line.sourceUrl} />

                <div className="text-right min-w-[110px]">
                  <div className="label-eyebrow text-[10px]" style={{ letterSpacing: "0.08em" }}>
                    You&apos;re owed
                  </div>
                  <div className="font-serif text-[20px] tabular-nums text-foreground">
                    {formatMoney(line.amount)}
                  </div>
                </div>

                {hasDetail && (
                  <div className="shrink-0 ml-1" style={{ color: "var(--muted-foreground)" }}>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </div>
                )}
              </div>

              {/* Expanded detail */}
              {isExpanded && line.whyAmount && (
                <div
                  className="mx-3 mb-4 rounded-md px-5 py-4 text-[13px]"
                  style={{ background: "var(--secondary)" }}
                >
                  <div className="font-semibold text-foreground mb-1">Why this amount</div>
                  <p className="text-muted-foreground leading-relaxed">{line.whyAmount}</p>

                  {line.mathBreakdown && line.mathBreakdown.length > 0 && (
                    <div className="mt-4">
                      <div className="font-semibold text-foreground mb-2">The math</div>
                      <table className="w-full text-[12px]">
                        <tbody>
                          {line.mathBreakdown.map((row, ri) => {
                            const isLast = ri === line.mathBreakdown!.length - 1
                            return (
                              <tr
                                key={ri}
                                style={
                                  isLast
                                    ? {
                                        borderTop: "1px solid var(--border)",
                                        fontWeight: 600,
                                        paddingTop: 4,
                                      }
                                    : {}
                                }
                              >
                                <td
                                  className="py-0.5 font-mono"
                                  style={{ color: "var(--muted-foreground)" }}
                                >
                                  {row.label}
                                </td>
                                <td
                                  className="py-0.5 text-right font-mono tabular-nums"
                                  style={{ color: isLast ? "var(--foreground)" : "var(--muted-foreground)" }}
                                >
                                  {row.value}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {line.sourceExcerpt && (
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <div className="font-semibold text-foreground mb-1">Source</div>
                      <p className="text-muted-foreground leading-relaxed italic">
                        &ldquo;{line.sourceExcerpt}&rdquo;
                      </p>
                      <div className="mt-2">
                        <CitationPill label={line.citation} href={line.sourceUrl} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {/* Callout */}
      <div
        className="mt-8 flex items-start gap-3 rounded-md px-5 py-4"
        style={{ background: "var(--secondary)" }}
      >
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--primary)" }}
        >
          <Check className="h-3 w-3" strokeWidth={2.5} style={{ color: "var(--primary-foreground)" }} />
        </span>
        <p className="text-[14px] text-foreground/90">
          {dtsDone
            ? "All entitlements filed. Direct deposit expected within 3–5 business days."
            : "We'll help you claim every dollar when you submit your travel voucher."}
        </p>
      </div>
    </section>
  )
}
