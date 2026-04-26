"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react"
import { AgentPanel } from "@/components/agent-panel"
import { CitationPill } from "@/components/citation-pill"
import { TaskDetailPanel } from "@/components/task-detail-panel"
import { AgentPreviewModal } from "@/components/agent-preview-modal"
import { HandoffPanel } from "@/components/handoff-panel"
import { getApplicableTasks, type CatalogTask } from "@/lib/tasks-catalog"
import { renderWithGlossary } from "@/components/glossary-term"
import type { ParsedOrders } from "@/lib/types"

const FALLBACK_ORDERS: ParsedOrders = {
  firstName: "John", lastName: "Smith", rankAbbr: "SSG", rankGrade: "E-6",
  fromBase: "Fort Bragg", fromState: "North Carolina",
  toBase: "Camp Humphreys", toCountry: "Republic of Korea",
  reportDate: "2026-07-15", tourLength: "24 months", tourType: "accompanied",
  dependents: [
    { firstName: "Maria", lastName: "Smith", relationship: "SPOUSE" },
    { firstName: "Emma", lastName: "Smith", relationship: "CHILD" },
  ],
  isOconus: true, ordersNumber: "095-001",
}

type Props = {
  parsedOrders?: ParsedOrders
  dtsDone?: boolean
  onDtsDone?: () => void
  onAgentStart?: () => void
  onDemoReset?: () => void
}

