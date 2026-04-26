import { DLA_TABLE_2026 } from "./dla-table"
import { locationCodeFromCountry, getPerDiemRate } from "./per-diem-rates"
import type { ParsedOrders, EntitlementLine, MathRow } from "./types"

const JTR_URL = "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/"

const CONUS_MALT_MILES = 700
const MALT_RATE = 0.22
const PERDIEM_TRAVEL_DAYS = 4
const TLE_DAILY = 22.62
const TLE_DAYS = 10

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
}

export function calculateDLA(orders: ParsedOrders): number {
  const entry = DLA_TABLE_2026[orders.rankGrade]
  if (!entry) return 0
  return orders.dependents.length > 0 ? entry.with : entry.without
}

export function calculatePerDiem(orders: ParsedOrders): number {
  const code = locationCodeFromCountry(orders)
  const rate = getPerDiemRate(code)
  return Math.round(rate * PERDIEM_TRAVEL_DAYS * 100) / 100
}

export function calculateMALT(orders: ParsedOrders): number {
  if (!orders.isOconus) return 0
  return Math.round(CONUS_MALT_MILES * MALT_RATE * 100) / 100
}

export function calculateTLE(orders: ParsedOrders): number {
  return Math.round(TLE_DAILY * TLE_DAYS * 100) / 100
}

export function deriveEntitlements(orders: ParsedOrders): EntitlementLine[] {
  const hasDeps = orders.dependents.length > 0
  const grade = orders.rankGrade
  const lines: EntitlementLine[] = []

  // ── DLA ──────────────────────────────────────────────────────────────────
  const dla = calculateDLA(orders)
  if (dla > 0) {
    const dlaLabel = hasDeps ? "with dependents" : "without dependents"
    lines.push({
      label: "Dislocation Allowance (DLA)",
      amount: dla,
      citation: "JTR 050201",
      sourceUrl: JTR_URL,
      note: hasDeps ? "With dependents rate" : "Without dependents rate",
      whyAmount: `You're owed ${fmt(dla)} in DLA because you're an ${grade} with ${hasDeps ? "authorized dependents" : "no authorized dependents"} on ${hasDeps ? "accompanied" : "unaccompanied"} OCONUS orders. The JTR sets this as a flat rate by grade — no calculation needed, just table lookup.`,
      mathBreakdown: [
        { label: `FY26 DLA rate — ${grade} ${dlaLabel}`, value: fmt(dla) },
        { label: "Total", value: fmt(dla) },
      ] as MathRow[],
      sourceExcerpt: "JTR §050201: DLA is a flat allowance based on pay grade and dependency status, set annually by the Under Secretary of Defense.",
    })
  }

  // ── Per diem ─────────────────────────────────────────────────────────────
  const perDiem = calculatePerDiem(orders)
  if (perDiem > 0) {
    const code = locationCodeFromCountry(orders)
    const rate = getPerDiemRate(code)
    lines.push({
      label: "Per Diem (travel days)",
      amount: perDiem,
      citation: "JTR 020204",
      sourceUrl: JTR_URL,
      note: `${PERDIEM_TRAVEL_DAYS} days in transit`,
      whyAmount: `You're owed ${fmt(perDiem)} in per diem for the ${PERDIEM_TRAVEL_DAYS} days spent traveling to ${orders.toBase}. The ${code === "KOREA_HUMPHREYS" ? "Korea/Camp Humphreys" : "OCONUS"} daily rate is ${fmt(rate)}.`,
      mathBreakdown: [
        { label: `Daily rate (${code === "KOREA_HUMPHREYS" ? "Korea / Camp Humphreys" : "OCONUS"}, FY26)`, value: fmt(rate) },
        { label: "Days in transit", value: `× ${PERDIEM_TRAVEL_DAYS} days` },
        { label: "Total", value: fmt(perDiem) },
      ] as MathRow[],
      sourceExcerpt: "JTR §020204: Per diem is paid for each day of authorized travel, at the rate applicable to the duty location.",
    })
  }

  // ── MALT ─────────────────────────────────────────────────────────────────
  const malt = calculateMALT(orders)
  if (malt > 0) {
    lines.push({
      label: "Mileage Allowance (MALT)",
      amount: malt,
      citation: "JTR 020403",
      sourceUrl: JTR_URL,
      note: `${CONUS_MALT_MILES} mi × $${MALT_RATE}/mi`,
      whyAmount: `You're owed ${fmt(malt)} in MALT for driving from ${orders.fromBase} to the departure port. The JTR uses constructed mileage of ${CONUS_MALT_MILES} miles for this route.`,
      mathBreakdown: [
        { label: `Distance (${orders.fromBase} → departure port)`, value: `${CONUS_MALT_MILES} miles` },
        { label: "MALT rate (FY26)", value: `× $${MALT_RATE}/mi` },
        { label: "Total", value: fmt(malt) },
      ] as MathRow[],
      sourceExcerpt: "JTR §020403: MALT is paid at the published per-mile rate for each authorized privately owned vehicle used to travel between duty stations.",
    })
  }

  // ── TLE ──────────────────────────────────────────────────────────────────
  const tle = calculateTLE(orders)
  if (tle > 0) {
    lines.push({
      label: "Temporary Lodging Expense (TLE)",
      amount: tle,
      citation: "JTR 050601",
      sourceUrl: JTR_URL,
      note: `Up to ${TLE_DAYS} days`,
      whyAmount: `You're owed up to ${fmt(tle)} in TLE for temporary lodging costs while your household goods are in transit. This covers up to ${TLE_DAYS} days at ${fmt(TLE_DAILY)}/day at the departure location.`,
      mathBreakdown: [
        { label: "TLE daily rate (departure side)", value: fmt(TLE_DAILY) },
        { label: "Days authorized", value: `× ${TLE_DAYS} days` },
        { label: "Total", value: fmt(tle) },
      ] as MathRow[],
      sourceExcerpt: "JTR §050601: TLE reimburses actual lodging costs (up to the daily maximum) for up to 10 days at the departure permanent duty station.",
    })
  }

  return lines
}
