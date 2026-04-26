import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import fs from "fs"
import path from "path"

const STATUS_FILE = "/tmp/pcs-agent-status.json"
const EVENTS_FILE = "/tmp/pcs-agent-events.jsonl"
const PID_FILE    = "/tmp/pcs-agent.pid"

function killExistingAgent() {
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim(), 10)
    if (!isNaN(pid)) process.kill(pid, "SIGTERM")
  } catch {
    // no previous agent running
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const portal: string = body.portal === "compromised" ? "compromised" : "clean"

  // Kill any still-running agent so its events don't leak into this run
  killExistingAgent()

  // Reset files so the panel starts fresh
  fs.writeFileSync(EVENTS_FILE, "")
  fs.writeFileSync(
    STATUS_FILE,
    JSON.stringify({
      status: "starting",
      completedPhases: [],
      error: null,
      updatedAt: new Date().toISOString(),
    })
  )

  const agentPath = path.join(process.cwd(), "agent", "agent.py")
  const python    = path.join(process.cwd(), "agent", ".venv312", "bin", "python3")

  const child = spawn(python, [agentPath, "--portal", portal], {
    detached: true,
    stdio: "ignore",
    cwd: process.cwd(),
    env: { ...process.env },
  })
  child.unref()

  // Track the PID so the next run (or reset) can kill this one
  if (child.pid) fs.writeFileSync(PID_FILE, String(child.pid))

  return NextResponse.json({ started: true, portal })
}
