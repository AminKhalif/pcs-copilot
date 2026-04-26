import type { ParsedOrders } from "@/lib/types"
import { getApplicableTasks } from "@/lib/tasks-catalog"

function daysUntil(iso: string): number {
  const target = new Date(iso + "T12:00:00Z").getTime()
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target - now.getTime()) / 86_400_000))
}

const FALLBACK_ORDERS: ParsedOrders = {
  firstName: "John", lastName: "Smith", rankAbbr: "SSG", rankGrade: "E-6",
  fromBase: "Fort Bragg", fromState: "North Carolina",
  toBase: "Camp Humphreys", toCountry: "Republic of Korea",
  reportDate: "2026-07-15", tourLength: "24 months", tourType: "accompanied",
  dependents: [
    { firstName: "Maria", lastName: "Smith", relationship: "SPOUSE" },
    { firstName: "Emma", lastName: "Smith", relationship: "CHILD" },
  ],
  isOconus: true, ordersNumber: "095-001",
}

type Props = { parsedOrders?: ParsedOrders }

export function NarrationBlock({ parsedOrders }: Props) {
  const orders = parsedOrders ?? FALLBACK_ORDERS
  const tasks = getApplicableTasks(orders)
  const handled = tasks.filter((t) => t.agentCanHandle).length
  const days = daysUntil(orders.reportDate)
  const destination = orders.toBase

  return (
    <div className="px-2">
      <p
        className="text-[15px] italic leading-relaxed max-w-[700px]"
        style={{ color: "var(--muted-foreground)" }}
      >
        &ldquo;I&rsquo;ve reviewed your orders to {destination}. There are{" "}
        <span style={{ color: "var(--foreground)", fontStyle: "normal", fontWeight: 500 }}>
          {tasks.length} things
        </span>{" "}
        that need to happen in the next{" "}
        <span style={{ color: "var(--foreground)", fontStyle: "normal", fontWeight: 500 }}>
          {days} days
        </span>
        . I can handle{" "}
        <span style={{ color: "var(--primary)", fontStyle: "normal", fontWeight: 500 }}>
          {handled} of them
        </span>{" "}
        for you, including the SOFA stamp paperwork that often delays accompanied PCS moves
        to Korea. Let&rsquo;s start with what&rsquo;s most urgent.&rdquo;
      </p>
    </div>
  )
}
