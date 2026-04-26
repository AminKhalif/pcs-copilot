"use client"

import { Plane } from "lucide-react"
import type { ParsedOrders } from "@/lib/types"

type Props = {
  parsedOrders?: ParsedOrders
  onEdit?: () => void
}

function formatReportDate(iso: string): string {
  const d = new Date(iso + "T12:00:00Z")
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
}

function daysUntil(iso: string): number {
  const target = new Date(iso + "T12:00:00Z").getTime()
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target - now.getTime()) / 86_400_000))
}

function listNames(names: string[]): string {
  if (names.length === 0) return ""
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`
}

export function HeroOrders({ parsedOrders, onEdit }: Props) {
  const fromPlace = parsedOrders
    ? `${parsedOrders.fromBase}, ${parsedOrders.fromState}`
    : "Fort Bragg, North Carolina"

  const toPlace = parsedOrders
    ? `${parsedOrders.toBase}, ${parsedOrders.toCountry}`
    : "Camp Humphreys, South Korea"

  const dependentNames = parsedOrders
    ? parsedOrders.dependents.map((d) => d.firstName)
    : ["Maria", "Emma"]

  const days = parsedOrders ? daysUntil(parsedOrders.reportDate) : 81

  const reportDateDisplay = parsedOrders
    ? formatReportDate(parsedOrders.reportDate)
    : "July 15, 2026"

  const tourMeta = parsedOrders
    ? `${parsedOrders.tourType.charAt(0).toUpperCase() + parsedOrders.tourType.slice(1)} ${parsedOrders.isOconus ? "OCONUS" : "CONUS"} tour · ${parsedOrders.tourLength}`
    : "Accompanied OCONUS tour · 24 months"

  const ordersNumber = parsedOrders?.ordersNumber ?? "095-001"

  const family = parsedOrders
    ? [
        { initials: parsedOrders.firstName[0] + parsedOrders.lastName[0], label: parsedOrders.firstName },
        ...parsedOrders.dependents.map((d) => ({
          initials: d.firstName[0] + d.lastName[0],
          label: d.firstName,
        })),
      ]
    : [
        { initials: "JS", label: "John" },
        { initials: "MS", label: "Maria" },
        { initials: "ES", label: "Emma" },
      ]

  const allFirstNames = parsedOrders
    ? [parsedOrders.firstName, ...dependentNames]
    : ["John", "Maria", "Emma"]
  const familyLine = `${listNames(allFirstNames)} — moving together on accompanied orders.`

  return (
    <section className="card-surface relative px-10 py-10">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-8 top-7 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit orders
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10">
        {/* Left: orders summary */}
        <div className="relative pl-7">
          <div
            aria-hidden
            className="absolute left-0 top-1 flex flex-col items-center"
            style={{ color: "var(--primary)" }}
          >
            <Plane className="h-4 w-4 -rotate-45" strokeWidth={1.5} />
            <span
              className="mt-2 block w-px"
              style={{ height: 56, background: "var(--border)" }}
            />
          </div>

          <div className="label-eyebrow">Your orders</div>
          <h1 className="font-serif mt-3 text-[32px] leading-[1.25] text-foreground">
            You&apos;re moving from{" "}
            <span className="font-semibold">{fromPlace}</span> to{" "}
            <span className="font-semibold">{toPlace}</span>
            {dependentNames.length > 0 && (
              <>
                {" "}with{" "}
                {dependentNames.map((name, i) => (
                  <span key={name}>
                    <span className="font-semibold">{name}</span>
                    {i < dependentNames.length - 2 && ", "}
                    {i === dependentNames.length - 2 && " and "}
                  </span>
                ))}
              </>
            )}
            .
          </h1>

          <ul className="mt-6 space-y-1.5 text-[14px] text-muted-foreground">
            <li>{tourMeta}</li>
            <li>Reporting by {reportDateDisplay}</li>
            <li>Authorized by Orders {ordersNumber}</li>
          </ul>
        </div>

        {/* Right: countdown */}
        <div className="md:pl-2">
          <div className="flex items-baseline gap-3">
            <span
              className="font-serif font-medium leading-none tracking-tight"
              style={{ fontSize: 88, color: "var(--primary)" }}
            >
              {days}
            </span>
            <span className="font-serif text-[28px] text-muted-foreground">days</span>
          </div>
          <div className="label-eyebrow mt-3">Until you report</div>
        </div>
      </div>

      {/* Dotted divider */}
      <div
        aria-hidden
        className="my-8 border-t border-dotted"
        style={{ borderColor: "var(--border)" }}
      />

      {/* Family row */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {family.map((m) => (
            <div
              key={m.initials + m.label}
              title={m.label}
              className="flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-medium"
              style={{
                background: "var(--secondary)",
                borderColor: "var(--primary)",
                color: "var(--primary)",
              }}
            >
              {m.initials}
            </div>
          ))}
        </div>
        <p className="text-[14px] text-muted-foreground">{familyLine}</p>
      </div>
    </section>
  )
}
