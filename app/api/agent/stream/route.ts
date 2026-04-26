import fs from "fs"

const EVENTS_FILE = "/tmp/pcs-agent-events.jsonl"

export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()
  let intervalId: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream({
    start(controller) {
      let offset = 0

      intervalId = setInterval(() => {
        try {
          const text = fs.readFileSync(EVENTS_FILE, "utf8")
          const lines = text.split("\n").filter(Boolean)
          const newLines = lines.slice(offset)
          offset = lines.length
          for (const line of newLines) {
            controller.enqueue(encoder.encode(`data: ${line}\n\n`))
          }
        } catch {
          // file may not exist yet — that's fine
        }
      }, 200)
    },
    cancel() {
      if (intervalId !== undefined) clearInterval(intervalId)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
