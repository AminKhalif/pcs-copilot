import { NextResponse } from "next/server"
import fs from "fs"

const STATUS_FILE = "/tmp/pcs-agent-status.json"

export async function GET() {
  try {
    const raw = fs.readFileSync(STATUS_FILE, "utf-8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({
      status: "idle",
      completedPhases: [],
      error: null,
    })
  }
}
