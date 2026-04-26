import { NextResponse } from "next/server"
import fs from "fs"

const RECEIPT_FILE = "/tmp/pcs-receipt.pdf"

export async function GET() {
  try {
    const pdf = fs.readFileSync(RECEIPT_FILE)
    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="pcs-voucher-receipt.pdf"',
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return NextResponse.json({ error: "Receipt not yet available" }, { status: 404 })
  }
}
