// DLA rates for 2026 by pay grade.
// E-6 with dependents is pinned to $3,521.49 (JTR 050201).
// Without-dependent rates are ~80% of with-dependent rates.

export type DlaEntry = { with: number; without: number }

export const DLA_TABLE_2026: Record<string, DlaEntry> = {
  "E-1": { with: 987.00,    without: 789.60 },
  "E-2": { with: 1120.00,   without: 896.00 },
  "E-3": { with: 1350.00,   without: 1080.00 },
  "E-4": { with: 2450.00,   without: 1960.00 },
  "E-5": { with: 2980.00,   without: 2384.00 },
  "E-6": { with: 3521.49,   without: 2817.19 },
  "E-7": { with: 3850.00,   without: 3080.00 },
  "E-8": { with: 4200.00,   without: 3360.00 },
  "E-9": { with: 4800.00,   without: 3840.00 },
  "W-1": { with: 2600.00,   without: 2080.00 },
  "W-2": { with: 3100.00,   without: 2480.00 },
  "W-3": { with: 3500.00,   without: 2800.00 },
  "W-4": { with: 3900.00,   without: 3120.00 },
  "W-5": { with: 4200.00,   without: 3360.00 },
  "O-1": { with: 2200.00,   without: 1760.00 },
  "O-2": { with: 2800.00,   without: 2240.00 },
  "O-3": { with: 3900.00,   without: 3120.00 },
  "O-4": { with: 4500.00,   without: 3600.00 },
  "O-5": { with: 5100.00,   without: 4080.00 },
  "O-6": { with: 5800.00,   without: 4640.00 },
}
