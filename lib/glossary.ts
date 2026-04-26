export type GlossaryEntry = {
  fullName: string
  explanation: string
  sourceUrl: string
}

export type CitationDetail = {
  fullName: string
  explanation: string
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  DLA: {
    fullName: "Dislocation Allowance",
    explanation: "A one-time payment to offset household relocation costs when the Army orders you to move.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  MALT: {
    fullName: "Monetary Allowance in Lieu of Transportation",
    explanation: "Per-mile reimbursement for driving your own vehicle to your new duty station instead of flying.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  TLE: {
    fullName: "Temporary Lodging Expense",
    explanation: "Hotel reimbursement at the departure side while your household goods are in transit — capped at 10 days.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  OHA: {
    fullName: "Overseas Housing Allowance",
    explanation: "Monthly allowance covering rent and utilities at an overseas duty station.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  DPS: {
    fullName: "Defense Personal Property System",
    explanation: "The DoD portal at move.mil where you schedule, manage, and track your household goods shipment.",
    sourceUrl: "https://www.move.mil/",
  },
  DTS: {
    fullName: "Defense Travel System",
    explanation: "The Army's official travel management system — used to book travel and submit DD 1351-2 vouchers for reimbursement.",
    sourceUrl: "https://www.defensetravel.dod.mil/",
  },
  DoDEA: {
    fullName: "Department of Defense Education Activity",
    explanation: "The school system that runs on-base schools for military children worldwide, including Camp Humphreys.",
    sourceUrl: "https://www.dodea.edu/",
  },
  EFMP: {
    fullName: "Exceptional Family Member Program",
    explanation: "Mandatory enrollment for family members with special medical or educational needs — required before any command-sponsored OCONUS move.",
    sourceUrl: "https://www.militaryonesource.mil/family-relationships/special-needs/exceptional-family-member/",
  },
  MTF: {
    fullName: "Military Treatment Facility",
    explanation: "On-base hospital or clinic — your MTF performs EFMP screenings and issues medical clearances for OCONUS moves.",
    sourceUrl: "https://www.tricare.mil/",
  },
  OCONUS: {
    fullName: "Outside the Continental United States",
    explanation: "Any duty station outside the 48 contiguous states — includes Hawaii, Alaska, and all overseas assignments like Korea.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  CONUS: {
    fullName: "Continental United States",
    explanation: "The 48 contiguous states — a CONUS PCS stays within this area and has different entitlements from OCONUS.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  SOFA: {
    fullName: "Status of Forces Agreement",
    explanation: "A bilateral treaty defining the legal status of U.S. military personnel and families in a host country — Korea requires a SOFA stamp for accompanied dependents.",
    sourceUrl: "https://www.usfk.mil/",
  },
  JAG: {
    fullName: "Judge Advocate General",
    explanation: "The Army's legal corps — JAG offices on post draft powers of attorney and advise on legal issues during PCS.",
    sourceUrl: "https://armypubs.army.mil/ProductMaps/PubForm/AR.aspx",
  },
  POA: {
    fullName: "Power of Attorney",
    explanation: "Legal document authorizing your spouse or another person to act on your behalf for financial, legal, and housing matters during your move.",
    sourceUrl: "https://armypubs.army.mil/ProductMaps/PubForm/AR.aspx",
  },
  JTR: {
    fullName: "Joint Travel Regulations",
    explanation: "The DoD travel policy rule book — governs all military travel entitlements including DLA, per diem, MALT, TLE, and OHA.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  AR: {
    fullName: "Army Regulation",
    explanation: "Army-specific policy documents — AR 600-8-10 governs leaves and passes; AR 614-30 governs OCONUS assignments.",
    sourceUrl: "https://armypubs.army.mil/ProductMaps/PubForm/AR.aspx",
  },
  DoDI: {
    fullName: "Department of Defense Instruction",
    explanation: "DoD-wide policy instructions that apply across all service branches — cited for OCONUS PCS requirements.",
    sourceUrl: "https://www.esd.whs.mil/Directives/issuances/dodi/",
  },
  USFK: {
    fullName: "United States Forces Korea",
    explanation: "The combined command for all U.S. military forces in South Korea — issues Korea-specific regulations for PCS moves.",
    sourceUrl: "https://www.usfk.mil/",
  },
  TDY: {
    fullName: "Temporary Duty",
    explanation: "A short-term assignment away from your home station — Permissive TDY during PCS lets you house-hunt at your new duty station.",
    sourceUrl: "https://www.travel.dod.mil/Policy-Regulations/Joint-Travel-Regulations/",
  },
  DEERS: {
    fullName: "Defense Enrollment Eligibility Reporting System",
    explanation: "The DoD database of military personnel and dependents — must be current before dependents can get passports or access TRICARE.",
    sourceUrl: "https://www.dmdc.osd.mil/appj/dwp/index.faces",
  },
}

