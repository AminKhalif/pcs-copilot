"use client"

import { X } from "lucide-react"
import { CitationPill } from "@/components/citation-pill"
import { renderWithGlossary } from "@/components/glossary-term"
import type { CatalogTask } from "@/lib/tasks-catalog"
import type { ParsedOrders } from "@/lib/types"

type Props = {
  task: CatalogTask | null
  orders: ParsedOrders
  onClose: () => void
  onHandleClick: (task: CatalogTask) => void
}

export function TaskDetailPanel({ task, orders, onClose, onHandleClick }: Props) {
  if (!task) return null

  const whyPoints = task.whyApplies(orders)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 z-50 h-full w-[480px] overflow-y-auto shadow-2xl"
        style={{ background: "#ffffff", borderLeft: "1px solid var(--border)" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-start justify-between gap-4 px-8 pt-8 pb-6"
          style={{ background: "#ffffff", borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <div className="label-eyebrow text-[10px]">
              {task.month} {task.day}
            </div>
            <h2 className="font-serif text-[22px] leading-snug text-foreground mt-1">
              {task.title}
            </h2>
            {task.citation && task.sourceUrl && (
              <div className="mt-2">
                <CitationPill label={task.citation} href={task.sourceUrl} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 mt-1 rounded-md p-1.5 transition-colors hover:bg-[var(--secondary)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" style={{ color: "var(--muted-foreground)" }} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-8">
          {/* Why this applies */}
          <section>
            <div className="label-eyebrow">Why this applies to you</div>
            <ul className="mt-3 space-y-2">
              {whyPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-[14px]" style={{ color: "var(--muted-foreground)" }}>
                  <span
                    className="mt-1 h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: "var(--primary)" }}
                  />
                  <span>{renderWithGlossary(point)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* What needs to happen */}
          <section>
            <div className="label-eyebrow">What needs to happen</div>
            <p
              className="mt-3 text-[14px] leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {renderWithGlossary(task.whatHappens)}
            </p>
          </section>

          {/* Why it matters */}
          <section>
            <div className="label-eyebrow">Why it matters</div>
            <p
              className="mt-3 text-[14px] leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {task.whyItMatters}
            </p>
          </section>
        </div>

        {/* Footer action */}
        <div
          className="sticky bottom-0 px-8 py-5"
          style={{ background: "#ffffff", borderTop: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={() => onHandleClick(task)}
            className="w-full rounded-md px-5 py-3 text-[14px] font-medium transition-colors"
            style={{
              background: task.isAgentEnabled ? "var(--primary)" : "var(--secondary)",
              color: task.isAgentEnabled ? "var(--primary-foreground)" : "var(--foreground)",
              border: task.isAgentEnabled ? "none" : "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              if (task.isAgentEnabled) e.currentTarget.style.background = "#173d32"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = task.isAgentEnabled ? "var(--primary)" : "var(--secondary)"
            }}
          >
            {task.isAgentEnabled ? "Run agent now" : "Handle this for me"}
          </button>
        </div>
      </div>
    </>
  )
}