export function WorkCard({ parsedOrders, dtsDone, onDtsDone, onAgentStart, onDemoReset }: Props) {
  const [agentPanelOpen, setAgentPanelOpen] = useState(false)
  const [handoffOpen, setHandoffOpen] = useState(false)
  const [detailTask, setDetailTask] = useState<CatalogTask | null>(null)
  const [previewTask, setPreviewTask] = useState<CatalogTask | null>(null)
  const [showSample, setShowSample] = useState(false)
  const [portalMode, setPortalMode] = useState<"clean" | "compromised">("clean")

  const orders = parsedOrders ?? FALLBACK_ORDERS
  const tasks = getApplicableTasks(orders)

  function handleDtsTask() {
    setDetailTask(null)
    setHandoffOpen(true)
    // Browser agent starts after handoff panel fades out (via onDismiss)
  }

  async function handleHandoffDismiss() {
    setHandoffOpen(false)
    await fetch("/api/agent/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portal: portalMode }),
    }).catch(() => null)
    onAgentStart?.()
    setAgentPanelOpen(true)
  }

  async function handleReset() {
    await fetch("/api/agent/reset", { method: "POST" }).catch(() => null)
    setAgentPanelOpen(false)
    setHandoffOpen(false)
    onDemoReset?.()
  }

  function handleTaskButton(task: CatalogTask) {
    if (task.isAgentEnabled) {
      handleDtsTask()
    } else {
      setPreviewTask(task)
      setShowSample(false)
    }
  }

  function handleDetailPanelAction(task: CatalogTask) {
    setDetailTask(null)
    handleTaskButton(task)
  }

  function handleRowClick(task: CatalogTask) {
    setDetailTask(task)
  }

  return (
    <section className="card-surface px-10 py-10">
      <div className="label-eyebrow">What&apos;s next</div>
      <h2 className="font-serif mt-3 text-[28px] leading-tight text-foreground">
        The next things on your plate.
      </h2>

      {/* Portal mode toggle + Reset — for security demo */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Demo portal</span>
        <div
          className="flex rounded-md overflow-hidden text-[11px] font-medium"
          style={{ border: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={() => setPortalMode("clean")}
            className="px-3 py-1 transition-colors"
            style={{
              background: portalMode === "clean" ? "var(--primary)" : "transparent",
              color: portalMode === "clean" ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            Clean
          </button>
          <button
            type="button"
            onClick={() => setPortalMode("compromised")}
            className="px-3 py-1 transition-colors"
            style={{
              background: portalMode === "compromised" ? "#b91c1c" : "transparent",
              color: portalMode === "compromised" ? "#fff" : "var(--muted-foreground)",
              borderLeft: "1px solid var(--border)",
            }}
          >
            ⚠ Compromised
          </button>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-medium transition-colors"
          style={{
            border: "1px solid var(--border)",
            color: "var(--muted-foreground)",
            background: "transparent",
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
          <RotateCcw className="h-3 w-3" strokeWidth={2} />
          Reset demo
        </button>

        {portalMode === "compromised" && (
          <span className="text-[11px]" style={{ color: "#b91c1c" }}>
            Injection active — watch the security monitor
          </span>
        )}
      </div>

      <ul className="mt-6 divide-y divide-[var(--border)]">
        {tasks.map((task) => {
          const isCompleted = dtsDone && task.id === "dts-voucher"
          const isRecommended = dtsDone && task.id === tasks[0]?.id && task.id !== "dts-voucher"

          return (
            <li
              key={task.id}
              className="flex items-center gap-6 py-5"
              style={{ opacity: isCompleted ? 0.7 : 1 }}
            >
              {/* Date pill */}
              <div
                className="shrink-0 w-[70px] text-center rounded-md border px-2 py-2.5"
                style={{ background: "var(--secondary)", borderColor: "var(--border)" }}
              >
                <div
                  className="text-[10px] font-medium uppercase"
                  style={{ letterSpacing: "0.08em", color: "var(--muted-foreground)" }}
                >
                  {task.month}
                </div>
                <div className="font-serif text-[24px] leading-none mt-1 text-foreground">
                  {task.day}
                </div>
              </div>

              {/* Task body — clickable to open detail panel */}
              <div
                className="flex-1 min-w-0 cursor-pointer group"
                onClick={() => handleRowClick(task)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleRowClick(task)
                  }
                }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[15px] font-semibold text-foreground group-hover:underline decoration-[var(--border)] underline-offset-2 transition-colors">
                    {task.title}
                  </span>
                  {task.citation && task.sourceUrl && (
                    <CitationPill label={task.citation} href={task.sourceUrl} />
                  )}
                  {isRecommended && (
                    <span
                      className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: "#e0ede8", color: "var(--primary)" }}
                    >
                      Recommended next
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">
                  {renderWithGlossary(task.description(orders))}
                </p>
              </div>

              {/* Action button */}
              {isCompleted ? (
                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  <div
                    className="flex items-center gap-1.5 text-[13px] font-medium"
                    style={{ color: "var(--primary)" }}
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                    Completed
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Confirmation #DTS-2026-09451
                  </div>
                  <a
                    href="/api/agent/receipt"
                    download="pcs-voucher-receipt.pdf"
                    className="text-[11px] transition-colors"
                    style={{ color: "var(--primary)" }}
                  >
                    View receipt →
                  </a>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTaskButton(task)
                  }}
                  className="shrink-0 inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-medium transition-colors"
                  style={{
                    background: task.isAgentEnabled ? "var(--primary)" : "var(--secondary)",
                    color: task.isAgentEnabled ? "var(--primary-foreground)" : "var(--foreground)",
                    border: task.isAgentEnabled ? "none" : "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    if (task.isAgentEnabled) e.currentTarget.style.background = "#173d32"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = task.isAgentEnabled
                      ? "var(--primary)"
                      : "var(--secondary)"
                  }}
                >
                  Handle this for me
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <HandoffPanel
        open={handoffOpen}
        orders={orders}
        onDismiss={handleHandoffDismiss}
      />

      <AgentPanel
        open={agentPanelOpen}
        onOpenChange={setAgentPanelOpen}
        onDone={onDtsDone}
      />

      <TaskDetailPanel
        task={detailTask}
        orders={orders}
        onClose={() => setDetailTask(null)}
        onHandleClick={handleDetailPanelAction}
      />

      <AgentPreviewModal
        task={previewTask}
        onOpenChange={(open) => {
          if (!open) setPreviewTask(null)
        }}
        showSampleOutput={showSample}
        onShowSample={() => setShowSample(true)}
        onHideSample={() => setShowSample(false)}
      />
    </section>
  )
}