export const CITATION_DETAILS: Record<string, CitationDetail> = {
  "JTR 050201": {
    fullName: "Joint Travel Regulations, Chapter 5, §050201",
    explanation: "Sets Dislocation Allowance rates by pay grade and dependency status for all PCS moves.",
  },
  "JTR 020204": {
    fullName: "Joint Travel Regulations, Chapter 2, §020204",
    explanation: "Establishes per diem entitlements for official travel, including OCONUS transit days.",
  },
  "JTR 020403": {
    fullName: "Joint Travel Regulations, Chapter 2, §020403",
    explanation: "Governs the Monetary Allowance in Lieu of Transportation (MALT) rate and calculation method.",
  },
  "JTR 050601": {
    fullName: "Joint Travel Regulations, Chapter 5, §050601",
    explanation: "Sets Temporary Lodging Expense entitlements — limited to 10 days at the departure location.",
  },
  "JTR 010301": {
    fullName: "Joint Travel Regulations, Chapter 1, §010301",
    explanation: "Defines travel voucher types and the requirement to file DD 1351-2 after completing PCS travel.",
  },
  "JTR 051201": {
    fullName: "Joint Travel Regulations, Chapter 5, §051201",
    explanation: "Governs household goods weight allowances and the choice between government-arranged and DITY moves.",
  },
  "JTR 050208": {
    fullName: "Joint Travel Regulations, Chapter 5, §050208",
    explanation: "Authorizes advance payment of DLA before the move to cover up-front household relocation costs.",
  },
  "AR 600-8-10": {
    fullName: "Army Regulation 600-8-10 (Leaves and Passes)",
    explanation: "Governs all Army leave types including PCS leave, permissive TDY for house-hunting, and en-route leave.",
  },
  "AR 600-8-101": {
    fullName: "Army Regulation 600-8-101 (Personnel Processing)",
    explanation: "Sets in- and out-processing requirements, including passport applications and personnel records updates.",
  },
  "DoDI 1315.18": {
    fullName: "DoD Instruction 1315.18 (Procedures for Military Personnel Assignments)",
    explanation: "Establishes policies for PCS assignments, including OCONUS eligibility and command-sponsorship rules.",
  },
  "DoDI 1315.19": {
    fullName: "DoD Instruction 1315.19 (Authorizing Special Needs Dependents Travel)",
    explanation: "Requires EFMP enrollment and medical screening before dependents travel to OCONUS command-sponsored locations.",
  },
  "USFK Reg 600-106": {
    fullName: "USFK Regulation 600-106 (Command Sponsorship)",
    explanation: "Korea-specific rule requiring dependents to have command sponsorship and SOFA stamps before entry.",
  },
  "DoDEA Reg 1342.1": {
    fullName: "DoDEA Regulation 1342.1 (Student Enrollment)",
    explanation: "Sets enrollment requirements for DoDEA schools, including transfer of sealed academic records.",
  },
  "AR 27-3": {
    fullName: "Army Regulation 27-3 (The Army Legal Assistance Program)",
    explanation: "Governs legal assistance for soldiers and families, including powers of attorney during PCS.",
  },
}
