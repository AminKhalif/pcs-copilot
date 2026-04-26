import { TriangleAlert, Sparkles, Info } from "lucide-react"
import { CitationPill } from "@/components/citation-pill"
import { GlossaryTerm } from "@/components/glossary-term"

type Finding = {
  type: "warning" | "opportunity" | "note"
  headline: string
  body: string
  citation: string
  sourceUrl: string
}

const FINDINGS: Finding[] = [
  {
    type: "warning",
    headline: "Emma needs an EFMP screening before the move",
    body: "Korea is a command-sponsorship-required location. Without screening, Emma can't enter on your accompanied orders. We've added it to your task list.",
    citation: "DoDI 1315.19",
    sourceUrl: "https://www.esd.whs.mil/Directives/issuances/dodi/",
  },
  {
    type: "opportunity",
    headline: "You're eligible for advance DLA",
    body: "Up to $1,760 paid before the move to cover up-front costs. Most service members don't request it. We can file the request whenever you're ready.",
    citation: "JTR 050208",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  {
    type: "note",
    headline: "You have ~31 days of accrued leave",
    body: "We can apply up to 20 days as Permissive TDY for house-hunting at Camp Humphreys. The rest can be PCS leave en route.",
    citation: "AR 600-8-10",
    sourceUrl: "https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN30018-AR_600-8-10-000-WEB-1.pdf",
  },
]

const TYPE_STYLES = {
  warning: {
    icon: TriangleAlert,
    accent: "#a85c3d",
    bg: "#fff8f5",
    iconBg: "#fdeee8",
  },
  opportunity: {
    icon: Sparkles,
    accent: "#b8924e",
    bg: "#fffbf3",
    iconBg: "#fdf3de",
  },
  note: {
    icon: Info,
    accent: "#1f4d3f",
    bg: "#f3f8f5",
    iconBg: "#e0ede8",
  },
}

// Terms to wrap per finding body
function renderBody(body: string, type: Finding["type"]) {
  if (type === "warning") {
    return (
      <>
        Korea is a command-sponsorship-required location. Without screening, Emma
        can&rsquo;t enter on your accompanied orders. We&rsquo;ve added it to your task
        list. <span style={{ fontStyle: "italic" }}>(Requires{" "}
          <GlossaryTerm term="EFMP">EFMP</GlossaryTerm> enrollment at your{" "}
          <GlossaryTerm term="MTF">MTF</GlossaryTerm>.)</span>
      </>
    )
  }
  if (type === "opportunity") {
    return (
      <>
        Up to $1,760 paid before the move to cover up-front costs. Most service members
        don&rsquo;t request it. We can file the request whenever you&rsquo;re ready.{" "}
        <span style={{ fontStyle: "italic" }}>
          (Claimed against your total{" "}
          <GlossaryTerm term="DLA">DLA</GlossaryTerm> entitlement.)
        </span>
      </>
    )
  }
  return (
    <>
      We can apply up to 20 days as Permissive{" "}
      <GlossaryTerm term="TDY">TDY</GlossaryTerm> for house-hunting at Camp
      Humphreys. The rest can be{" "}
      <GlossaryTerm term="OCONUS">OCONUS</GlossaryTerm> leave en route.
    </>
  )
}

export function FindingsCard() {
  return (
    <section className="card-surface px-10 py-10">
      <div className="label-eyebrow">The agent noticed</div>
      <h2
        className="font-serif mt-3 text-[22px] leading-tight"
        style={{ color: "var(--foreground)" }}
      >
        Three things you didn&rsquo;t ask about.
      </h2>

      <div className="mt-6 flex flex-col gap-4">
        {FINDINGS.map((f) => {
          const style = TYPE_STYLES[f.type]
          const Icon = style.icon
          return (
            <div
              key={f.headline}
              className="flex gap-4 rounded-md px-5 py-4"
              style={{ background: style.bg }}
            >
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: style.iconBg }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color: style.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[14px] font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {f.headline}
                </div>
                <p
                  className="mt-1 text-[13px] leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {renderBody(f.body, f.type)}
                </p>
                <div className="mt-2">
                  <CitationPill label={f.citation} href={f.sourceUrl} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
