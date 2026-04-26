"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AppHeader } from "@/components/app-header"
import { HeroOrders } from "@/components/hero-orders"
import { NarrationBlock } from "@/components/narration-block"
import { FindingsCard } from "@/components/findings-card"
import { MoneyCard } from "@/components/money-card"
import { WorkCard } from "@/components/work-card"
import { OrdersInput } from "@/components/orders-input"
import { LoadingOrders } from "@/components/loading-orders"
import type { ParsedOrders } from "@/lib/types"

type AppState = "empty" | "loading" | "loaded"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("empty")
  const [parsedOrders, setParsedOrders] = useState<ParsedOrders | null>(null)
  const [ordersText, setOrdersText] = useState("")
  const [analyzeCount, setAnalyzeCount] = useState(0)
  const [dtsDone, setDtsDone] = useState(false)

  async function handleOrdersSubmit(text: string) {
    setOrdersText(text)
    setAppState("loading")
    const startTime = Date.now()

    try {
      const res = await fetch("/api/parse-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordersText: text }),
      })
      if (!res.ok) throw new Error("Parse failed")
      const data: ParsedOrders = await res.json()

      const elapsed = Date.now() - startTime
      if (elapsed < 1200) await delay(1200 - elapsed)

      setParsedOrders(data)
      setAnalyzeCount((c) => c + 1)
      setDtsDone(false)
      setAppState("loaded")
    } catch (err) {
      console.error(err)
      const elapsed = Date.now() - startTime
      if (elapsed < 1200) await delay(1200 - elapsed)
      setAppState("loaded")
    }
  }

  function handleEdit() {
    setAppState("empty")
  }

  function handleDtsDone() {
    setDtsDone(true)
    toast.success("Travel voucher filed.", {
      description: "Direct deposit expected in 3–5 business days.",
      duration: 5000,
    })
  }

  if (appState === "empty") {
    return (
      <main className="min-h-screen w-full bg-background">
        <AppHeader />
        <OrdersInput
          onSubmit={handleOrdersSubmit}
          isLoading={false}
          initialText={ordersText}
          submitLabel={ordersText ? "Re-analyze orders" : undefined}
        />
      </main>
    )
  }

  if (appState === "loading") {
    return (
      <main className="min-h-screen w-full bg-background">
        <AppHeader />
        <LoadingOrders />
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full bg-background">
      <AppHeader parsedOrders={parsedOrders} />
      <div className="mx-auto max-w-[960px] px-8 pt-12 pb-20">
        <div className="space-y-16">
          <HeroOrders parsedOrders={parsedOrders ?? undefined} onEdit={handleEdit} />
          <NarrationBlock parsedOrders={parsedOrders ?? undefined} />
          <FindingsCard />
          <MoneyCard key={analyzeCount} parsedOrders={parsedOrders ?? undefined} dtsDone={dtsDone} />
          <WorkCard
            parsedOrders={parsedOrders ?? undefined}
            dtsDone={dtsDone}
            onDtsDone={handleDtsDone}
            onDemoReset={() => setDtsDone(false)}
          />
        </div>
      </div>
    </main>
  )
}
