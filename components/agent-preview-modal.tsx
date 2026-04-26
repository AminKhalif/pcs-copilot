"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { CatalogTask } from "@/lib/tasks-catalog"

type Props = {
  task: CatalogTask | null
  onOpenChange: (open: boolean) => void
  showSampleOutput: boolean
  onShowSample: () => void
  onHideSample: () => void
}

export function AgentPreviewModal({
  task,
  onOpenChange,
  showSampleOutput,
  onShowSample,
  onHideSample,
}: Props) {
  if (!task) return null

  function handleRun() {
    toast("Agent integration coming for this task", {
      description: "Full browser automation for this task is in the next build.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={!!task} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[540px]"
        style={{ background: "#ffffff" }}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-[20px] font-medium text-foreground leading-snug">
            {showSampleOutput ? "Sample output" : "What the agent will do"}
          </DialogTitle>
        </DialogHeader>

        {!showSampleOutput ? (
          <>
            {/* Task title */}
            <p className="text-[14px] text-muted-foreground -mt-1">{task.title}</p>

            {/* Steps */}
            <ol className="mt-4 space-y-3">
              {task.agentSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-[14px]">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold mt-0.5"
                    style={{ background: "var(--secondary)", color: "var(--primary)" }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--foreground)" }}>{step}</span>
                </li>
              ))}
            </ol>

            {/* Meta */}
            <div
              className="mt-5 flex gap-6 rounded-md px-4 py-3 text-[13px]"
              style={{ background: "var(--secondary)" }}
            >
              <div>
                <div className="label-eyebrow text-[10px]">Estimated time</div>
                <div className="text-foreground font-medium mt-0.5">{task.estimatedTime}</div>
              </div>
              <div>
                <div className="label-eyebrow text-[10px]">Time saved</div>
                <div className="text-foreground font-medium mt-0.5">{task.estimatedSavings} of your time</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleRun}
                className="flex-1 rounded-md px-4 py-2.5 text-[14px] font-medium transition-colors"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#173d32")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--primary)")}
              >
                Run agent
              </button>
              <button
                type="button"
                onClick={onShowSample}
                className="flex-1 rounded-md px-4 py-2.5 text-[14px] font-medium transition-colors"
                style={{
                  background: "var(--secondary)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                See sample output
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Sample output */}
            <p className="text-[13px] text-muted-foreground -mt-1">
              {task.sampleOutputTitle}
            </p>
            <pre
              className="mt-4 rounded-md p-4 text-[11px] leading-relaxed font-mono overflow-auto max-h-[380px]"
              style={{
                background: "var(--secondary)",
                color: "var(--foreground)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {task.sampleOutputBody}
            </pre>
            <button
              type="button"
              onClick={onHideSample}
              className="mt-3 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to steps
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
