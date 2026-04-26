export type Dependent = {
  firstName: string
  lastName: string
  relationship: "SPOUSE" | "CHILD" | string
  dob?: string // ISO date, e.g. "2017-03-12"
}

export type ParsedOrders = {
  firstName: string      // "John"
  lastName: string       // "Smith"
  rankAbbr: string       // "SSG"
  rankGrade: string      // "E-6"
  fromBase: string       // "Fort Bragg"
  fromState: string      // "North Carolina"
  toBase: string         // "Camp Humphreys"
  toCountry: string      // "South Korea"
  reportDate: string     // "2026-07-15"
  tourLength: string     // "24 months"
  tourType: string       // "accompanied"
  dependents: Dependent[]
  isOconus: boolean
  ordersNumber: string   // "095-001"
}

export type MathRow = { label: string; value: string }

export type EntitlementLine = {
  label: string
  amount: number
  citation: string
  sourceUrl: string
  note?: string
  whyAmount?: string
  mathBreakdown?: MathRow[]
  sourceExcerpt?: string
}
