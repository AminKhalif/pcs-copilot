"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { ExternalLink } from "lucide-react"
import { GLOSSARY } from "@/lib/glossary"
import type { ReactNode } from "react"

type Props = {
  term: string
  children: ReactNode
}

export function GlossaryTerm({ term, children }: Props) {
  const entry = GLOSSARY[term]
  if (!entry) return <>{children}</>

  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <span
            style={{
              borderBottom: "1px dotted var(--muted-foreground)",
              cursor: "help",
              textDecoration: "none",
            }}
          >
            {children}
          </span>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="z-50 rounded-md shadow-md"
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              padding: "10px 12px",
              maxWidth: 280,
            }}
          >
            <div
              className="text-[12px] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {entry.fullName}
            </div>
            <div
              className="mt-1 text-[11px] leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {entry.explanation}
            </div>
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px]"
              style={{ color: "var(--primary)" }}
            >
              Read source
              <ExternalLink className="h-2.5 w-2.5" strokeWidth={1.5} />
            </a>
            <TooltipPrimitive.Arrow
              className="z-50"
              style={{ fill: "#ffffff" }}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

// Utility: parse a string and wrap known glossary terms with GlossaryTerm
const SIMPLE_TERMS = [
  "OCONUS", "CONUS", "SOFA", "EFMP", "MALT", "TLE", "OHA", "DLA",
  "DTS", "DPS", "DoDEA", "MTF", "TDY", "JTR", "DoDI", "USFK",
  "JAG", "POA", "DEERS",
]

// Sorted longest-first so "DoDEA" matches before "DoD", etc.
const TERM_PATTERN = new RegExp(
  `\\b(${SIMPLE_TERMS.sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g"
)

export function renderWithGlossary(text: string): ReactNode {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  TERM_PATTERN.lastIndex = 0
  while ((match = TERM_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const term = match[1]
    parts.push(
      <GlossaryTerm key={match.index} term={term}>
        {term}
      </GlossaryTerm>
    )
    lastIndex = TERM_PATTERN.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length > 0 ? <>{parts}</> : text
}
