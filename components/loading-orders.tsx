"use client"

import { useEffect, useState } from "react"

const STEPS = [
  "Reading SSG Smith's orders…",
  "Found: E-6, Fort Bragg → Camp Humphreys, July 15",
  "Cross-referencing JTR Chapter 5…",
  "DLA rate: E-6 with dependents = $3,521.49",
  "Checking USFK Regulation 600-106…",
  "Korea requires SOFA stamp for accompanied dependents",
  "Identifying applicable forms…",
  "DD 1351-2, DA 31, Form 5434-E, DS-11",
  "Building 90-day timeline…",
  "8 tasks identified for your situation",
]

export function LoadingOrders() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (index >= STEPS.length - 1) return

    const crossfade = setTimeout(() => setVisible(false), 540)
    const advance = setTimeout(() => {
      setIndex((i) => i + 1)
      setVisible(true)
    }, 600)

    return () => {
      clearTimeout(crossfade)
      clearTimeout(advance)
    }
  }, [index])

  const step = STEPS[index]
  const isResult = index % 2 === 1 // even = query, odd = finding

  return (
    <div className="mx-auto max-w-[960px] px-8 pt-16 pb-20">
      <div className="card-surface px-10 py-16 flex flex-col items-center text-center">
        {/* Spinner */}
        <div
          className="h-10 w-10 rounded-full border-2 animate-spin mb-8 shrink-0"
          style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
          aria-hidden
        />

        {/* Fixed-height container so layout never jumps */}
        <div className="h-[2.8rem] flex items-center justify-center w-full">
          <p
            className="font-serif text-[20px] leading-snug transition-opacity duration-150"
            style={{
              opacity: visible ? 1 : 0,
              color: isResult ? "var(--primary)" : "var(--foreground)",
            }}
          >
            {step}
          </p>
        </div>

        <p className="mt-4 text-[13px] text-muted-foreground">
          Parsing your orders with AI — usually under 10 seconds.
        </p>

        {/* Progress dots */}
        <div className="mt-6 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 20 : 6,
                background: i <= index ? "var(--primary)" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
