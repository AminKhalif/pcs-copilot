import { NextRequest, NextResponse } from "next/server"
import type { ParsedOrders } from "@/lib/types"

const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1"

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const SYSTEM_PROMPT = `You are a military orders parser. Extract fields from US Army assignment orders and return ONLY a valid JSON object — no markdown, no explanation, nothing else before or after the JSON.

Return exactly this JSON shape:
{
  "firstName": "first name of the service member only, no middle initial",
  "lastName": "last name of the service member",
  "rankAbbr": "rank abbreviation (e.g. SSG, CPT, MAJ)",
  "rankGrade": "pay grade — map: PVT=E-1, PV2=E-2, PFC=E-3, SPC=E-4, CPL=E-4, SGT=E-5, SSG=E-6, SFC=E-7, MSG=E-8, SGM=E-9, 2LT=O-1, 1LT=O-2, CPT=O-3, MAJ=O-4, LTC=O-5, COL=O-6",
  "fromBase": "title-cased name of origin installation only, no state (e.g. Fort Bragg)",
  "fromState": "full state name of origin",
  "toBase": "title-cased name of destination installation (e.g. Camp Humphreys)",
  "toCountry": "destination country in common English — South Korea not Republic of Korea. If CONUS use United States.",
  "reportDate": "ISO date YYYY-MM-DD parsed from the REPORTING DATE / NOT LATER THAN line",
  "tourLength": "e.g. 24 months",
  "tourType": "accompanied or unaccompanied (lowercase)",
  "dependents": [
    {
      "firstName": "dependent first name",
      "lastName": "dependent last name",
      "relationship": "SPOUSE or CHILD",
      "dob": "ISO date YYYY-MM-DD if DOB is present, else omit this field"
    }
  ],
  "isOconus": true or false,
  "ordersNumber": "e.g. 095-001"
}`

export async function POST(req: NextRequest) {
  const { ordersText } = await req.json()

  if (!ordersText || typeof ordersText !== "string") {
    return NextResponse.json({ error: "ordersText is required" }, { status: 400 })
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "NVIDIA_API_KEY not configured" }, { status: 500 })
  }

  const nvidiaRes = await fetch(`${NVIDIA_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: ordersText },
      ],
      temperature: 0.1,
      max_tokens: 1024,
      stream: false,
    }),
  })

  if (!nvidiaRes.ok) {
    const errText = await nvidiaRes.text()
    console.error("NVIDIA API error:", nvidiaRes.status, errText)
    return NextResponse.json({ error: "LLM call failed", detail: errText }, { status: 502 })
  }

  const json = await nvidiaRes.json()
  const content: string = json.choices?.[0]?.message?.content ?? ""

  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  let parsed: ParsedOrders
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    console.error("JSON parse failed. Raw content:", content)
    return NextResponse.json(
      { error: "Could not parse model response as JSON", raw: content },
      { status: 422 }
    )
  }

  // Normalise fields the model sometimes gets slightly wrong
  parsed.firstName = parsed.firstName?.split(" ")[0] ?? parsed.firstName
  parsed.fromBase = toTitleCase(parsed.fromBase ?? "")
  parsed.toBase = toTitleCase(parsed.toBase ?? "")
  parsed.tourType = (parsed.tourType ?? "").toLowerCase().startsWith("accompan")
    ? "accompanied"
    : "unaccompanied"

  return NextResponse.json(parsed)
}
