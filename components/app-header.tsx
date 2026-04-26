"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { ParsedOrders } from "@/lib/types"

type Props = {
  parsedOrders?: ParsedOrders | null
}

export function AppHeader({ parsedOrders }: Props) {
  const memberName = parsedOrders
    ? `${parsedOrders.rankAbbr} ${parsedOrders.firstName} ${parsedOrders.lastName}`
    : null
  const memberSub = parsedOrders
    ? `${parsedOrders.rankGrade} · ${parsedOrders.fromBase}`
    : null

  return (
    <header className="border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-[960px] items-center justify-between px-8 py-5">
        <span
          className="font-serif text-[18px] font-medium tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          PCS Copilot
        </span>

        <div className="flex items-center gap-6">
          {/* Agent online — always visible */}
          <TooltipPrimitive.Provider delayDuration={150}>
            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger asChild>
                <div className="flex items-center gap-1.5 cursor-default select-none">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: "var(--primary)" }}
                  />
                  <span
                    className="text-[11px] font-medium uppercase tracking-widest"
                    style={{ color: "var(--primary)", letterSpacing: "0.1em" }}
                  >
                    Agent online
                  </span>
                </div>
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                  sideOffset={8}
                  className="z-50 rounded-md shadow-md"
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--border)",
                    padding: "8px 12px",
                    maxWidth: 260,
                  }}
                >
                  <p className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                    Continuously monitoring for changes to your orders, regulations, and entitlements.
                  </p>
                  <TooltipPrimitive.Arrow style={{ fill: "#ffffff" }} />
                </TooltipPrimitive.Content>
              </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
          </TooltipPrimitive.Provider>

          {/* Member identity — only after orders are parsed */}
          {memberName && (
            <div className="text-right leading-tight">
              <div className="text-[14px] font-normal text-foreground">{memberName}</div>
              <div className="text-[12px] text-muted-foreground">{memberSub}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
