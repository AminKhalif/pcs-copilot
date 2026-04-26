"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { ExternalLink } from "lucide-react"
import { CITATION_DETAILS } from "@/lib/glossary"

type Props = {
  label: string
  href: string
}

export function CitationPill({ label, href }: Props) {
  const detail = CITATION_DETAILS[label]

  const pill = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wide px-2 py-0.5 rounded transition-colors"
      style={{
        background: "var(--secondary)",
        color: "var(--muted-foreground)",
        border: "1px solid var(--border)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--foreground)"
        e.currentTarget.style.borderColor = "var(--foreground)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--muted-foreground)"
        e.currentTarget.style.borderColor = "var(--border)"
      }}
    >
      {label}
      <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
    </a>
  )

  if (!detail) return pill

  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{pill}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="z-50 rounded-md shadow-md"
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              padding: "10px 12px",
              maxWidth: 300,
            }}
          >
            <div
              className="text-[12px] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {detail.fullName}
            </div>
            <div
              className="mt-1 text-[11px] leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {detail.explanation}
            </div>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px]"
              style={{ color: "var(--primary)" }}
            >
              Read source
              <ExternalLink className="h-2.5 w-2.5" strokeWidth={1.5} />
            </a>
            <TooltipPrimitive.Arrow style={{ fill: "#ffffff" }} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
