import { NextResponse } from "next/server"
import fs from "fs"

const STATUS_FILE = "/tmp/pcs-agent-status.json"
const EVENTS_FILE = "/tmp/pcs-agent-events.jsonl"
const PID_FILE    = "/tmp/pcs-agent.pid"

export async function POST() {
  // Kill any running agent process
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim(), 10)
    if (!isNaN(pid)) process.kill(pid, "SIGTERM")
  } catch {
    // no agent running
  }

  fs.writeFileSync(EVENTS_FILE, "")
  fs.writeFileSync(
    STATUS_FILE,
    JSON.stringify({
      status: "idle",
      completedPhases: [],
      error: null,
      updatedAt: new Date().toISOString(),
    })
  )
  return NextResponse.json({ reset: true })
}
