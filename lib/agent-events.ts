export type EventKind = "info" | "success" | "warning" | "blocked"

export type AgentEvent = {
  ts: string       // ISO timestamp
  kind: EventKind
  phase: string    // PAGE_SCAN | SCOPE_CHECK | NAVIGATE | ACTION | AGENT
  message: string
  detail?: string
}
