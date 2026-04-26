import type { ParsedOrders } from "./types"

export type CatalogTask = {
  id: string
  month: string
  day: string
  title: string
  description: (orders: ParsedOrders) => string
  citation?: string
  sourceUrl?: string
  isAgentEnabled?: boolean
  agentCanHandle: boolean
  appliesIf: (orders: ParsedOrders) => boolean
  // Task detail panel
  whyApplies: (orders: ParsedOrders) => string[]
  whatHappens: string
  whyItMatters: string
  // Agent preview modal
  agentSteps: string[]
  estimatedTime: string
  estimatedSavings: string
  sampleOutputTitle: string
  sampleOutputBody: string
}

const JTR_URL = "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/"
const AR_PUBS_URL = "https://armypubs.army.mil/ProductMaps/PubForm/AR.aspx"
const AR_600_8_10_URL = "https://armypubs.army.mil/epubs/DR_pubs/DR_a/ARN30018-AR_600-8-10-000-WEB-1.pdf"
const USFK_URL = "https://www.usfk.mil/"
const DODEA_URL = "https://www.dodea.edu/about/policy/"

export const TASKS_CATALOG: CatalogTask[] = [
  {
    id: "passports",
    month: "May",
    day: "1",
    title: "Submit dependent passport applications",
    description: (o) => {
      const names = o.dependents.map((d) => d.firstName).join(" and ")
      return `No-fee passports for ${names || "your dependents"}. We'll fill the DS-11 and book the appointment.`
    },
    citation: "AR 600-8-101",
    sourceUrl: AR_PUBS_URL,
    agentCanHandle: true,
    appliesIf: (o) => o.isOconus && o.dependents.length > 0,
    whyApplies: (o) => {
      const names = o.dependents.map((d) => d.firstName).join(" and ")
      return [
        `You're moving OCONUS to ${o.toBase}, which requires official passports for all traveling dependents.`,
        `${names} are listed as authorized dependents on your orders.`,
        "No-fee official passports must be obtained through the military — not through a civilian passport office.",
        "Applications take 6–8 weeks. Missing the May 1 target pushes your travel timeline.",
      ]
    },
    whatHappens: "We'll pull Maria and Emma's DEERS records, pre-fill DS-11 applications for both, and schedule an appointment at the nearest passport acceptance facility. You review and sign — we handle the rest.",
    whyItMatters: "Without official passports, Maria and Emma can't board their military-coordinated flight to Korea. A missed appointment could delay the entire family's departure by weeks.",
    agentSteps: [
      "Open milConnect and verify Maria and Emma's DEERS records",
      "Pre-fill DS-11 forms for both dependents with your orders data",
      "Locate the nearest passport acceptance facility at Fort Bragg",
      "Book the earliest available appointment (typically 2–3 days out)",
      "Send appointment confirmation and checklist to your AKO email",
    ],
    estimatedTime: "4 minutes",
    estimatedSavings: "2 hours",
    sampleOutputTitle: "Passport appointment confirmation",
    sampleOutputBody: `FROM: noreply@passportappointments.mil
TO: jsmith@mail.mil
SUBJECT: Passport Appointment Confirmation — 2 Applicants

Your passport appointments are confirmed.

Applicant 1: Smith, Maria
Applicant 2: Smith, Emma
Date: May 8, 2026 at 10:30 AM
Location: Fort Bragg MPO, Building 4-2843

Bring: Signed DS-11 (attached), orders, birth certificates, 2x2 photos.

Ref: AR 600-8-101 · No-fee passport authorization enclosed.`,
  },

  {
    id: "hhg-method",
    month: "May",
    day: "5",
    title: "Decide household goods method",
    description: () => "Government-arranged or DITY move. We'll model both and recommend.",
    citation: "JTR 051201",
    sourceUrl: JTR_URL,
    agentCanHandle: true,
    appliesIf: () => true,
    whyApplies: (o) => [
      "Every PCS entitles you to move household goods at government expense.",
      `As an ${o.rankGrade}, your weight allowance is 12,000 lbs with dependents.`,
      "You must choose between government-arranged (TSP) or a personally procured move (PPM/DITY) — or split the shipment.",
      "Choosing early gives you better pickup windows before summer rush.",
    ],
    whatHappens: "We'll calculate your authorized weight allowance, estimate the cost of a government move vs a PPM, and give you a clear recommendation with the projected profit or savings.",
    whyItMatters: "A DITY move on a short route can net $2,000–$4,000 in profit. On a long OCONUS route, government-arranged is usually better. Waiting past mid-May means competing for peak-season pickup slots.",
    agentSteps: [
      "Retrieve authorized weight allowance for E-6 with dependents",
      "Calculate estimated shipment weight based on family size and quarters type",
      "Pull current government-move cost estimates for Fort Bragg → JBLM (port)",
      "Calculate PPM/DITY payout at 95% of government cost",
      "Generate comparison table and recommendation",
    ],
    estimatedTime: "2 minutes",
    estimatedSavings: "3 hours",
    sampleOutputTitle: "HHG method comparison",
    sampleOutputBody: `HOUSEHOLD GOODS METHOD ANALYSIS
SSG John A. Smith — Fort Bragg, NC → Camp Humphreys, ROK

Authorized weight: 12,000 lbs (E-6, with dependents)
Estimated actual weight: 8,400 lbs

Government-Arranged Move (TSP)
  Cost to you: $0
  Pickup: June 15–20 window available
  Delivery: 45–60 days transit to Korea

Personally Procured Move (PPM/DITY)
  Government rate: $4,820.00
  PPM payout (95%): $4,579.00
  Your out-of-pocket: ~$2,100
  Net profit: ~$2,479.00

RECOMMENDATION: Government-arranged move.
For OCONUS Korea, the 60-day transit makes PPM impractical
unless you have advance storage at destination.`,
  },

  {
    id: "school-records",
    month: "May",
    day: "15",
    title: "Request school records for Emma",
    description: (o) => {
      const child = o.dependents.find((d) => d.relationship === "CHILD")
      return `DoDEA at ${o.toBase || "the gaining installation"} needs sealed transcripts for ${child?.firstName || "your child"}. We'll send the request to ${o.fromBase || "the losing installation"}.`
    },
    citation: "DoDEA Reg 1342.1",
    sourceUrl: DODEA_URL,
    agentCanHandle: false,
    appliesIf: (o) => o.isOconus && o.dependents.some((d) => d.relationship === "CHILD"),
    whyApplies: (o) => {
      const child = o.dependents.find((d) => d.relationship === "CHILD")
      return [
        `${child?.firstName || "Your child"} will enroll in DoDEA Humphreys — Korea's on-post school.`,
        "DoDEA requires sealed official transcripts from the current school before enrollment.",
        "Civilian schools typically take 10–15 business days to process transfer requests.",
        "Without records, Emma's enrollment is provisional and she may be placed in the wrong grade level.",
      ]
    },
    whatHappens: "We'll draft a transcript request letter to Emma's current school, addressed to the DoDEA Humphreys registrar. You'll need to sign and submit it — schools won't release records to an automated system.",
    whyItMatters: "DoDEA will place Emma in a default grade without transcripts. Getting this right before arrival means she starts school on day one without disruption.",
    agentSteps: [
      "Draft official transcript request letter with your orders data",
      "Address to: Humphreys Elementary School, DoDEA Pacific",
      "Include Emma's current school contact info for direct transfer",
      "Prepare for your signature (requires parent authorization)",
    ],
    estimatedTime: "3 minutes to draft",
    estimatedSavings: "1 hour",
    sampleOutputTitle: "Transcript request letter",
    sampleOutputBody: `May 15, 2026

Registrar, Fayetteville Academy
221 Ramsey Street, Fayetteville, NC 28301

RE: Official Transcript Request — Emma Smith, Grade 3

Dear Registrar,

I am requesting an official sealed transcript for my daughter, Emma Smith (DOB: 03/12/2017), currently enrolled in Grade 3.

My family is relocating under PCS orders (Orders No. 095-001) to Camp Humphreys, Republic of Korea, with an effective date of July 15, 2026.

Please send sealed transcripts directly to:

  DoDEA Humphreys Elementary School
  ATTN: Registrar
  Unit 15441, APO AP 96271

Thank you for your prompt attention.

/s/ SSG John A. Smith`,
  },

  {
    id: "dps-pickup",
    month: "May",
    day: "30",
    title: "Schedule household goods pickup in DPS",
    description: () => "We'll log into DPS, file your move details, and book your pickup window.",
    citation: "JTR 051201",
    sourceUrl: JTR_URL,
    agentCanHandle: true,
    appliesIf: () => true,
    whyApplies: (o) => [
      "Your household goods shipment must be booked through DPS (move.mil) — the government's move management portal.",
      `As an ${o.rankGrade}, you're authorized to ship up to 12,000 lbs at government expense.`,
      "Summer pickup slots (June–July) fill up fast — booking before May 30 gives you the best window.",
      "DPS booking triggers the TSP assignment and your pickup confirmation.",
    ],
    whatHappens: "We'll log into DPS with your CAC, enter your move details (origin, destination, weight estimate, required delivery date), and secure a pickup window for your preferred June date.",
    whyItMatters: "Waiting past June means competing with 50,000 other military families moving in the summer. Late booking can delay your HHG arrival by months — leaving you without furniture at a new duty station.",
    agentSteps: [
      "Navigate to move.mil and log in with your EDIPI",
      "Create new shipment: Fort Bragg → Camp Humphreys, Korea",
      "Enter estimated weight (8,400 lbs) and required delivery date",
      "Select preferred pickup window: June 15–20, 2026",
      "Confirm TSP assignment and save booking confirmation",
    ],
    estimatedTime: "6 minutes",
    estimatedSavings: "2 hours",
    sampleOutputTitle: "DPS booking confirmation",
    sampleOutputBody: `DEFENSE PERSONAL PROPERTY SYSTEM
SHIPMENT CONFIRMATION

Shipment Number: BRAG-2026-HHG-004421
Service Member: SSG John A. Smith
From: Fort Bragg, NC 28310
To: Camp Humphreys, ROK (APO AP 96271)

Pickup Window: June 16–17, 2026
Estimated Weight: 8,400 lbs
Authorized Weight: 12,000 lbs

TSP Assigned: Allied Van Lines (Government Contract)
Contact: 1-800-555-0182

Required Delivery Date: August 1, 2026
Estimated Transit: 45–60 days

Status: CONFIRMED ✓`,
  },

  {
    id: "sofa",
    month: "June",
    day: "1",
    title: "Apply for SOFA stamp at SF embassy",
    description: (o) => {
      const deps = o.dependents.map((d) => d.firstName).join(" and ")
      return `Required for ${deps || "your dependents"} to enter Korea. We'll prep Form 5434-E.`
    },
    citation: "USFK Reg 600-106",
    sourceUrl: USFK_URL,
    agentCanHandle: true,
    appliesIf: (o) =>
      (o.toCountry ?? "").toLowerCase().includes("korea") && o.dependents.length > 0,
    whyApplies: (o) => {
      const deps = o.dependents.map((d) => d.firstName).join(" and ")
      return [
        `Korea requires SOFA stamp for all command-sponsored dependents — without it, ${deps} cannot legally enter the country on your orders.`,
        "SOFA stamps are issued through the Korean consulate (San Francisco or Los Angeles) — not through Army channels.",
        "Processing takes 21–30 days after submission.",
        "Your July 15 reporting date requires applying no later than June 1.",
      ]
    },
    whatHappens: "We'll pre-fill Form 5434-E for Maria and Emma, attach a cover letter citing your orders, and submit through the USFK online portal. We'll also set a 21-day follow-up reminder.",
    whyItMatters: "Without the SOFA stamp, Maria and Emma will be turned away at the Korean border. Accompanied orders become unaccompanied by default — you'd be separated from your family at arrival.",
    agentSteps: [
      "Open the South Korean consulate web portal for SOFA applications",
      "Pre-fill Form 5434-E with your orders data for Maria and Emma",
      "Attach dependent passport scans and PCS orders",
      "Submit application and save confirmation number",
      "Set 21-day follow-up reminder for status check",
    ],
    estimatedTime: "6 minutes",
    estimatedSavings: "3 hours",
    sampleOutputTitle: "SOFA application confirmation",
    sampleOutputBody: `REPUBLIC OF KOREA CONSULATE GENERAL
SAN FRANCISCO — SOFA STAMP APPLICATION

Application Number: SOFA-2026-SF-114892
Submitted: June 1, 2026

Applicants:
  1. Smith, Maria — Spouse (Passport #B28841902)
  2. Smith, Emma — Child (Passport #C19284710)

Sponsoring Service Member: SSG John A. Smith
Orders Number: 095-001
Gaining Unit: Camp Humphreys, ROK

Status: RECEIVED — Processing (21–30 days)
Expected Completion: June 22–July 1, 2026

Reference: USFK Regulation 600-106
Confirm receipt by: sofa.sf@mofa.go.kr`,
  },

  {
    id: "leave-form",
    month: "June",
    day: "10",
    title: "Submit DA 31 for PCS leave",
    description: () => "You're authorized up to 30 days of permissive TDY or ordinary leave en route. We'll prepare the DA 31.",
    citation: "AR 600-8-10",
    sourceUrl: AR_600_8_10_URL,
    agentCanHandle: false,
    appliesIf: () => true,
    whyApplies: () => [
      "PCS orders authorize ordinary leave between the losing and gaining unit.",
      "You're also eligible for up to 10 days of Permissive TDY at Camp Humphreys for house-hunting.",
      "DA 31 must be submitted to your unit 30 days before your requested leave start.",
      "Leave not requested is leave lost — the Army won't grant it retroactively.",
    ],
    whatHappens: "We'll draft the DA 31 with your leave dates, losing unit info, and reporting date. You'll need your commander's signature — we can't automate that step.",
    whyItMatters: "If you miss the DA 31 submission window, you may have to report directly to Korea without leave. You'd arrive jet-lagged with no buffer to find off-post housing before your family arrives.",
    agentSteps: [
      "Calculate authorized leave: departure date to reporting date",
      "Draft DA 31 with leave period (June 28 – July 14, 2026)",
      "Include Permissive TDY block: July 5–14 at Camp Humphreys",
      "Prepare form for commander signature (required by regulation)",
    ],
    estimatedTime: "3 minutes to draft",
    estimatedSavings: "1 hour",
    sampleOutputTitle: "Draft DA 31",
    sampleOutputBody: `DA FORM 31 — REQUEST AND AUTHORITY FOR LEAVE
(Draft — Requires Commander Signature)

SECTION I — IDENTIFICATION
Name: SMITH, JOHN A.          Rank: SSG
SSN (last 4): 6789            Unit: B CO, 2-504 PIR, 82D ABN DIV

SECTION II — REQUEST
Leave Type: [X] Ordinary  [ ] Emergency  [X] Permissive TDY
From: 28 June 2026            To: 14 July 2026
Days Requested: 17 (10 ordinary + 7 PTDY)

Address during leave: En route to Camp Humphreys, ROK
Point of Contact: jsmith@mail.mil / (910) 555-0147

SECTION III — AUTHORITY
Auth: AR 600-8-10, para 5-6 (PCS leave)
       AR 600-8-10, para 6-7 (Permissive TDY, house-hunting)

Commander Signature: ____________________  Date: _______`,
  },

  {
    id: "poa",
    month: "June",
    day: "15",
    title: "Execute a general power of attorney",
    description: (o) => {
      const spouse = o.dependents.find((d) => d.relationship === "SPOUSE")
      return `${spouse?.firstName || "Your spouse"} will need POA to handle housing, vehicles, and banking while you're in transit. We'll draft it.`
    },
    citation: "AR 27-3",
    sourceUrl: AR_PUBS_URL,
    agentCanHandle: true,
    appliesIf: (o) => o.dependents.some((d) => d.relationship === "SPOUSE"),
    whyApplies: (o) => {
      const spouse = o.dependents.find((d) => d.relationship === "SPOUSE")
      return [
        `${spouse?.firstName || "Your spouse"} will need legal authority to act on your behalf while you're in transit and during the first weeks in Korea.`,
        "A General POA covers: selling/buying vehicles, signing lease agreements, closing bank accounts, managing TRICARE enrollment.",
        "Without POA, Maria can't sign the housing contract at Humphreys or handle any financial transactions in your name.",
        "JAG offices at Fort Bragg provide POA services for free — appointments are required.",
      ]
    },
    whatHappens: "We'll draft a General Power of Attorney naming Maria as your attorney-in-fact, schedule a JAG appointment for notarization, and prepare a summary of what each clause covers.",
    whyItMatters: "If Maria arrives at Humphreys without POA and you're still in transit, she can't sign the housing assignment form. Families have waited days in the welcome center for the service member to physically arrive.",
    agentSteps: [
      "Draft General POA document naming Maria Smith as attorney-in-fact",
      "Include standard PCS clauses: housing, vehicles, banking, TRICARE",
      "Schedule JAG appointment at Fort Bragg Legal Assistance Office",
      "Prepare summary document explaining each clause to Maria",
      "Send calendar invite with appointment details and checklist",
    ],
    estimatedTime: "5 minutes",
    estimatedSavings: "2 hours",
    sampleOutputTitle: "Power of attorney draft",
    sampleOutputBody: `GENERAL POWER OF ATTORNEY

I, JOHN A. SMITH, SSN ***-**-6789, a Sergeant First Class in the
United States Army, hereby appoint MARIA SMITH, my spouse, as my
attorney-in-fact to act in my name and on my behalf.

This Power of Attorney authorizes my agent to:

1. Execute lease agreements and housing documents at Camp
   Humphreys, Republic of Korea, or any other location;
2. Sell, purchase, or transfer title to any motor vehicle;
3. Access, manage, and close financial accounts held in my name;
4. Enroll, modify, or disenroll dependents in TRICARE;
5. Execute any documents necessary for military family support.

This Power of Attorney is effective immediately and remains in
force until revoked in writing or for one (1) year from the
date of execution, whichever comes first.

Executed at Fort Bragg, North Carolina on _____________, 2026.

____________________________      ____________________________
SSG John A. Smith                  Notary Public
                                   My commission expires: _______`,
  },

  {
    id: "dts-voucher",
    month: "Jul",
    day: "22",
    title: "Submit your travel voucher in DTS",
    description: () =>
      "Claim your DLA, per diem, and MALT after you arrive. Our agent will file DD 1351-2 for you.",
    citation: "JTR 010301",
    sourceUrl: JTR_URL,
    isAgentEnabled: true,
    agentCanHandle: true,
    appliesIf: () => true,
    whyApplies: (o) => [
      `You completed PCS travel from Fort Bragg to ${o.toBase} — you must file a travel voucher to be reimbursed.`,
      "DD 1351-2 claims your DLA ($3,521.49), per diem ($612.52), MALT ($154.00), and TLE ($226.20).",
      "Vouchers must be filed within 5 days of completing travel — July 22 is your deadline.",
      "Most service members leave money on the table by filing late or missing line items.",
    ],
    whatHappens: "Our browser agent will open DTS, log in with your credentials, navigate to the voucher form, fill in all fields from your orders and calculated entitlements, review, and submit — while you watch.",
    whyItMatters: "A late or incomplete voucher means delayed reimbursement. $4,514.21 in entitlements will stay unclaimed until you file. Finance officers can reject late vouchers.",
    agentSteps: [
      "Open DTS portal and log in with your credentials",
      "Navigate to 'Create New Voucher' → DD Form 1351-2",
      "Fill member info, travel dates, and locations from your orders",
      "Enter entitlement amounts: DLA $3,521.49, Per Diem $612.52, MALT $154.00, TLE $226.20",
      "Review all entries, scroll through form, submit",
    ],
    estimatedTime: "8 minutes (live browser)",
    estimatedSavings: "2 hours",
    sampleOutputTitle: "DTS submission confirmation",
    sampleOutputBody: "Confirmation #DTS-2026-09451",
  },
]

export function getApplicableTasks(orders: ParsedOrders): CatalogTask[] {
  return TASKS_CATALOG.filter((t) => t.appliesIf(orders))
}
