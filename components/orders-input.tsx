"use client"

import { useState } from "react"
import { Plane } from "lucide-react"
import { SAMPLE_ORDERS } from "@/lib/sample-orders"

type Props = {
  onSubmit: (ordersText: string) => void
  isLoading: boolean
  initialText?: string
  submitLabel?: string
}

export function OrdersInput({ onSubmit, isLoading, initialText = "", submitLabel }: Props) {
  const [text, setText] = useState(initialText)

  function handleSubmit() {
    if (!text.trim()) return
    onSubmit(text.trim())
  }

  return (
    <div className="mx-auto max-w-[960px] px-8 pt-16 pb-20">
      <div className="card-surface px-10 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Plane
            className="h-5 w-5 -rotate-45 shrink-0"
            strokeWidth={1.5}
            style={{ color: "var(--primary)" }}
          />
          <span className="label-eyebrow">Get started</span>
        </div>
        <h1 className="font-serif text-[32px] leading-tight text-foreground mt-3">
          Paste your PCS orders to begin.
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground max-w-[560px]">
          We&apos;ll read your orders, calculate what you&apos;re owed, and build your move timeline — in seconds.
        </p>

        {/* Textarea */}
        <div className="mt-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your orders document here…"
            rows={14}
            className="w-full resize-none rounded-md border px-4 py-3 text-[13px] font-mono leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1 transition-shadow"
            style={{
              background: "var(--secondary)",
              borderColor: "var(--border)",
            }}
          />
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled)
                e.currentTarget.style.background = "#173d32"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--primary)"
            }}
          >
            {isLoading ? "Analyzing…" : (submitLabel ?? "Analyze orders")}
          </button>

          <button
            type="button"
            onClick={() => setText(SAMPLE_ORDERS)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[14px] font-medium transition-colors disabled:opacity-40"
            style={{
              background: "var(--secondary)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            Use sample orders
          </button>
        </div>

        <p className="mt-4 text-[12px] text-muted-foreground">
          Your orders are processed locally and never stored.
        </p>
      </div>
    </div>
  )
}
