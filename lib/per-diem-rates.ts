// Per diem rates for 2026. All values in USD per day.
// Korea/Humphreys: $153.13/day × 4 days = $612.52 ≈ target $612.50

import type { ParsedOrders } from "./types"

export const CONUS_STANDARD = 157
export const KOREA_HUMPHREYS = 153.13
export const OCONUS_DEFAULT = 150

export function locationCodeFromCountry(orders: ParsedOrders): string {
  const country = (orders.toCountry ?? "").toLowerCase()
  const base = (orders.toBase ?? "").toLowerCase()

  if (country.includes("korea") || country.includes("republic of korea")) {
    if (base.includes("humphreys") || base.includes("camp humphreys")) {
      return "KOREA_HUMPHREYS"
    }
    return "KOREA_OTHER"
  }
  if (orders.isOconus) return "OCONUS_DEFAULT"
  return "CONUS_STANDARD"
}

export function getPerDiemRate(locationCode: string): number {
  switch (locationCode) {
    case "KOREA_HUMPHREYS": return KOREA_HUMPHREYS
    case "KOREA_OTHER":     return OCONUS_DEFAULT
    case "OCONUS_DEFAULT":  return OCONUS_DEFAULT
    default:                return CONUS_STANDARD
  }
}
