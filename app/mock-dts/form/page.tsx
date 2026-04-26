"use client"

import { useRouter } from "next/navigation"

const inp: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  border: "1px solid #565c65",
  borderRadius: "4px",
  fontSize: "13px",
  boxSizing: "border-box",
  fontFamily: "inherit",
  backgroundColor: "white",
}

const lbl: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: "#1b1b1b",
  marginBottom: "4px",
  letterSpacing: "0.01em",
}

const fieldset: React.CSSProperties = {
  border: "1px solid #dfe1e2",
  borderRadius: "4px",
  padding: "20px",
  marginBottom: "20px",
  background: "white",
}

const legend: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#005ea2",
  padding: "0 8px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
}

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
}

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "14px",
}

export default function DtsFormPage() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push("/mock-dts/confirmation")
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ background: "#005ea2", color: "white", fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "2px", letterSpacing: "0.05em" }}>
            TRAVEL VOUCHER
          </div>
          <div style={{ fontSize: "11px", color: "#71767a", fontWeight: "700", letterSpacing: "0.05em" }}>
            OMB No. 0704-0420
          </div>
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1b1b1b", margin: "0 0 4px 0" }}>
          DD Form 1351-2 — Travel Voucher or Subvoucher
        </h1>
        <p style={{ fontSize: "13px", color: "#565c65", margin: 0 }}>
          PCS Travel · Voucher Type: Permanent Change of Station · Fiscal Year 2026
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Member Information */}
        <fieldset style={fieldset}>
          <legend style={legend}>Section 1 — Member Information</legend>
          <div style={{ ...grid2, marginBottom: "14px" }}>
            <div>
              <label htmlFor="member-name" style={lbl}>Name (Last, First MI)</label>
              <input id="member-name" type="text" style={inp} placeholder="Smith, John A." />
            </div>
            <div>
              <label htmlFor="ssn-last4" style={lbl}>SSN (Last 4)</label>
              <input id="ssn-last4" type="text" style={inp} placeholder="XXXX" maxLength={4} />
            </div>
          </div>
          <div style={grid3}>
            <div>
              <label htmlFor="rank" style={lbl}>Rank / Rate</label>
              <input id="rank" type="text" style={inp} placeholder="SSG" />
            </div>
            <div>
              <label htmlFor="grade" style={lbl}>Pay Grade</label>
              <input id="grade" type="text" style={inp} placeholder="E-6" />
            </div>
            <div>
              <label htmlFor="unit" style={lbl}>Unit / Organization</label>
              <input id="unit" type="text" style={inp} placeholder="Unit designation" />
            </div>
          </div>
        </fieldset>

        {/* Section 2: Travel Information */}
        <fieldset style={fieldset}>
          <legend style={legend}>Section 2 — Travel Information</legend>
          <div style={{ ...grid2, marginBottom: "14px" }}>
            <div>
              <label htmlFor="departure-date" style={lbl}>Departure Date (MM/DD/YYYY)</label>
              <input id="departure-date" type="text" style={inp} placeholder="MM/DD/YYYY" />
            </div>
            <div>
              <label htmlFor="arrival-date" style={lbl}>Arrival Date (MM/DD/YYYY)</label>
              <input id="arrival-date" type="text" style={inp} placeholder="MM/DD/YYYY" />
            </div>
          </div>
          <div style={{ ...grid2, marginBottom: "14px" }}>
            <div>
              <label htmlFor="from-location" style={lbl}>From (PDS of Departure)</label>
              <input id="from-location" type="text" style={inp} placeholder="Fort Bragg, NC" />
            </div>
            <div>
              <label htmlFor="to-location" style={lbl}>To (New PDS)</label>
              <input id="to-location" type="text" style={inp} placeholder="Camp Humphreys, ROK" />
            </div>
          </div>
          <div style={{ width: "50%", paddingRight: "7px" }}>
            <label htmlFor="travel-mode" style={lbl}>Mode of Travel</label>
            <input id="travel-mode" type="text" style={inp} placeholder="Commercial Air / POV / etc." />
          </div>
        </fieldset>

        {/* Section 3: Entitlement Amounts */}
        <fieldset style={fieldset}>
          <legend style={legend}>Section 3 — Entitlement Amounts (USD)</legend>
          <div style={{ background: "#e7f3fa", border: "1px solid #99c4e6", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#1a4480" }}>
            Enter authorized amounts per your Travel Authorization. All amounts subject to Finance Officer review and applicable JTR provisions.
          </div>
          <div style={grid3}>
            <div>
              <label htmlFor="dla-amount" style={lbl}>Dislocation Allowance (DLA)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#565c65", fontSize: "13px" }}>$</span>
                <input id="dla-amount" type="text" style={{ ...inp, paddingLeft: "22px" }} placeholder="0.00" />
              </div>
            </div>
            <div>
              <label htmlFor="perdiem-amount" style={lbl}>Travel Per Diem</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#565c65", fontSize: "13px" }}>$</span>
                <input id="perdiem-amount" type="text" style={{ ...inp, paddingLeft: "22px" }} placeholder="0.00" />
              </div>
            </div>
            <div>
              <label htmlFor="malt-amount" style={lbl}>Mileage Allowance (MALT)</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#565c65", fontSize: "13px" }}>$</span>
                <input id="malt-amount" type="text" style={{ ...inp, paddingLeft: "22px" }} placeholder="0.00" />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Section 4: Dependents */}
        <fieldset style={fieldset}>
          <legend style={legend}>Section 4 — Dependent Travel</legend>
          <div style={{ ...grid2 }}>
            <div>
              <label htmlFor="dependent-count" style={lbl}>Number of Dependents</label>
              <input id="dependent-count" type="text" style={inp} placeholder="0" />
            </div>
            <div>
              <label htmlFor="dependent-names" style={lbl}>Dependent Names</label>
              <input id="dependent-names" type="text" style={inp} placeholder="Last, First; Last, First" />
            </div>
          </div>
        </fieldset>

        {/* Certification block */}
        <div style={{ background: "white", border: "1px solid #dfe1e2", borderRadius: "4px", padding: "20px", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", color: "#1b1b1b", lineHeight: "1.6", marginBottom: "16px" }}>
            <strong>Certification:</strong> I certify that this voucher is true and correct to the best of my knowledge and belief, and that payment or credit has not been received for the expenses claimed.
          </div>
          <button
            id="submit-voucher"
            type="submit"
            style={{
              background: "#005ea2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "12px 32px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Submit Voucher for Review
          </button>
          <span style={{ marginLeft: "16px", fontSize: "12px", color: "#71767a" }}>
            Submission will route to your unit Finance Officer for approval.
          </span>
        </div>
      </form>
    </div>
  )
}
